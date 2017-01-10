'use strict';

import moment from 'moment';
import Immutable from 'immutable';
import _ from 'lodash';

/**
 * check if time is a valid input string
 *
 * Allowed strings are:
 * 12:34
 * 0:30
 * 0,5
 * 0.5
 * ,5
 * 8
 *
 * @param time
 * @param strict
 * @param allowNegativeValue
 * @returns boolean
 */
export function isValidTimeString(time, strict = true, allowNegativeValue = false) {
    if (typeof time !== 'string') return false;
    if (!strict && time === '') return true;
    if (time.match(/^(\d+)$/) || (allowNegativeValue && time.match(/^-(\d+)$/))) return true;
    if (allowNegativeValue && time.match(/^-(\d*)[.,:](\d*)$/) !== null) return true;
    return time.match(/^(\d*)[.,:](\d*)$/) !== null;
}

/**
 * get a valid moment object or null if string is not valid
 * @param time
 * @param allowNegativeValue
 * @returns {*}
 */
export function getValidMoment(time, allowNegativeValue = false) {
    if (!isValidTimeString(time, true, allowNegativeValue)) return null;

    var validTime = null;

    if (time.indexOf('.') > -1) {
        validTime = moment.duration(time * 60, 'minutes');
    }
    if (time.indexOf(',') > -1) {
        validTime = moment.duration(parseFloat(time.replace(',', '.')) * 60, 'minutes');
    }
    if (time.indexOf(':') > -1) {
        validTime = moment.duration({hours: time.split(':')[0], minutes: time.split(':')[1]});
    }
    if (time.match(/^(\d*)$/)) {
        validTime = moment.duration({hours: time});
    }

    return validTime;
}

/**
 * convert a duration object into a dateObject {hours: xx, minutes: yy}
 * @param duration
 * @returns {{hours: *, minutes: *}}
 */
export function getDateObjectFromMomentDuration(duration) {
    return {
        hours: duration.get('hours') + duration.get('days') * 24,
        minutes: duration.get('minutes')
    };
}

export function reduceMomentArray(moments, user) {
    let startDate = user.get('usr_employment_start');
    let endDate = user.get('usr_employment_stop');

    let dates = moments;

    // give one month more time before and after

    if (startDate) {
        startDate = moment(startDate).subtract(1, 'month');
        dates = dates.filter((m) => m.isAfter(startDate) || m.isSame(startDate));
    }

    if (endDate) {
        endDate = moment(endDate).add(1, 'month');
        dates = dates.filter((m) => m.isBefore(endDate) || m.isSame(endDate));
    }

    return dates;
}

/**
 * check if moment is out of employment scope
 *
 * @param date
 * @param user
 * @returns {boolean}
 */
export function isDateInEmploymentInterval(date, user) {
    return getNearestDateWithinEmployment(date, user) == false;
}

/**
 * check if date is without the emploment or more than a year into the future and move user back.
 * @param date
 * @param user
 * @returns {boolean}
 */
export function getNearestDateWithinEmployment(date, user) {
    var startDate = user.get('usr_employment_start');
    var endDate = user.get('usr_employment_stop');

    // give one month more time before and after

    if (startDate) {
        startDate = moment(startDate);
        if (date.isBefore(startDate)) return startDate;
    }

    if (endDate) {
        endDate = moment(endDate);
        if (date.isAfter(endDate)) return endDate;
    } else {
        // check if we want more than a year into the future and stop it
        var today = getMomentToday();
        var future = today.clone().endOf("year").add(1, 'year');
        if (date.isAfter(future)) return today;
    }

    return false;
}

export function getMomentToday() {
    return moment().startOf('month');
}

/**
 * round example: +15, -15 (in minutes)
 *
 * @param duration
 * @param round
 *
 * @returns moment.duration
 */
export function roundTime(duration, round) {
    var absRound = Math.abs(round);

    // no need to round
    if (duration.asMinutes() % absRound == 0) return duration;

    let factor = Math.trunc(duration.asMinutes() / absRound);

    let minRounded = factor * absRound;

    let minutes = round > 0 ? minRounded + absRound : minRounded;

    return moment.duration(minutes, 'minutes');
}

export function formatDurationHoursToLocale(time, fractions) {
    fractions = fractions || 2;
    return time.asHours().toLocaleString('de-DE', {minimumFractionDigits: fractions}) + 'h';
}

