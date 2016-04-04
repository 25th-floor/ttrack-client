'use strict';

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
        months: React.PropTypes.instanceOf(Immutable.List).isRequired,
        onChangeDate: React.PropTypes.func.isRequired
    },
    selectMonth: function (month) {
        let date = this.props.activeMonth.clone().month(month.format('MMMM'));
        this.props.onChangeDate(date);
    },
    renderMonthItem: function (month, index) {
        let className = classSet('col-xs-1',
            month.isSame(this.props.activeMonth, 'month') ? styles.active : null,
            month.isSame(this.today, 'month') ? styles.today : null,
            month.isAfter(this.today, 'month') ? styles.future : null
        );

        let monthNumber = month.format('M');
        let monthShort = month.format('MMM');
        let monthFull = month.format('MMMM');

        return (
            <li className={className} key={index}>
                <a onClick={this.selectMonth.bind(this, month)}> <span className={styles.number}>{monthNumber}</span> <span
                    className={styles.short}>{monthShort}</span> <span className={styles.full}>{monthFull}</span> </a>
            </li>
        );
    },
    render: function () {
        let months = this.props.months;

        return (
            <div className={styles.monthSelection}>
                <h2>Month</h2>
                <ul className="col-xs-10">
                    {months.toList().map(this.renderMonthItem)}
                </ul>
            </div>
        );
    }
});


