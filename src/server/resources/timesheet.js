var _ = require('lodash');
var moment = require('moment');

var Q = require('q');
var db = require('../db');
var util = require('../../common/util');
var period = require('./period');
var User = require('./user');

function fmtDayDate(row) {
    return moment(row.day_date).format('YYYY-MM-DD');
}

function hasKeyPrefix(prefix) {
    return function (value, key) {
        return _.startsWith(key, prefix);
    };
}

// todo remove dupliocate to TimesheetDirective
function getTargetTime(date, user) {
    let day = util.getDayDuration(moment.duration(user.usr_target_time));

    var defaultWeekdayWorktime = {
        hours: day.hours(),
        minutes: day.minutes()
    };

    if (parseInt(date.format('E')) < 6)
        return defaultWeekdayWorktime;
    return {'hours': 0};
}

/**
 * fetches all days from a period and joins the user periods data to it if present
 *
 * @param client
 * @param userId
 * @param dateRange
 * @returns {*}
 */
function fetchPeriodsGroupedByDay(client, userId, dateRange, periodTypes) {
    var periodQuery = 'SELECT * FROM user_get_day_periods($1, $2::timestamp, $3::timestamp)';

    return db.query(client, periodQuery, [userId, dateRange.start.toISOString(),  dateRange.end.toISOString()]).then(function (result) {
        var grouped = _.groupBy(result.rows, fmtDayDate);
        var data = _.mapValues(grouped, function (periods) {
            // pick day fields from first period in list to get all props for the day
            var day = _.pick(_.first(periods), hasKeyPrefix('day_'));

            function transformPeriod(data) {
                // only pick props that *do not* have a "day_" prefix
                let periodData = _.omit(data, hasKeyPrefix('day_'));
                return period.preparePeriodForApiResponse(periodData);
            }

            return _.assign(day,
                {
                    periods: _.filter(periods.map(transformPeriod), function(p) {
                        // filter empty periods
                        return p.per_id !== null;
                    }),
                    // calculate remaining target time after reducing holidays and all other non Work durations
                    // todo: maybe this should be done in the database
                    remaining: function() {
                        let duration = _.reduce(periods, function (result, period) {
                            // map period type to period
                            let type = _.find(periodTypes, function(t) { return t.pty_id == period.per_pty_id});

                            if (!type || type.pty_id == 'Work') {
                                return result;
                            }

                            let diff = moment.duration(period.per_duration).subtract(moment.duration(period.break));

                            return result.subtract(diff);
                        }, moment.duration(day.day_target_time));

                        return {
                            hours: duration.get('hours'),
                            minutes: duration.get('minutes')
                        };
                    }()
                }
            );
        });
        return {
            days: _.sortBy(_.values(data), function (day) {
                return moment(day.day_date);
            })
        };
    });
}

/**
 * calculate carry data within the database
 *
 * @param client
 * @param user
 * @param until
 *
 * @returns {*}
 */
function calculateCarryData(client, user, until) {
    var query = 'SELECT * FROM user_calculate_carry_time($1, $2::DATE)';

    return db.query(client, query, [user.usr_id, until]).then(function (result) {
        var carryData = {
            carryTime: {hours: 0, minutes: 0},
            carryFrom: null,
            carryTo: null
        };

        if (result.rowCount <= 0) {
            return carryData;
        }

        var data = result.rows[0];
        if (data.uw_carry_time != null) {
            carryData.carryTime = data.uw_carry_time;
            carryData.carryFrom = data.uw_date_from;
            carryData.carryTo = data.uw_due_date;
        }

        return carryData;
    });
}

function fetchHolidays(client, userId, dateRange) {
    var holidayQuery = db.days.select(db.days.star(), db.periods.star())
        .from(db.days
            .join(db.periods)
            .on(db.periods.per_day_id.equals(db.days.day_id))
            .join(db.periodTypes)
            .on(db.periods.per_pty_id.equals(db.periodTypes.pty_id))
            .join(db.users)
            .on(db.days.day_usr_id.equals(db.users.usr_id)))
        .where(db.users.usr_id.equals(userId))
        .and(db.periodTypes.pty_name.equals('Feiertag'))
        .and(db.days.day_date.between(dateRange.start, dateRange.end))
        .toQuery();
    return db.query(client, holidayQuery).then(_.property('rows'));
}

