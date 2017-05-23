import PropTypes from 'prop-types';
/* eslint-disable jsx-a11y/label-has-for*/
import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import _ from 'lodash';

import TimeInput from '../../../TimeInput';
import * as periodUtils from '../../../../../common/periodUtils';

import styles from './less/PeriodsForm.less';

function findType(types, value) {
    return types.find(type => type.get('pty_id') === value);
}

export default class extends React.Component {
    static propTypes = {
        period: PropTypes.instanceOf(Immutable.Map).isRequired,
        types: PropTypes.instanceOf(Immutable.List).isRequired,
        dayTargetTime: PropTypes.objectOf(moment.duration).isRequired,
        index: PropTypes.number.isRequired,
        onRemove: PropTypes.func.isRequired,
        onUpdate: PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);

        let period = props.period;
        if (!period.get('type')) {
            period = period.merge({
                type: findType(props.types, 'Work'),
            });
        }
        // handle default duration to be the first duration found in the config
        if (!period.get('duration')) {
            period = period.merge({
                // eslint-disable-next-line newline-per-chained-call
                duration: period.get('type').get('pty_config').get('types').keySeq().first(),
            });
            // add duration per_duration object if needed
            period = period.merge(this.addDurationTime(period));
        }

        this.state = { period };

        this.handleComment = this.handleComment.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.renderDurationRadio = this.renderDurationRadio.bind(this);
        this.renderSelectOption = this.renderSelectOption.bind(this);
    }

    componentDidMount() {
        // focus on select on first creation
        this.selectType.focus();
    }

    handleTypeChange(event) {
        const { period } = this.state;
        const { types } = this.props;

        const type = findType(types, event.target.value);
        const cfg = type.get('pty_config').get('types').toJS();
        const defaultDuration = _.findKey(cfg, value => value) || periodUtils.NONE;
        const durationValue = period.get('duration');

        // cleanup
        let breakDuration = period.get('per_break');
        let start = period.get('per_start');
        let stop = period.get('per_stop');
        if (!cfg.period) {
            breakDuration = null;
            start = null;
            stop = null;
        }

        const p = period.merge({
            type,
            per_start: start,
            per_stop: stop,
            per_break: breakDuration,
            duration: cfg[durationValue] ? durationValue : defaultDuration,
        });
        this.updateState(p);
    }

    handleDurationChange(event) {
        let period = this.state.period.merge({
            duration: event.target.value,
        });

        // if duration type is not period, remove it
        if (event.target.value !== periodUtils.PERIOD) {
            period = period.merge({
                per_start: null,
                per_stop: null,
                per_break: null,
            });
        }

        this.updateState(period);
    }

    handleTimeChange(name, duration) {
        const value = {};
        value[name] = duration;
        const period = this.state.period.merge(value);

        this.updateState(period);
    }

    handleComment(event) {
        const period = this.state.period.merge({
            per_comment: event.target.value,
        });
        this.updateState(period);
    }

    addDurationTime(period) {
        return {
            per_duration: periodUtils.calculateDuration(period, this.props.dayTargetTime),
        };
    }

    updateState(period) {
        // add duration per_duration object if needed
        const updatedPeriod = period.merge(this.addDurationTime(period));
        this.props.onUpdate(updatedPeriod);
        this.setState({ period: updatedPeriod });
    }

    renderSelectOption(type) {
        return (
            <option value={type.get('pty_id')} key={type.get('pty_id')}>{type.get('pty_name')}</option>
        );
    }

    renderDurationRadio(elementName, value, duration, index) {
        const id = `${elementName}-${duration.name}`;

        return (
            <div className="col-xs-4 col-sm-2" key={index}>
                <label htmlFor={id} className="radio-inline">
                    <input
                        type="radio" name={`${elementName}[duration]`} id={id} value={duration.name}
                        checked={duration.name === value}
                        onChange={this.handleDurationChange}
                    />
                    {duration.description}
                </label>
            </div>
        );
    }

    renderErrorMessages() {
        const period = this.state.period;
        const errors = periodUtils.getAllErrors(period);

        return (
            <div className="alert alert-warning">
                {errors.map((msg, index) => <span key={index}>{msg}</span>)}
            </div>
        );
    }

    render() {
        const period = this.state.period;
        const isValid = periodUtils.validatePeriod(period);

        const elementName = `period-${period.get('per_id') ? period.get('per_id') : this.props.index}`;

        const cfg = period.getIn(['type', 'pty_config', 'types']) || new Immutable.Map();

        const durations = periodUtils.durationConfig.filter(d => cfg.get(d.name) === true);

        let periodElements = [];
        const elementCss = 'controls col-xs-6 col-sm-2 col-lg-1 tt-col-lg-1';
        const comment = { name: `${elementName}[per_comment]`, className: 'controls col-xs-12 col-lg-8' };
        if (period.get('duration') === periodUtils.PERIOD) {
            periodElements = [{
                id: 'per_start',
                label: 'Startzeit',
                name: `${elementName}[per_start]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.get('per_start'),
                required: true,
                round: -15,
            }, {
                id: 'per_stop',
                label: 'Endzeit',
                name: `${elementName}[per_stop]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.get('per_stop'),
                required: false,
                round: +15,
            }, {
                id: 'per_break',
                label: 'Pause',
                name: `${elementName}[per_break]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.get('per_break'),
                required: false,
                round: +15,
            }];

            comment.className += ' col-sm-6';
        } else if (period.get('duration') === periodUtils.DURATION) {
            periodElements = [{
                id: 'per_duration',
                label: 'Zeit',
                name: `${elementName}[per_duration]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.get('per_duration'),
                required: true,
                round: null,
                negative: true,
            }];
        }

        const ref = (selectType) => {
            this.selectType = selectType;
        };

        return (
            <div className={styles.row} key={period.get('per_id')}>
                {!isValid ? this.renderErrorMessages() : ''}

                <div className="pull-right">
                    <a onClick={this.props.onRemove}>
                        <i className="fa fa-trash text-danger" />
                    </a>
                </div>
                <div className="row">
                    <label className="col-xs-12 col-sm-3 col-lg-2">
                        <select
                            className="col-xs-12 form-control"
                            name={`${elementName}[pty_id]`}
                            value={period.getIn(['type', 'pty_id'])}
                            onChange={this.handleTypeChange}
                            ref={ref}
                        >
                            {this.props.types.toList().map(this.renderSelectOption)}
                        </select>
                    </label>

                    {durations.map(this.renderDurationRadio.bind(null, elementName, period.get('duration')))}
                </div>

                <div className="row">
                    {periodElements.map(p => (
                        <TimeInput
                            id={p.id}
                            label={p.label}
                            name={p.name}
                            css={p.className}
                            placeholder={p.placeholder}
                            time={p.value}
                            required={p.required}
                            key={p.id}
                            round={p.round}
                            allowNegativeValues={p.negative || false}
                            onChange={this.handleTimeChange}
                        />
                    ))}

                    <div className={comment.className}>
                        <label htmlFor={comment.name}>Kommentar</label>
                        <input
                            type="text" placeholder="Kommentar" className="form-control"
                            name={comment.name} id={comment.name} value={period.get('per_comment') || ''}
                            onChange={this.handleComment}
                        />
                    </div>
                </div>

            </div>
        );
    }
}
