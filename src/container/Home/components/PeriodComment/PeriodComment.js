// @flow

import React, { Component } from 'react';

import { Utils } from '@data';

import styles from './PeriodComment.module.css';

export type PeriodCommentProps = {
};

/**
 * PeriodComment
 */

export class PeriodComment extends Component {
    props: PeriodCommentProps;

    render() {
        const period = this.props.period;
        const isPeriodDuration = period.duration === Utils.PERIOD;
        let comment = period.per_comment;

        if (!comment || !comment.length) {
            if (isPeriodDuration) return false;
            comment = Utils.getDurationDescription(period.duration);
        }

        const icon = period.getIn(['type', 'pty_config', 'icon']);
        const name = period.getIn(['type', 'pty_name']);

        const style = {
            backgroundColor: period.getIn(['type', 'pty_config', 'bgcolor']),
            color: period.getIn(['type', 'pty_config', 'color']),
        };

        return (
            <span className={styles.periodComment}>
                <span
                    key={period.per_id}
                    className="badge badge-primary"
                    style={style}
                    title={name}
                >
                    <i className={`fa fa-fw ${icon}`} />
                </span>
                <span className={`${styles.comment} hidden-xs`}>{comment}</span>
            </span>
        );
    }
}

export default PeriodComment;
