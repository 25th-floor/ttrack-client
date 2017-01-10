import Immutable from 'immutable';
import moment from 'moment';
import { durationOfWork, durationOfBreak, weekNr, sumDuration, durationOfBalance } from '../common/timeUtils';

function processDay(day) {
    const date = moment(day.get('day_date'));
    const today = moment();
    const remaining = moment.duration(day.get('remaining').toJS());
    return day.merge({
        weekNr: weekNr(date),
        date,
        day_target_time: moment.duration(day.get('day_target_time').toJS()),
        remaining,
        remainingUntilToday: date <= today ? remaining : moment.duration(),
        workDuration: sumDuration(day.get('periods').map(per => durationOfWork(per.toJS()))),
        breakDuration: sumDuration(day.get('periods').map(per => durationOfBreak(per.toJS()))),
        balanceDuration: sumDuration(day.get('periods').map(per => durationOfBalance(per.toJS()))),
        isUnfinished: date.isBefore(moment(), 'day') && !day.get('periods').every(
            period => (!!period.get('per_start') === !!period.get('per_stop'))
        ),
    });
}

export function createWeeks(days, carryTime) {
    const carry = moment.duration(carryTime);
    return days
        .map(processDay)
        .groupBy(day => day.get('weekNr'))
        .map((weekDays, weekNumber) => {
            const workDuration = sumDuration(weekDays.map(day => day.get('workDuration')));
            const balanceDuration = sumDuration(weekDays.map(day => day.get('balanceDuration')));
            const targetDuration = sumDuration(weekDays.map(day => day.get('remaining')));
            const targetDurationUntilToday = sumDuration(weekDays.map(day => day.get('remainingUntilToday')));
            const diff = moment.duration(workDuration).subtract(targetDuration);
            const diffUntilToday = moment.duration(workDuration).subtract(targetDurationUntilToday);
            carry.add(diffUntilToday);

            return new Immutable.Map({
                days: weekDays,
                weekNr: weekNumber,
                workDuration,
                balanceDuration,
                targetDuration,
                diff,
                diffUntilToday,
                carry: moment.duration(carry),
            });
        });
}
