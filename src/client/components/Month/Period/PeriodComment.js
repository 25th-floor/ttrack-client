import React from 'react';
import Immutable from 'immutable';
import _ from 'lodash';
import moment from 'moment';
import momentDuration from 'moment-duration-format';
import classSet from 'class-set';

import * as periodUtils from '../../../../common/periodUtils';

import styles from './less/PeriodComment.less';

export default React.createClass({
    propTypes: {
        period: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    },

    render() {
        let period = this.props.period;
        let isPeriodDuration = period.get('duration') == periodUtils.PERIOD;
        let comment = period.get('per_comment');

        if (!comment || !comment.length) {
            if (isPeriodDuration) return false;
            comment = periodUtils.getDurationDescription(period.get('duration'));
        }

        let icon = period.getIn(['type', 'pty_config', 'icon']);
        let name = period.getIn(['type', 'pty_name']);

        let style = {
            backgroundColor: period.getIn(['type', 'pty_config', 'bgcolor']),
            color: period.getIn(['type', 'pty_config', 'color']),
        };

        let iconClassName = 'fa fa-fw ' + icon;

        return (
            <span className={styles.periodComment}>
                <span key={period.get('per_id')} className="badge badge-primary"
                      style={style}
                      title={name}>
                    <i className={iconClassName}></i>
                </span>
                <span className={styles.comment + ' hidden-xs'}>{comment}</span>
            </span>
        );
    },
});


