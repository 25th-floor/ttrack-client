'use strict';

import * as timeUtils from './timeUtils';
import moment from 'moment';
import Immutable from 'immutable';

/**
 * Duration Type Config Names
 */
export const NONE = 'none';
export const PERIOD = 'period';
export const HALFDAY = 'halfday';
export const FULLDAY = 'fullday';

/**
 * Duration Config
 */
export const durationConfig = [
    {name: PERIOD, description: 'Zeitraum'},
    {name: FULLDAY, description: 'Ganzer Tag'},
    {name: HALFDAY, description: 'Halber Tag'}
];

/**
 * get Duration Description from name
 * @param name
 * @returns {*}
 */
export function getDurationDescription(name) {
    return (durationConfig.find((cfg) => cfg.name == name) || {}).description;
}

/**
 * calculate duration based on the period. returns the DateObject
 *
 * @param period
 * @param fullDay
 * @returns {*}
 */
export function calculateDuration(period, fullDay) {
    let halfDay = moment.duration(Math.round(fullDay.asSeconds() / 2), 's');
    let name = period.get('duration');

    if (name == FULLDAY) return timeUtils.getDateObjectFromMomentDuration(fullDay);
    if (name == HALFDAY) return timeUtils.getDateObjectFromMomentDuration(halfDay);
    if (name == NONE) return {hours: 0};

    let duration = {};

    if (!period.get('per_start') || !period.get('per_stop')) return {};

    let startTime = timeUtils.getMomentFromImmutable(period, 'per_start');
    let stopTime = timeUtils.getMomentFromImmutable(period, 'per_stop');

    return timeUtils.getDateObjectFromMomentDuration(stopTime.subtract(startTime));
}

/**
 * compare break length to work length
 * @param period
 * @returns {boolean}
 */
export function isBreakLengthValid(period) {
    if (!getBreakTime(period)) return true;
    return getWorkedTime(period) >= getBreakTime(period);

}

export function getWorkedTime(period) {
    return moment.duration(period.get('per_stop').toJS())
        .subtract(moment.duration(period.get('per_start').toJS()))
        .as('minutes');
}

export function getBreakTime(period) {
    return moment.duration(period.get('per_break').toJS()).as('minutes');
}


/**
 *
 * checks if any periods are overlapping withing given day.
 *
 * @param periods
 * @returns {boolean}
 */
export function isOverlapping(periods) {
    if (periods.size <= 1) {
        return false;
    }
    periods = periods.toList();

    return !periods.every((period, index) => {
        var startTime = timeUtils.getMomentFromImmutable(period, 'per_start');
        var stopTime = timeUtils.getMomentFromImmutable(period, 'per_stop');

        // if no startTime then there is nothing to do
        if (startTime == null) return true;

        return periods.every(function (p, i) {
            // don't check myself
            if (i == index) return true;

            var pStartTime = timeUtils.getMomentFromImmutable(p, 'per_start');
            var pStopTime = timeUtils.getMomentFromImmutable(p, 'per_stop');

            // if no startTime then there is nothing to do
            if (pStartTime == null) return true;

            // check good case
            if (stopTime && pStartTime >= stopTime) return true;
            if (pStopTime && startTime >= pStopTime) return true;

            // check not good case
            if (stopTime && pStartTime >= startTime && pStartTime <= stopTime) return false;
            if (pStopTime && startTime >= pStartTime && startTime <= pStopTime) return false;

            return true;
        });
    });
}

/**
 *
 * @param period
 * @returns {Array}
 */
export function getAllErrors(period) {
    if (!period || validatePeriod(period)) return [];

    if (period.get('duration') === FULLDAY) return [];
    if (period.get('duration') === HALFDAY) return [];

    var startTime = period.get('per_start');
    var endTime = period.get('per_stop');
    var breakTime = period.get('per_break') || false;

    var errors = [];

    if (!startTime) {
        errors.push('Die Startzeit muss angegeben werden!');
    } else {
        startTime = moment.duration(startTime.toJS());

        if (endTime) {
            endTime = moment.duration(endTime.toJS());
            if (endTime < startTime) {
                errors.push('Wenn vorhanden muss die Endzeit nach der Startzeit liegen!');
            }
            if (breakTime && !isBreakLengthValid(period)) {
                errors.push('Die Pause ist zu lang!');
            }
        }
    }


    return errors;
}

export function validatePeriod(period) {
    if (!period || !Immutable.Map.isMap(period)) return false;
    if (period.get('duration') === FULLDAY) return true;
    if (period.get('duration') === HALFDAY) return true;

    // if there is no duration needed, don't ask for one (comment type for example)
    var typeConfig = period.getIn(['type', 'pty_config', 'types'], new Immutable.Map([])).toArray();
    if (period.get('duration') === NONE && !typeConfig.every((t) => t)) return true;

    var startTime = period.get('per_start');
    var endTime = period.get('per_stop');
    var breakTime = period.get('per_break') || false;

    if (!startTime) return false;

    startTime = moment.duration(startTime.toJS());

    if (endTime) {
        endTime = moment.duration(endTime.toJS());
        if (endTime < startTime) return false;
        if (breakTime && !isBreakLengthValid(period)) return false;
    }

    return true;
}

/**
 * validate a list of periods
 *
 * validates each of the periods and also checks for overlapping times
 *
 * @param periods
 * @returns {*|boolean}
 */
export function validatePeriods(periods) {
    // validate every period
    let valid = periods.every(validatePeriod);
    if (!valid) return valid;

    // if everything is valid, also check for overlapping
    return !isOverlapping(periods);
}
