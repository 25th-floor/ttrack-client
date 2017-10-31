// @flow
import React from 'react';

import moment from 'moment';
// import momentDuration from 'moment-duration-format';
import 'moment-duration-format';

import { Utils } from '@data';
import type { AssocPeriodType } from '@data/Constants/utils';

import { PeriodComment } from '../PeriodComment';

import styles from './Period.module.css';

export type PeriodProp = {
    period: AssocPeriodType,
    index: number,
};

export const Period = ({ period, index }: PeriodProp) => {
    const start = moment.duration(period.per_start).format('hh:mm', { trim: false });
    const end = moment.duration(period.per_stop).format('hh:mm', { trim: false });
    const pause = Utils.formatDurationHoursToLocale(moment.duration(period.per_break));

    const duration = Utils.formatDurationHoursToLocale(moment.duration(period.per_duration));

    if (period.per_start == null && period.per_stop == null) {
        const offsetClass = index === 0 ? 'col-sm-4 col-lg-5' : 'col-sm-4 col-sm-offset-5 col-lg-5';

        return (
            <span className={offsetClass} key={period.per_id}>
                <PeriodComment period={period} />
            </span>
        );
    }

    const showBreak = period.per_break !== null;

    return (
        <div className={styles.periodRow} key={period.per_id}>
            <div className="col-xs-4 col-sm-2 col-sm-offset-1 col-lg-1 tt-col-lg-1">{start} - {end}</div>
            <div className="col-xs-2 col-sm-1">{duration}</div>
            <div className="col-xs-3 col-sm-2 col-lg-1 tt-col-lg-1">
                {showBreak ? <span><span className="tt-hidden-smallest">Pause </span>{pause}</span> : null}
            </div>
            <div className="col-xs-2 col-sm-5 col-lg-offset-1"><PeriodComment period={period} /></div>
        </div>
    );
};

export type PeriodsProp = {
    periods: Array<AssocPeriodType>,
};

/**
 * Periods
 */
export const Periods = ({ periods }: PeriodsProp) => (
    <div className={styles.periods}>
        {periods.map((period, index) => <Period period={period} index={index} key={index} />)}
    </div>
);

export default Periods;
