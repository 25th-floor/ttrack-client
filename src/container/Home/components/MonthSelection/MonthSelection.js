// @flow

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import moment from 'moment';
import classSet from 'class-set';

import type Moment from 'moment';

import styles from './MonthSelection.module.css';

type MonthProps = {
    month: Moment,
    today: Moment,
    activeMonth: Moment,
};

const Month = ({ month, today, activeMonth }: MonthProps) => {
    const className = classSet(
        'col-xs-1',
        styles.month,
        month.isSame(activeMonth, 'month') ? styles.active : null,
        month.isSame(today, 'month') ? styles.today : null,
        month.isAfter(today, 'month') ? styles.future : null,
    );

    const monthNumber = month.format('M');
    const monthShort = month.format('MMM');
    const monthFull = month.format('MMMM');
    const fmtMonth = activeMonth.clone().month(month.format('MMMM')).format('YYYY-MM');

    return (
        <li className={className} key={fmtMonth}>
            <NavLink
                to={`/month/${fmtMonth}`}
                activeClassName="active"
            >
                <span className={styles.number}>{monthNumber}</span>
                <span className={styles.short}>{monthShort}</span>
                <span className={styles.full}>{monthFull}</span>
            </NavLink>
        </li>
    );
};

export type MonthSelectionProps = {
    activeMonth: Moment,
    months: Array<Moment>,
};

/**
 * MonthSelection
 */
export class MonthSelection extends Component {
    props: MonthSelectionProps;
    today = moment().startOf('month');

    render() {
        const { months, activeMonth } = this.props;

        return (
            <div className={styles.monthSelection}>
                <h2>Month</h2>
                <ul className="col-xs-10">
                    {months.map(m => (<Month month={m} activeMonth={activeMonth} today={this.today} />))}
                </ul>
            </div>
        );
    }
}

export default MonthSelection;
