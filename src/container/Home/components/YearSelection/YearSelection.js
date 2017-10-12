// @flow
import moment from 'moment';
import React, { Component } from 'react';
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

    constructor(props, context) {
        super(props, context);
        this.handleToday = this.handleToday.bind(this);
        this.renderYearItem = this.renderYearItem.bind(this);
        this.selectYear = this.selectYear.bind(this);
        const today = Utils.getMomentToday();

        this.state = {
            today,
        };
    }

    handleToday() {
        this.props.onChangeDate(this.state.today);
    }

    selectYear(year) {
        const date = this.props.activeMonth.clone().year(year.format('YYYY'));
        this.props.onChangeDate(date);
    }

    renderYearItem(year, index) {
        const format = 'YYYY';

        const className = classSet('col-xs-1',
            year.isSame(this.props.activeMonth, 'year') ? styles.active : null,
            year.isSame(this.state.today, 'year') ? styles.today : null,
            year.isAfter(this.state.today, 'year') ? styles.future : null,
        );

        const yearNumber = year.format('YY');
        const yearShort = year.format(format);

        const onSelectYear = this.selectYear.bind(this, year);
        console.log(className);
        return (
            <li className={className} key={index}>
                <a onClick={onSelectYear} role="button" tabIndex={0}>
                    <span className={styles.number}>{yearNumber}</span>
                    <span className={styles.short}>{yearShort}</span>
                </a>
            </li>
        );
    }

    renderTodayButton() {
        if (this.props.activeMonth.isSame(moment(), 'year')) {
            return '';
        }

        return (
            <li className={`${styles.today} col-sm-1 ${styles['tt-button-today']}`}>
                <a onClick={this.handleToday} role="button" tabIndex={0}> Today </a>
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
