// @flow

import React, { Component } from 'react';

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

export class DatePicker extends Component {
    props: DatePickerProps;

    render() {
        const { activeMonth, years, months } = this.props;

        return (<div className={styles.dateSelection}>
            <div className={`row ${styles.touchVersion}`}>
                <YearSelection activeMonth={activeMonth} years={years} />
                <MonthSelection activeMonth={activeMonth} months={months} />
            </div>
        </div>);
    }
}

export default DatePicker;
