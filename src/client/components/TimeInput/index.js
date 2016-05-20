import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import momentDuration from 'moment-duration-format';
import classSet from 'class-set';

import * as timeUtils from '../../../common/timeUtils';

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        // {hours: 2, minutes: 1}
        const duration = props.time ? moment.duration(props.time.toJS()).format('hh:mm', { trim:false }) : '';

        this.state = { time: duration };
    }

    static propTypes = {
        time: React.PropTypes.instanceOf(Immutable.Map),
        id: React.PropTypes.string,
        label: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        css: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        required: React.PropTypes.bool,
        round: React.PropTypes.number,
        onChange: React.PropTypes.func.isRequired,
    };

    handleChange(event) {
        let duration = timeUtils.getValidMoment(event.target.value);
        if (duration != null) {
            if (this.props.round) {
                duration = timeUtils.roundTime(duration, this.props.round);
            }
            this.props.onChange(this.props.id, timeUtils.getDateObjectFromMomentDuration(duration));
        }

        this.setState({ time : event.target.value });
    }

    render() {
        // time is a string
        const time = this.state.time;

        const css = classSet(
            this.props.css || '',
            {
                'has-error' : !timeUtils.isValidTimeString(time, this.props.required),
            }
        );

        return (
            <div className={css}>
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <input type="text" placeholder={this.props.placeholder} className="form-control" required={this.props.required}
                       name={this.props.name} id={this.props.name} value={time} onChange={this.handleChange} />
            </div>
        );
    }
}


