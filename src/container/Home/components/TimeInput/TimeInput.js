// @flow
/* eslint-disable jsx-a11y/label-has-for */
import moment, { type Duration } from 'moment';
import classSet from 'class-set';
import React, { Component } from 'react';
import { Utils } from '@data';

import type { DurationType } from '@data/Resources/ResourcesTypes';

// import styles from './TimeInput.module.css';

export type ChangeFn = (name: string, duration: DurationType) => void;

export type TimeInputProps = {
    time: DurationType,
    id: string,
    label: string,
    name: string,
    placeholder: string,
    css?: string,
    required: boolean,
    round?: number,
    allowNegativeValues: boolean,
    onChange: ChangeFn,
};

type State = {
    time: Duration,
};

/**
 * TimeInput
 */
export class TimeInput extends Component<TimeInputProps, State> {
    constructor(props: TimeInputProps) {
        super(props);

        // {hours: 2, minutes: 1}
        const duration = props.time ? moment.duration(props.time).format('hh:mm', { trim: false }) : '';

        this.state = { time: duration };
    }

    handleChange = (event: any) => {
        let duration = Utils.getValidMoment(event.target.value, this.props.allowNegativeValues);
        if (duration !== null) {
            if (this.props.round) {
                duration = Utils.roundTime(duration, this.props.round);
            }
            this.props.onChange(this.props.id, Utils.getDateObjectFromMomentDuration(duration));
        }

        this.setState({ time: event.target.value });
    };

    render() {
        // time is a string
        const { time } = this.state;

        const css = classSet(
            this.props.css || '',
            {
                'has-error': !Utils.isValidTimeString(time, this.props.required, this.props.allowNegativeValues),
            },
        );

        return (
            <div className={css} key={this.props.id}>
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <input
                    type="text"
                    id={this.props.name}
                    name={this.props.name}
                    placeholder={this.props.placeholder}
                    className="form-control"
                    required={this.props.required}
                    value={time}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default TimeInput;