function fetchHolidayPeriodTypeId(client) {
    var periodTypeQuery = db.periodTypes.select(db.periodTypes.pty_id)
        .from(db.periodTypes)
        .where(db.periodTypes.pty_name.equals('Feiertag'))
        .toQuery();
    return db.query(client, periodTypeQuery).then(function (result) {
        return result.rows[0].pty_id;
    });
}

function fetchPeriodTypes(client) {
    var periodTypeQuery = db.periodTypes.select(db.periodTypes.star())
        .from(db.periodTypes)
        .toQuery();
    return db.query(client, periodTypeQuery).then(_.property('rows'));
}

function createMissingHolidays(pg, dateRange, user, existingHolidays, holidayPeriodTypeId) {
    var expectedHolidays = util.getHolidaysForDateRange(dateRange);

    // omit all holidays that are in the database already
    var newHolidays = _.omit(expectedHolidays, function (comment, strDate) {
        return existingHolidays.some(function (holiday) {
            return moment(holiday.day_date).format('YYYY-MM-DD') == strDate;
        });
    });
    // and insert the rest
    var newPeriodPromises = _.map(newHolidays, function (comment, strDate) {
        return Q.Promise(function (resolve) {
            var date = moment(strDate, 'YYYY-MM-DD').toDate();
            // get user target time for that specific date (handles weekends correct)
            User.getTargetTime(pg, user.usr_id, date, function(val) {
                let day = moment.duration(val);
                console.log('adding new Holiday', strDate, comment, val);
                var newPeriod = {
                    date: date,
                    userId: user.usr_id,
                    per_duration: day.format('hh:mm'),
                    per_comment: comment,
                    per_pty_id: holidayPeriodTypeId
                };

                period.post(pg, newPeriod.userId, newPeriod, resolve);
            });
        });
    });

    return Q.all(newPeriodPromises);
}

function getTimesheetForTimeRange(pg, client, user, dateRange, cb) {
    var userId = user.usr_id;

    // don't start with range start, but 1 day before for carry data calculation
    var carryStart = moment(dateRange.start);
    carryStart.subtract(1, 'days');

    var carryDataPromise = calculateCarryData(client, user, carryStart.toDate());

    // fetch existing holidays within dateRange
    var holidayPromise = fetchHolidays(client, userId, dateRange);

    // fetch holiday period type
    var periodTypePromise = fetchHolidayPeriodTypeId(client);

    // fetch period types
    var periodTypesPromise = fetchPeriodTypes(client);

    Q.all([holidayPromise, periodTypePromise, periodTypesPromise])
        .spread(function (existingHolidays, holidayPeriodTypeId, periodTypes) {
            return [createMissingHolidays(pg, dateRange, user, existingHolidays, holidayPeriodTypeId), periodTypes];
        }).spread(function (createdHolidays, periodTypes) {
            return Q.all([fetchPeriodsGroupedByDay(client, userId, dateRange, periodTypes), carryDataPromise]);
        }).spread(function (timesheet, carryData) {
            timesheet.carryTime = carryData.carryTime;
            // debug information, so we know in which timeframe the carryTime was calculated
            timesheet.carryFrom = carryData.carryFrom;
            timesheet.carryTo = carryData.carryTo;
            return timesheet;
        }).then(cb).done();
}

module.exports = {
    get: function (pg, userId, fromDate, toDate, cb) {
        pg(function (client) {
            var dateRange = {};
            dateRange.start = new Date(fromDate);
            dateRange.end = new Date(toDate);

            User.get(pg, userId, function(user) {
                getTimesheetForTimeRange(pg, client, user, dateRange, cb);
            });
        });
    }
};
