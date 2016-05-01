'use strict';

import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import momentDuration from 'moment-duration-format';

import PeriodComment from './PeriodComment';
import * as timeUtils from './../../../../common/timeUtils';

import styles from './less/Period.less';

function getDurationObject(immutable) {
    if (immutable == null) return immutable;
    return immutable.toJS();
}

export default React.createClass({
    propTypes: {
        periods: React.PropTypes.instanceOf(Immutable.Collection).isRequired
    },
    renderPeriodItem: function (period, index) {
        let start = moment.duration(getDurationObject(period.get('per_start'))).format('hh:mm', { trim:false });
        let end = moment.duration(getDurationObject(period.get('per_stop'))).format('hh:mm', { trim:false });
        let pause = timeUtils.formatDurationHoursToLocale(moment.duration(getDurationObject(period.get('per_break'))));

        let duration = timeUtils.formatDurationHoursToLocale(moment.duration(getDurationObject(period.get('per_duration'))));

        if (period.get('per_start') == null && period.get('per_stop') == null) {
            let offsetClass = index == 0 ? 'col-sm-4 col-lg-5' : 'col-sm-4 col-sm-offset-5 col-lg-5';

            return (
                <span className={offsetClass} key={period.get('per_id')}>
                    <PeriodComment period={period} />
                </span>
            );
        }

        let showBreak = period.get('per_break') !== null;

        return (
            <div className={styles.periodRow} key={period.get('per_id')}>
                <div className="col-xs-4 col-sm-2 col-sm-offset-1 col-lg-1 tt-col-lg-1">{start} - {end}</div>
                <div className="col-xs-2 col-sm-1">{duration}</div>
                <div className="col-xs-3 col-sm-2 col-lg-1 tt-col-lg-1">{showBreak ? <span><span className="tt-hidden-smallest">Pause </span>{pause}</span> : null}</div>
                <div className="col-xs-2 col-sm-5 col-lg-offset-1"><PeriodComment period={period} /></div>
            </div>
        );
    },
    render: function () {
        let periods = this.props.periods;
        return (
            <div className={styles.periods}>
                {periods.map(this.renderPeriodItem)}
            </div>
        );
    }
});


