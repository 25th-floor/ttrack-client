// @flow

import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classSet from 'class-set';
import styles from './MonthSelection.module.css';

export type MonthSelectionProps = {
};

/**
 * MonthSelection
 */

export class MonthSelection extends Component {
    props: MonthSelectionProps;
    renderMonthItem = (month, index) => {
        const className = classSet('col-xs-1',
            month.isSame(this.props.activeMonth, 'month') ? styles.active : null,
            month.isSame(this.today, 'month') ? styles.today : null,
            month.isAfter(this.today, 'month') ? styles.future : null,
        );

        const monthNumber = month.format('M');
        const monthShort = month.format('MMM');
        const monthFull = month.format('MMMM');
        const fmtMonth = this.props.activeMonth.clone().month(month.format('MMMM')).format('YYYY-MM');
        return (
            <li className={className} key={index}>
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
    }

    render() {
        const months = this.props.months;

        return (
            <div className={styles.monthSelection}>
                <h2>Month</h2>
                <ul className="col-xs-10">
                    {months.map(this.renderMonthItem)}
                </ul>
            </div>
        );
    }
}

export default MonthSelection;