/**
 * parse a time duration string
 *
 * If the string contains a colon ":" it is expected to be in a format understood
 * by the moment.js duration constructor.
 *
 * Otherwise we match strings like '1h 15m' or '7 minutes, 1.5 hours' etc.
 *
 * @param str the string to parse
 * @returns {*} a moment.duration object
 */
function parseHumanDurationString(str) {
    if (_.contains(str, ':')) {
        return moment.duration(str);
    } else {
        var matches = str.match(/(\d*\.)?\d+\s*(h(ours?)?|m(ins?)?)|minutes/gi);
        var units = {
            h: 'hours',
            hour: 'hours',
            hours: 'hours',
            m: 'minutes',
            min: 'minutes',
            mins: 'minutes',
            minutes: 'minutes'
        };
        return matches.reduce(function (total, s) {
            var duration = _.zipObject(['amount', 'unit'], _.rest(s.match(/^(.*\d)\s*(.*)$/)));
            return total.add(+duration.amount, units[duration.unit.toLowerCase().trim()]);
        }, moment.duration());
    }
}

export function isWeekend(moment) {
    // iso weekday -> 1=monday, 6=saturday, 7=sunday
    return moment.isoWeekday() > 5;
}


export function durationOfWork(period) {

    var ret = moment.duration();
    if (period.per_pty_id === 'Work') {
        var duration = moment.duration(period.per_duration);
        var breakDuration = durationOfBreak(period);

        if (duration.as('ms') > breakDuration.as('ms')) {
            ret = duration.subtract(breakDuration);
        } else {
            ret = moment.duration();
        }
    }
    return ret;
}

export function durationOfBreak(period) {
    if (!period) return;
    return moment.duration(period.per_break || 0);
}

export function durationOfBalance(period) {
    if (!period || period.per_pty_id !== 'Balance') return;
    return moment.duration(period.per_duration || 0);
}

export function weekNr(date) {
    let weekNr = date.isoWeek();
    let weekYear = date.isoWeekYear();
    if (weekNr < 10) {
        weekNr = '0' + weekNr;
    }
    return weekYear + '-' + weekNr;
}

export function sumDuration(xs) {
    return xs.reduce(function (total, x) {
        return total.add(x);
    }, moment.duration());
}

export function getFirstAndLastDayOfMonth(month) {
    let ret = {};
    ret.firstDay = month.clone();

    // get first day of that month
    ret.firstDay.startOf('month');

    // get last day of that month
    ret.lastDay = ret.firstDay.clone().endOf('month');

    // go back to last monday before first day of month
    ret.firstDay.subtract(ret.firstDay.isoWeekday() - 1, 'day');

    // extend last day to next sunday
    ret.lastDay.add(7 - ret.lastDay.isoWeekday(), 'day');

    return ret;
}

/**
 * returns a moment.duration object or null
 *
 * @param obj
 * @param attr
 * @returns {moment.duration|null}
 */
export function getMomentFromImmutable(obj, attr) {
    return obj.get(attr) ? moment.duration(obj.get(attr).toJS()) : null;
}

/**
 * get Year Array of Moments for a specific user
 *
 * @param user
 * @param today moment
 * @param limit optional, defaults to 6
 */
export function getYearsForUser(user, today, limit) {
    limit = limit || 6;

    if (!Immutable.Map.isMap(user)) {
        throw new Error('getYearsForUser expects an Immutable Map Object!');
    }

    if (!moment.isMoment(today)) {
        throw new Error('getYearsForUser expects a Today Object!');
    }

    // adjust today for starters
    let startDate = user.get('usr_employment_start');
    if (startDate) {
        startDate = moment(startDate);
        today = today.clone().month(startDate.month()).day(startDate.day()).add(1, 'day');
    }

    let years = _.times(limit, function (i) {
        return today.clone().add(1, 'year').subtract(i, 'years');
    });

    return Immutable.List(reduceMomentArray(years, user));
}

/**
 * get month array for moments for a specific user
 *
 * @param user
 * @param activeMonth moment
 * @returns {List|Immutable.List|any}
 */
export function getMonthsForUser(user, activeMonth) {
    let months = _.times(12, function (n) {
        return activeMonth.clone().month(n);
    });

    return Immutable.List(reduceMomentArray(months, user));
}

/**
 *
 * @param week
 * @returns {boolean}
 */
export function isWeekInFuture(week) {
    return week.get('weekNr') > moment().format('YYYY-w');
}
