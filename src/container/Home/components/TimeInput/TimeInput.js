// @flow
import moment from 'moment';
import classSet from 'class-set';
import React, { Component } from 'react';
import { Utils } from '@data';

import styles from './TimeInput.module.css';

export type TimeInputProps = {
};

/**
 * TimeInput
 */

export class TimeInput extends Component {
    props: TimeInputProps;

    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        // {hours: 2, minutes: 1}
        const duration = props.time ? moment.duration(props.time).format('hh:mm', { trim: false }) : '';

        this.state = { time: duration };
    }

    handleChange(event) {
        let duration = Utils.getValidMoment(event.target.value, this.props.allowNegativeValues);
        if (duration !== null) {
            if (this.props.round) {
                duration = Utils.roundTime(duration, this.props.round);
            }
            this.props.onChange(this.props.id, Utils.getDateObjectFromMomentDuration(duration));
        }

        this.setState({ time: event.target.value });
    }

    render() {
        // time is a string
        const time = this.state.time;

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
                    placeholder={this.props.placeholder}
                    className="form-control"
                    required={this.props.required}
                    name={this.props.name}
                    id={this.props.name}
                    value={time}
                    onChange={this.handleChange}
                />
            </div>
        );
    }
}

export default TimeInput;
