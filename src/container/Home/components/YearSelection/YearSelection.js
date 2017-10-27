// @flow
import moment from 'moment';
import React, { Component } from 'react';
import classSet from 'class-set';

import type Moment from 'moment';

import { Utils } from '@data';

import { DatePickerContainer } from '../DatePickerContainer';
import { DatePickerButton } from '../DatePickerButton';
import styles from './YearSelection.module.css';

type YearProps = {
    activeMonth: Moment,
    year: Moment,
    today: Moment,
};
const Year = ({ year, activeMonth, today }: YearProps) => {
    const isActive = year.isSame(activeMonth, 'year');
    const className = classSet(
        styles.year,
        year.isSame(today, 'year') && !isActive ? styles.today : null,
        year.isAfter(today, 'year') ? styles.future : null,
    );
    const fmtYear = activeMonth.clone().year(year.format('YYYY')).format('YYYY-MM');
    return (
        <DatePickerButton className={className} key={fmtYear} link={`/month/${fmtYear}`}>
            <span className={styles.number}>{year.format('YY')}</span>
            <span className={styles.short}>{year.format('YYYY')}</span>
        </DatePickerButton>
    );
};

export type YearSelectionProps = {
    activeMonth: Moment,
    years: Array<Moment>,
};

/**
 * YearSelection
 */
export class YearSelection extends Component {
    props: YearSelectionProps;
    today = Utils.getMomentToday();

    render() {
        const { years, activeMonth } = this.props;

        const showToday = !activeMonth.isSame(this.today, 'year');
        const fmtToday = moment().startOf('month').format('YYYY-MM');
        return (
            <DatePickerContainer title={'Year'}>
                {years.map(y => (<Year year={y} today={this.today} activeMonth={activeMonth} key={y.format('YYYY')} />))}

                {showToday && (
                    <DatePickerButton link={`/month/${fmtToday}`} className={styles.todayButton}> Today </DatePickerButton>
                )}
            </DatePickerContainer>
        );
    }
}

export default YearSelection;
