import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

import resource from '../resource';
import { createWeeks } from '../monthUtils';
import * as timeUtils from '../../common/timeUtils';

function getDurationType(period, targetTime, type) {
    const cfg = type.get('pty_config').get('types').toJS();

    if (period.get('per_id') !== null) {
        const start = period.get('per_start');
        const duration = moment.duration(period.get('per_duration').toJS());
        const target = moment.duration(targetTime.toJS());

        if (cfg.period && start && moment.duration(start.toJS()).as('minutes') >= 0) return 'period';
        if (cfg.halfday && duration.as('hours') === (target.as('hours') / 2)) return 'halfday';
        if (cfg.fullday && duration.as('hours') === target.as('hours')) return 'fullday';
        if (cfg.duration) return 'duration';
    } else {
        if (cfg.period) return 'period';
        if (cfg.fullday) return 'fullday';
        if (cfg.halfday) return 'halfday';
        if (cfg.duration) return 'duration';
    }

    return 'none';
}

function assocPeriodWithType(typeMap, targetTime, period) {
    const type = typeMap.get(period.get('per_pty_id'));
    const duration = getDurationType(period, targetTime, type);
    return period.merge({ type, duration });
}

function assocPeriodsWithTypes(types, days) {
    const typeMap = types.groupBy(type => type.get('pty_id')).map(t => t.first());
    return days.map(day =>
        day.updateIn(['periods'], periods =>
            periods.map(assocPeriodWithType.bind(null, typeMap, day.get('day_target_time')))));
}

function fixDurations(period) {
    const durations = ['per_start', 'per_stop', 'per_duration', 'per_break'];
    return period.map((val, key) => (_.includes(durations, key) && val !== null ? moment.duration(val.toJS()) : val));
}

export default function (API_URI, onChange) {
    const periodTypes = resource.collection(API_URI + '/api/period-types');
    let timesheet = new Immutable.Map();
    const notify = () => (onChange ? onChange() : null);
    let initialized = false;
    let tsResource = null;
    let loadParams = null;
    return {
        init() {
            return periodTypes.load().then(() => {
                initialized = true;
                notify();
            });
        },

        getTypes() {
            return periodTypes.list();
        },

        getTimesheet() {
            return timesheet;
        },

        resetTimesheet() {
            timesheet = new Immutable.Map();
            loadParams = null;
        },

        loadTimesheet(month, userId) {
            // console.log('loadTimesheet', month, userId);
            if (!initialized) throw new Error('cannot load unitialized');

            const newLoadParams = JSON.stringify([month, userId]);
            if (loadParams && loadParams === newLoadParams) {
                // console.debug('already loading timesheet', newLoadParams);
                return; // load already in progress for given params
            }

            loadParams = newLoadParams;
            if (tsResource) tsResource.cancel();
            timesheet = new Immutable.Map();

            const boundries = timeUtils.getFirstAndLastDayOfMonth(month);

            tsResource = resource.single(API_URI + '/api/users/:user/timesheet/:from/:to');

            tsResource.load({
                from: boundries.firstDay.format('YYYY-MM-DD'),
                to: boundries.lastDay.format('YYYY-MM-DD'),
                user: userId,
            }).then(() => {
                const data = tsResource.get().updateIn(['days'], assocPeriodsWithTypes.bind(null, periodTypes.list()));
                timesheet = createWeeks(data.get('days'), moment.duration(data.get('carryTime').toJS()));
                notify();
                return timesheet;
            });
        },

        saveDay(userId, date, periods, removed) {
            const periodCollectionResource = resource.collection(API_URI + '/api/users/:userId/periods');
            const periodSingleResource = resource.single(API_URI + '/api/users/:userId/periods/:per_id');

            const promises = [];

            // disable loadParams, we saved something so load the data new
            loadParams = null;

            // delete all removed ones
            removed.forEach((id) => {
                promises.push(periodSingleResource.remove({ per_id: id, userId }));
            });
            // update/create
            periods.forEach((period) => {
                let p = period.merge({
                    date: date.format('YYYY-MM-DD'),
                    userId,
                    per_pty_id: period.get('type').get('pty_id'),
                });
                p = fixDurations(p);

                // console.log('timesheet store prepared obj', p);

                if (p.get('per_id')) {
                    promises.push(periodSingleResource.save(p));
                } else {
                    promises.push(periodCollectionResource.save(p));
                }
            });

            return Promise.all(promises);
        },
    };
}
