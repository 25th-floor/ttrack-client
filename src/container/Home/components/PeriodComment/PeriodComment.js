// @flow

import React from 'react';
import { Utils } from '@data';
import type { AssocPeriodType } from '@data/Constants/utils';

import styles from './PeriodComment.module.css';

export type PeriodCommentProps = {
    period: AssocPeriodType,
};

/**
 * PeriodComment
 */
export const PeriodComment = ({ period }: PeriodCommentProps) => {
    const isPeriodDuration = period.duration === Utils.PERIOD;
    let comment = period.per_comment;

    if (!comment || !comment.length) {
        if (isPeriodDuration) return false;
        comment = Utils.getDurationDescription(period.duration);
    }

    const { icon } = period.type.pty_config;
    const name = period.type.pty_name;

    const style = {
        backgroundColor: period.type.pty_config.bgcolor,
        color: period.type.pty_config.color,
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
};
