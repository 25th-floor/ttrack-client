'use strict';

import _ from 'lodash';
import Immutable from 'immutable';
import moment from 'moment';
import {durationOfWork, durationOfBreak, weekNr, sumDuration} from '../common/timeUtils';

function processDay(day) {
    let date = moment(day.get('day_date'));
    let today = moment();
    var remaining = moment.duration(day.get('remaining').toJS());
    return day.merge({
        weekNr: weekNr(date),
        date: date,
        day_target_time: moment.duration(day.get('day_target_time').toJS()),
        remaining: remaining,
        remainingUntilToday: date <= today ? remaining : moment.duration(),
        workDuration: sumDuration(day.get('periods').map(per => durationOfWork(per.toJS()))),
        breakDuration: sumDuration(day.get('periods').map(per => durationOfBreak(per.toJS()))),
        isUnfinished: date.isBefore(moment(), 'day') && !day.get('periods').every(period => (!!period.get('per_start') == !!period.get('per_stop')))
    });
}

export function createWeeks(days, carryTime) {

    let carry = moment.duration(carryTime);
    return days
        .map(processDay)
        .groupBy(day => day.get('weekNr'))
        .map((days, weekNr) => {
            let workDuration = sumDuration(days.map(day => day.get('workDuration')));
            let targetDuration = sumDuration(days.map(day => day.get('remaining')));
            let targetDurationUntilToday = sumDuration(days.map(day => day.get('remainingUntilToday')));
            let diff = moment.duration(workDuration).subtract(targetDuration);
            let diffUntilToday = moment.duration(workDuration).subtract(targetDurationUntilToday);
            carry.add(diff);

            return Immutable.Map({
                days: days,
                weekNr,
                workDuration: workDuration,
                targetDuration: targetDuration,
                diff: diff,
                diffUntilToday: diffUntilToday,
                carry: moment.duration(carry)
            })
        });
}
