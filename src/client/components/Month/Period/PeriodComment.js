import React from 'react';
import Immutable from 'immutable';

import * as periodUtils from '../../../../common/periodUtils';

import styles from './less/PeriodComment.less';

export default class extends React.Component {
    static propTypes = {
        period: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    };

    render() {
        const period = this.props.period;
        const isPeriodDuration = period.get('duration') === periodUtils.PERIOD;
        let comment = period.get('per_comment');

        if (!comment || !comment.length) {
            if (isPeriodDuration) return false;
            comment = periodUtils.getDurationDescription(period.get('duration'));
        }

        const icon = period.getIn(['type', 'pty_config', 'icon']);
        const name = period.getIn(['type', 'pty_name']);

        const style = {
            backgroundColor: period.getIn(['type', 'pty_config', 'bgcolor']),
            color: period.getIn(['type', 'pty_config', 'color']),
        };

        const iconClassName = `fa fa-fw ${icon}`;

        return (
            <span className={styles.periodComment}>
                <span key={period.get('per_id')} className="badge badge-primary"
                    style={style}
                    title={name}
                >
                    <i className={iconClassName}></i>
                </span>
                <span className={`${styles.comment} hidden-xs`}>{comment}</span>
            </span>
        );
    }
}
