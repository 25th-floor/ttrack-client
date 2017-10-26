// @flow
import moment from 'moment';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classSet from 'class-set';

import type Moment from 'moment';

import { Utils } from '@data';

import styles from './YearSelection.module.css';

type YearProps = {
    activeMonth: Moment,
    year: Moment,
    today: Moment,
};
const Year = ({ year, activeMonth, today }: YearProps) => {
    const className = classSet(
        'col-xs-1',
        styles.year,
        year.isSame(activeMonth, 'year') ? styles.active : null,
        year.isSame(today, 'year') ? styles.today : null,
        year.isAfter(today, 'year') ? styles.future : null,
    );
    const fmtYear = activeMonth.clone().year(year.format('YYYY')).format('YYYY-MM');
    return (
        <li className={className} key={fmtYear}>
            <NavLink
                to={`/month/${fmtYear}`}
                activeClassName={`${styles.active}`}
            >
                <span className={styles.number}>{year.format('YY')}</span>
                <span className={styles.short}>{year.format('YYYY')}</span>
            </NavLink>
        </li>
    );
};

type TodayProps = {
    activeMonth: Moment,
};
const Today = ({ activeMonth }: TodayProps) => {
    if (activeMonth.isSame(moment(), 'year')) {
        return null;
    }
    const className = classSet(
        'col-xs-1',
        styles.todayButton,
    );
    const fmtToday = moment().startOf('month').format('YYYY-MM');
    return (
        <li className={className}>
            <NavLink to={`/month/${fmtToday}`} activeClassName="active"> Today </NavLink>
        </li>
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
        return (
            <div className={styles.yearSelection}>
                <h2>Year</h2>
                <ul>
                    {years.map(y => (<Year year={y} today={this.today} activeMonth={activeMonth} />))}

                    <Today activeMonth={activeMonth} />
                </ul>
            </div>
        );
    }
}

export default YearSelection;
