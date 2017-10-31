// @flow

import React from 'react';

import type Moment from 'moment';

import { YearSelection } from '../YearSelection';
import { MonthSelection } from '../MonthSelection';

import styles from './DatePicker.module.css';

export type DatePickerProps = {
    activeMonth: Moment,
    years: Array<Moment>,
    months: Array<Moment>,
};

/**
 * DatePicker
 */

export const DatePicker = ({ activeMonth, years, months }: DatePickerProps) => (
    <div className={styles.dateSelection}>
        <div className={`row ${styles.touchVersion}`}>
            <YearSelection activeMonth={activeMonth} years={years} />
            <MonthSelection activeMonth={activeMonth} months={months} />
        </div>
    </div>
);

export default DatePicker;
