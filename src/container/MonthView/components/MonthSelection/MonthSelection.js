// @flow

import React, { Component } from 'react';
import moment from 'moment';
import classSet from 'class-set';

import type Moment from 'moment';

import { DatePickerContainer } from '../DatePickerContainer';
import { DatePickerButton } from '../DatePickerButton';

import styles from './MonthSelection.module.css';

type MonthProps = {
    month: Moment,
    today: Moment,
    activeMonth: Moment,
};

const Month = ({ month, today, activeMonth }: MonthProps) => {
    const isActive = month.isSame(activeMonth, 'month');
    const className = classSet(
        'col-xs-1',
        month.isSame(today, 'month') && !isActive ? styles.today : null,
        month.isAfter(today, 'month') ? styles.future : null,
    );

    const monthNumber = month.format('M');
    const monthShort = month.format('MMM');
    const monthFull = month.format('MMMM');
    const fmtMonth = activeMonth.clone().month(month.format('MMMM')).format('YYYY-MM');

    return (
        <DatePickerButton className={className} key={fmtMonth} link={`/month/${fmtMonth}`}>
            <span className={styles.number}>{monthNumber}</span>
            <span className={styles.short}>{monthShort}</span>
            <span className={styles.full}>{monthFull}</span>
        </DatePickerButton>
    );
};

export type MonthSelectionProps = {
    activeMonth: Moment,
    months: Array<Moment>,
};

/**
 * MonthSelection
 */
export class MonthSelection extends Component<MonthSelectionProps> {
    today = moment.utc().startOf('month');

    render() {
        const { months, activeMonth } = this.props;

        return (
            <DatePickerContainer title="Month" className={styles.container}>
                {months.map(m => (
                    <Month month={m} activeMonth={activeMonth} today={this.today} key={m.format('M')} />))}
            </DatePickerContainer>
        );
    }
}

export default MonthSelection;
