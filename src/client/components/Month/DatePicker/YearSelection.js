import React from 'react';

import _ from 'lodash';
import moment from 'moment';
import classSet from 'class-set';
import Immutable from 'immutable';

import * as timeUtils from '../../../../common/timeUtils';

import styles from './less/DatePicker.less';

export default React.createClass({
    propTypes: {
        activeMonth: React.PropTypes.object.isRequired,
        years: React.PropTypes.instanceOf(Immutable.List).isRequired,
        onChangeDate: React.PropTypes.func.isRequired,
    },

    getInitialState() {
        let today = timeUtils.getMomentToday();

        return {
            today,
        };
    },

    selectYear(year) {
        let date = this.props.activeMonth.clone().year(year.format('YYYY'));
        this.props.onChangeDate(date);
    },

    handleToday() {
        this.props.onChangeDate(this.state.today);
    },

    renderYearItem(year, index) {
        let format = 'YYYY';

        let className = classSet('col-xs-1',
            year.isSame(this.props.activeMonth, 'year') ? styles.active : null,
            year.isSame(this.state.today, 'year') ? styles.today : null,
            year.isAfter(this.state.today, 'year') ? styles.future : null
        );

        let yearNumber = year.format('YY');
        let yearShort = year.format(format);

        return (
            <li className={className} key={index}>
                <a onClick={this.selectYear.bind(this, year)}> <span className={styles.number}>{yearNumber}</span> <span
                    className={styles.short}>{yearShort}</span> </a>
            </li>
        );
    },

    renderTodayButton() {
        if (this.props.activeMonth.isSame(moment(), 'year')) {
            return;
        }

        return (
            <li className={styles.today + ' col-sm-1 ' + styles['tt-button-today']}>
                <a onClick={this.handleToday}> Today </a>
            </li>
        );
    },

    render() {
        let years = this.props.years;

        return (
            <div className={styles.yearSelection}>
                <h2>Year</h2>
                <ul>
                    {years.toList().map(this.renderYearItem)}

                    {this.renderTodayButton()}
                </ul>
            </div>
        );
    },
});


