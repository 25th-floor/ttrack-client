// @flow
import moment from 'moment';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import classSet from 'class-set';

import { Utils } from '@data';

import styles from './YearSelection.module.css';

export type YearSelectionProps = {
};

/**
 * YearSelection
 */

export class YearSelection extends Component {
    props: YearSelectionProps;
    today = Utils.getMomentToday();

    renderYearItem = (year, index) => {
        const format = 'YYYY';
        const className = classSet('col-xs-1',
            year.isSame(this.props.activeMonth, 'year') ? styles.active : null,
            year.isSame(this.today, 'year') ? styles.today : null,
            year.isAfter(this.today, 'year') ? styles.future : null,
        );
        const fmtYear = this.props.activeMonth.clone().year(year.format('YYYY')).format('YYYY-MM');
        return (
            <li className={className} key={index}>
                <NavLink
                    to={`/month/${fmtYear}`}
                    activeClassName={`${styles.active}`}
                >
                    <span className={styles.number}>{year.format('YY')}</span>
                    <span className={styles.short}>{year.format('YYYY')}</span>
                </NavLink>
            </li>
        );
    }

    renderTodayButton() {
        if (this.props.activeMonth.isSame(moment(), 'year')) {
            return '';
        }
        const fmtToday = this.props.activeMonth.startOf('month').format('YYYY-MM');
        return (
            <li className={`${styles.today} col-sm-1 ${styles['tt-button-today']}`}>
                <NavLink to={`/month/${fmtToday}`} activeClassName="active" > Today </NavLink>
            </li>
        );
    }

    render() {
        const years = this.props.years;
        return (
            <div className={styles.yearSelection}>
                <h2>Year</h2>
                <ul>
                    {years.map(this.renderYearItem)}

                    {this.renderTodayButton()}
                </ul>
            </div>
        );
    }
}

export default YearSelection;
