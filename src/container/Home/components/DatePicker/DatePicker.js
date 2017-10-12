// @flow

import React, { Component } from 'react';
import { YearSelection } from '../YearSelection';
import { MonthSelection } from '../MonthSelection';

import styles from './DatePicker.module.css';

export type DatePickerProps = {
};

/**
 * DatePicker
 */

export class DatePicker extends Component {
    props: DatePickerProps;

    render() {
        const { activeMonth, years, months, onChangeDate } = this.props;

        return (<div className={styles.dateSelection}>
            <div className={`row ${styles.touchVersion}`}>
                <YearSelection
                    activeMonth={activeMonth}
                    years={years}
                    onChangeDate={onChangeDate}
                />

                <MonthSelection
                    activeMonth={activeMonth}
                    months={months}
                    onChangeDate={onChangeDate}
                />
            </div>
        </div>);
    }
}

export default DatePicker;
