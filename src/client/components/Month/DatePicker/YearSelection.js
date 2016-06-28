import React from 'react';

import moment from 'moment';
import classSet from 'class-set';
import Immutable from 'immutable';

import * as timeUtils from '../../../../common/timeUtils';

import styles from './less/DatePicker.less';

export default class extends React.Component {
    static propTypes = {
        activeMonth: React.PropTypes.object.isRequired,
        years: React.PropTypes.instanceOf(Immutable.List).isRequired,
        onChangeDate: React.PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.handleToday = this.handleToday.bind(this);
        this.renderYearItem = this.renderYearItem.bind(this);
        this.selectYear = this.selectYear.bind(this);
        const today = timeUtils.getMomentToday();

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
            year.isAfter(this.state.today, 'year') ? styles.future : null
        );

        const yearNumber = year.format('YY');
        const yearShort = year.format(format);

        const onSelectYear = this.selectYear.bind(this, year);

        return (
            <li className={className} key={index}>
                <a onClick={onSelectYear}>
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
                <a onClick={this.handleToday}> Today </a>
            </li>
        );
    }

    render() {
        const years = this.props.years;

        return (
            <div className={styles.yearSelection}>
                <h2>Year</h2>
                <ul>
                    {years.toList().map(this.renderYearItem)}

                    {this.renderTodayButton()}
                </ul>
            </div>
        );
    }
}
