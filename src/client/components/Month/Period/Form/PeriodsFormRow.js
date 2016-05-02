import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import moment from 'moment';
import momentDuration from 'moment-duration-format';

import PeriodComment from '../PeriodComment';
import TimeInput from '../../../TimeInput';
import * as periodUtils from '../../../../../common/periodUtils';
import * as timeUtils from '../../../../../common/timeUtils';

import styles from './less/PeriodsForm.less';

function getDurationObject(immutable) {
    if (immutable == null) return immutable;
    return immutable.toJS();
}

function findType(types, value) {
    return types.find((type) => type.get('pty_id') == value);
}

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleComment = this.handleComment.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleTimeChange = this.handleTimeChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.renderDurationRadio = this.renderDurationRadio.bind(this);
        this.renderSelectOption = this.renderSelectOption.bind(this);
        let period = props.period;
        if (!period.get('type')) {
            period = period.merge({
                type: findType(props.types, 'Work'),
            });
        }
        // handle default duration to be the first duration found in the config
        if (!period.get('duration')) {
            period = period.merge({
                duration: period.get('type').get('pty_config').get('types').keySeq().first(),
            });
            // add duration per_duration object if needed
            period = period.merge(this.addDurationTime(period));
        }

        this.state = { period };
    }

    static propTypes = {
        period: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        types: React.PropTypes.instanceOf(Immutable.List).isRequired,
        dayTargetTime: React.PropTypes.objectOf(moment.duration).isRequired,
        index: React.PropTypes.number.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        onUpdate: React.PropTypes.func.isRequired,
    };

    componentDidMount() {
        // focus on select on first creation
        ReactDOM.findDOMNode(this.refs.selectType).focus();
    }

    updateState(period) {
        // add duration per_duration object if needed
        period = period.merge(this.addDurationTime(period));
        this.props.onUpdate(period);
        this.setState({ period });
    }

    addDurationTime(period) {
        return period.merge({
            per_duration : periodUtils.calculateDuration(period, this.props.dayTargetTime),
        });
    }

    handleTypeChange(event) {
        const type = findType(this.props.types, event.target.value);
        const cfg = type.get('pty_config').get('types').toJS();
        const defaultDuration = _.findKey(cfg, (value) => value) || periodUtils.NONE;

        const period = this.state.period.merge({
            type,
            duration: cfg[this.state.period.get('duration')] ? this.state.period.get('duration') : defaultDuration,
        });
        this.updateState(period);
    }

    handleDurationChange(event) {
        let period = this.state.period.merge({
            duration: event.target.value,
        });

        // if duration type is not period, remove it
        if (event.target.value != periodUtils.PERIOD) {
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
                    <input type="radio" name={ `${elementName}[duration]` } id={id} value={duration.name} checked={duration.name == value}
                           onChange={this.handleDurationChange} />
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

        const cfg = period.getIn(['type', 'pty_config', 'types']) || Immutable.Map();

        const durations = periodUtils.durationConfig.filter((d) => cfg.get(d.name) == true);

        let periodElements = [];
        const elementCss = 'controls col-xs-6 col-sm-2 col-lg-1 tt-col-lg-1';
        const comment = { name: `${elementName}[per_comment]`, className: 'controls col-xs-12 col-lg-8' };
        if (period.get('duration') == periodUtils.PERIOD) {
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
        }

        return (
            <div className={styles.row} key={period.get('per_id')}>
                {!isValid ? this.renderErrorMessages() : ''}

                <div className="pull-right"><a onClick={this.props.onRemove}><i className="fa fa-trash text-danger" /></a></div>
                <div className="row">
                    <label className="col-xs-12 col-sm-3 col-lg-2">
                        <select className="col-xs-12 form-control" name={`${elementName}[pty_id]`} value={period.getIn(['type', 'pty_id'])} onChange={this.handleTypeChange}
                                ref="selectType">
                            {this.props.types.toList().map(this.renderSelectOption)}
                        </select>
                    </label>

                    {durations.map(this.renderDurationRadio.bind(null, elementName, period.get('duration')))}
                </div>

                <div className="row">
                    {periodElements.map((p, index) => <TimeInput id={p.id} label={p.label} name={p.name}
                                                                 css={p.className} placeholder={p.placeholder}
                                                                 time={p.value} required={p.required} key={index}
                                                                 round={p.round}
                                                                 onChange={this.handleTimeChange} />)}

                    <div className={comment.className}>
                        <label htmlFor={comment.name}>Kommentar</label>
                        <input type="text" placeholder="Kommentar" className="form-control"
                               name={comment.name} id={comment.name} value={period.get('per_comment')} onChange={this.handleComment} />
                    </div>
                </div>

            </div>
        );
    }
}


