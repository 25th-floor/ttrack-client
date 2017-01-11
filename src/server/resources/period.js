require('moment-duration-format');
const Q = require('q');
const dba = require('../db');
const util = require('../../common/util');
const moment = require('moment');
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
        .then((result) => {
            if (result.rows.length) {
                return result.rows[0].day_id;
            }

            // todo use timehseets getTargetTime
            const day = util.getDayDuration(moment.duration(user.usr_target_time));

            const defaultWeekdayWorktime = {
                hours: day.hours(),
                minutes: day.minutes(),
            };

            console.info('create new day', date);
            if (moment(date).isoWeekday() < 6) {
                console.info('with', defaultWeekdayWorktime);
                return createDayIdForUser(db, date, defaultWeekdayWorktime, user.usr_id);
            }

            return createDayIdForUser(db, date, { hours: 0 }, user.usr_id);
        });
}

function createDayIdForUser(db, date, interval, userId) {
    const hours = parseInt(interval.hours, 10) || 0;
    const minutes = parseInt(interval.minutes, 10) || 0;

    // ugly hack because stupid query builder is buggy when converting interval object to database interval string himself,
    // and turns {hours: 7, minutes: 42} into interval '7 minutes, 42 seconds' ...
    let queryString = "INSERT INTO days (day_date, day_usr_id, day_target_time) VALUES ($1, $2, interval '$3 hours, $4 minutes') RETURNING day_id";
    queryString = queryString.replace('$3', hours);
    queryString = queryString.replace('$4', minutes);

    return dba.query(db,
        queryString,
        [date, userId]).then(result => result.rows[0].day_id);
}

function fetchPeriodTypes(db) {
    return dba.query(db, 'SElECT * FROM period_types').then((result) => {
        const map = {};
        result.rows.forEach((row) => {
            map[row.pty_name] = row.pty_id;
        });
        return map;
    });
}

function convertToTime(time) {
    return time ? moment.duration(time).format('hh:mm:', { trim: false }) : null;
}

function preparePeriodForApiResponse(periodData) {
    return _.mapValues(periodData, (val, key) => {
        // transform time strings
        if (_.includes(['per_start', 'per_stop'], key)) {
            if (val === null) return null;
            const duration = moment.duration(val);
            return {
                hours: duration.get('hours') + (duration.get('days') * 24),
                minutes: duration.get('minutes'),
            };
        }
        return val;
    });
}

module.exports = {
    post(pg, userId, postData, cb) {
        pg((db) => {
            User.get(pg, userId, (user) => {
                Q.all([
                    fetchPeriodTypes(db),
                    fetchDayIdForUser(db, postData.date, user),
                ]).spread((types, dayId) => {
                    const data = postData;
                    // TODO: check if pty_id is valid type if defined
                    if (data.per_pty_id === undefined) {
                        data.per_pty_id = types.Arbeitszeit;
                    }

                    if (data.per_start) {
                        data.per_stop = data.per_stop ? convertToTime(data.per_stop) : null;
                        data.per_start = convertToTime(data.per_start);
                        data.per_break = convertToTime(data.per_break);
                        return dba.query(db,
                            'INSERT INTO periods (per_start, per_stop, per_break, per_comment, per_day_id, per_pty_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                            [data.per_start, data.per_stop, data.per_break, data.per_comment, dayId, data.per_pty_id]);
                    }

                    data.per_duration = convertToTime(data.per_duration);
                    return dba.query(db,
                        'INSERT INTO periods (per_duration, per_comment, per_day_id, per_pty_id) VALUES ($1, $2, $3, $4) RETURNING *',
                        [data.per_duration, data.per_comment, dayId, data.per_pty_id]);
                }).then((result) => {
                    cb(preparePeriodForApiResponse(result.rows[0]));
                }).done();
            });
        });
    },
    put(pg, userId, putData, cb) {
        pg((db) => {
            Q.all([
                fetchPeriodTypes(db),
            ]).spread((types) => {
                const data = putData;
                // TODO: check if pty_id is valid type if defined
                // TODO: check if userId is valid!
                if (data.pty_id === undefined) {
                    data.pty_id = types.Arbeitszeit;
                }

                if (data.per_start) {
                    data.per_stop = data.per_stop ? convertToTime(data.per_stop) : null;
                    data.per_start = convertToTime(data.per_start);
                    data.per_break = convertToTime(data.per_break);
                    return dba.query(db,
                        'UPDATE periods SET per_start = $1, per_stop = $2, per_break = $3, per_duration = NULL, per_comment = $4, per_pty_id = $5 WHERE per_id = $6 RETURNING *',
                        [data.per_start, data.per_stop, data.per_break, data.per_comment, data.per_pty_id, data.per_id]);
                }

                data.per_duration = convertToTime(data.per_duration);
                return dba.query(db,
                    'UPDATE periods SET per_duration = $1, per_comment = $2, per_pty_id = $3, per_start = NULL, per_stop = NULL, per_break = NULL WHERE per_id = $4 RETURNING *',
                    [data.per_duration, data.per_comment, data.per_pty_id, data.per_id]);
            }).then((result) => {
                cb(preparePeriodForApiResponse(result.rows[0]));
            }).done();
        });
    },
    delete(pg, dataId, userId, cb) {
        pg((db) => {
            const query = 'DELETE FROM periods WHERE per_id = (SELECT per_id FROM periods INNER JOIN days ON (day_id = per_day_id) WHERE per_id = $1 AND day_usr_id = $2)';
            db.query(query, [dataId, userId], (err, result) => {
                if (err) {
                    return console.error('error running select query', err);
                }

                cb(result);
                return true;
            });
        });
    },
    preparePeriodForApiResponse,
};
