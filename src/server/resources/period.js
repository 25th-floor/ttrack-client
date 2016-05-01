require('moment-duration-format');
let Q = require('q');
let dba = require('../db');
let util = require('../../common/util');
let moment = require('moment');
const _ = require('lodash');
const User = require('./user');

/**
 * fetch day id for the specified date and user, creating the day if necessary
 *
 * @param db the db object
 * @param date the date, format YYYY-MM-DD
 * @param user the user
 * @returns {*} promise
 */
function fetchDayIdForUser(db, date, user) {
    return dba.query(db, 'SELECT day_id FROM days WHERE day_date = $1 AND day_usr_id = $2', [date, user.usr_id])
        .then(function (result) {

            if (result.rows.length) {
                return result.rows[0].day_id;
            } else {
                // todo use timehseets getTargetTime
                let day = util.getDayDuration(moment.duration(user.usr_target_time));

                const defaultWeekdayWorktime = {
                    hours: day.hours(),
                    minutes: day.minutes()
                };

                console.log('create new day', date);
                if (moment(date).isoWeekday() < 6) {
                    console.log('with', defaultWeekdayWorktime);
                    return createDayIdForUser(db, date, defaultWeekdayWorktime, user.usr_id);
                } else
                    return createDayIdForUser(db, date, { hours: 0 }, user.usr_id);
            }
        });
}

function createDayIdForUser(db, date, interval, userId) {
    const hours = parseInt(interval.hours) || 0;
    const minutes = parseInt(interval.minutes) || 0;

    // ugly hack because stupid query builder is buggy when converting interval object to database interval string himself,
    // and turns {hours: 7, minutes: 42} into interval '7 minutes, 42 seconds' ...
    let queryString = "INSERT INTO days (day_date, day_usr_id, day_target_time) VALUES ($1, $2, interval '$3 hours, $4 minutes') RETURNING day_id";
    queryString = queryString.replace('$3', hours);
    queryString = queryString.replace('$4', minutes);

    return dba.query(db,
        queryString,
        [date, userId]).then(function (result) {
            return result.rows[0].day_id;
        });
}

function fetchPeriodTypes(db) {
    return dba.query(db, 'SElECT * FROM period_types').then(function (result) {
        const map = {};
        result.rows.forEach(function (row) {
            map[row.pty_name] = row.pty_id;
        });
        return map;
    });
}

function convertToTime(time) {
    return time ? moment.duration(time).format('hh:mm:', { trim: false }) : null;
}


function preparePeriodForApiResponse(periodData) {
    return _.mapValues(periodData, function (val, key) {
        // transform time strings
        if (_.includes(['per_start', 'per_stop'], key)) {
            if (val === null) return null;
            let duration = moment.duration(val);
            return {
                hours: duration.get('hours') + duration.get('days') * 24,
                minutes: duration.get('minutes')
            };
        }
        return val;
    });
}

module.exports = {
    post: function (pg, userId, data, cb) {
        pg(function (db) {
            User.get(pg, userId, function (user) {
                Q.all([
                    fetchPeriodTypes(db),
                    fetchDayIdForUser(db, data.date, user)
                ]).spread(function (types, dayId) {
                    // TODO: check if pty_id is valid type if defined
                    if (data.per_pty_id === undefined) {
                        data.per_pty_id = types['Arbeitszeit'];
                    }

                    if (data.per_start) {
                        data.per_stop = data.per_stop ? convertToTime(data.per_stop) : null;
                        data.per_start = convertToTime(data.per_start);
                        data.per_break = convertToTime(data.per_break);
                        return dba.query(db,
                            'INSERT INTO periods (per_start, per_stop, per_break, per_comment, per_day_id, per_pty_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                            [data.per_start, data.per_stop, data.per_break, data.per_comment, dayId, data.per_pty_id]);
                    } else {
                        data.per_duration = convertToTime(data.per_duration);
                        return dba.query(db,
                            'INSERT INTO periods (per_duration, per_comment, per_day_id, per_pty_id) VALUES ($1, $2, $3, $4) RETURNING *',
                            [data.per_duration, data.per_comment, dayId, data.per_pty_id]);
                    }
                }).then(function (result)
                {
                    cb(preparePeriodForApiResponse(result.rows[0]));
                }).done();
            });

        });
    },
    put: function (pg, userId, data, cb) {
        pg(function (db) {
            Q.all([
                fetchPeriodTypes(db),
            ]).spread(function (types) {
                // TODO: check if pty_id is valid type if defined
                // TODO: check if userId is valid!
                if (data.pty_id === undefined) {
                    data.pty_id = types['Arbeitszeit'];
                }

                if (data.per_start) {
                    data.per_stop = data.per_stop ? convertToTime(data.per_stop) : null;
                    data.per_start = convertToTime(data.per_start);
                    data.per_break = convertToTime(data.per_break);
                    return dba.query(db,
                        'UPDATE periods SET per_start = $1, per_stop = $2, per_break = $3, per_duration = NULL, per_comment = $4, per_pty_id = $5 WHERE per_id = $6 RETURNING *',
                        [data.per_start, data.per_stop, data.per_break, data.per_comment, data.per_pty_id, data.per_id]);
                } else {
                    data.per_duration = convertToTime(data.per_duration);
                    return dba.query(db,
                        'UPDATE periods SET per_duration = $1, per_comment = $2, per_pty_id = $3, per_start = NULL, per_stop = NULL, per_break = NULL WHERE per_id = $4 RETURNING *',
                        [data.per_duration, data.per_comment, data.per_pty_id, data.per_id]);
                }
            }).then(function (result) {
                cb(preparePeriodForApiResponse(result.rows[0]));
            }).done();
        });
    },
    delete: function (pg, dataId, userId, cb) {
        pg(function (db) {
            const query = 'DELETE FROM periods WHERE per_id = (SELECT per_id FROM periods INNER JOIN days ON (day_id = per_day_id) WHERE per_id = $1 AND day_usr_id = $2)';
            db.query(query, [dataId, userId], function (err, result) {
                if (err) {
                    return console.error('error running select query', err);
                }

                cb(result);
            });
        });
    },
    preparePeriodForApiResponse: preparePeriodForApiResponse
};
