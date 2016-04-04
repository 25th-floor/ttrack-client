'use strict';

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

export default React.createClass({
    propTypes: {
        period: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        types: React.PropTypes.instanceOf(Immutable.List).isRequired,
        dayTargetTime: React.PropTypes.objectOf(moment.duration).isRequired,
        index: React.PropTypes.number.isRequired,
        onRemove: React.PropTypes.func.isRequired,
        onUpdate: React.PropTypes.func.isRequired
    },
    componentDidMount: function(){
        // focus on select on first creation
        ReactDOM.findDOMNode(this.refs.selectType).focus();
    },
    getInitialState: function() {
        let period = this.props.period;
        if (!period.get('type')) {
            period = period.merge({
                type: findType(this.props.types, 'Work')
            });
        }
        // handle default duration to be the first duration found in the config
        if (!period.get('duration')) {
            period = period.merge({
                duration: period.get('type').get('pty_config').get('types').keySeq().first()
            });
            // add duration per_duration object if needed
            period = period.merge(this.addDurationTime(period));
        }

        return {period: period};
    },
    updateState: function(period) {
        // add duration per_duration object if needed
        period = period.merge(this.addDurationTime(period));
        this.props.onUpdate(period);
        this.setState({period: period});
    },
    addDurationTime: function(period) {
        return period.merge({
            per_duration : periodUtils.calculateDuration(period, this.props.dayTargetTime)
        });
    },
    handleTypeChange: function(event) {
        let type = findType(this.props.types, event.target.value);
        let cfg = type.get('pty_config').get('types').toJS();
        let defaultDuration = _.findKey(cfg, (value) => value) || periodUtils.NONE;

        var period = this.state.period.merge({
            type: type,
            duration: cfg[this.state.period.get('duration')] ? this.state.period.get('duration') : defaultDuration
        });
        this.updateState(period);
    },
    handleDurationChange: function(event) {
        var period = this.state.period.merge({
            duration: event.target.value
        });

        // if duration type is not period, remove it
        if (event.target.value != periodUtils.PERIOD) {
            period = period.merge({
                per_start: null,
                per_stop: null,
                per_break: null
            });
        }

        this.updateState(period);
    },
    handleTimeChange: function(name, duration) {
        let value = {};
        value[name] = duration;
        var period = this.state.period.merge(value);

        this.updateState(period);
    },
    handleComment: function(event) {
        var period = this.state.period.merge({
           'per_comment': event.target.value
        });
        this.updateState(period);
    },
    renderSelectOption: function(type) {
        return (
            <option value={type.get('pty_id')} key={type.get('pty_id')}>{type.get('pty_name')}</option>
        );
    },
    renderDurationRadio: function(elementName, value, duration, index) {
        let id = elementName + '-' + duration.name;

        return (
            <div className="col-xs-4 col-sm-2" key={index}>
                <label htmlFor={id} className="radio-inline">
                    <input type="radio" name={ elementName + '[duration]' } id={id} value={duration.name} checked={duration.name == value}
                           onChange={this.handleDurationChange}/>
                    {duration.description}
                </label>
            </div>
        );
    },
    renderErrorMessages: function() {
        let period = this.state.period;
        let errors = periodUtils.getAllErrors(period);

        return (
            <div className="alert alert-warning">
                {errors.map((msg, index) => <span key={index}>{msg}</span>)}
            </div>
        );
    },
    render: function() {
        let period = this.state.period;
        let isValid = periodUtils.validatePeriod(period);

        let elementName = 'period-' + (period.get('per_id') ? period.get('per_id') : this.props.index) ;

        let cfg = period.getIn(['type','pty_config','types']) || Immutable.Map();

        let durations = periodUtils.durationConfig.filter((d) => cfg.get(d.name) == true);

        let periodElements = [];
        let elementCss = 'controls col-xs-6 col-sm-2 col-lg-1 tt-col-lg-1';
        let comment = {name: elementName + '[per_comment]', className: 'controls col-xs-12 col-lg-8'};
        if (period.get('duration') == periodUtils.PERIOD) {
            periodElements = [
                {
                    id: 'per_start',
                    label: 'Startzeit',
                    name: elementName + '[per_start]',
                    className: elementCss,
                    placeholder: 'hh:mm',
                    value: period.get('per_start'),
                    required: true,
                    round: -15
                },
                {
                    id: 'per_stop',
                    label: 'Endzeit',
                    name: elementName + '[per_stop]',
                    className: elementCss,
                    placeholder: 'hh:mm',
                    value: period.get('per_stop'),
                    required: false,
                    round: +15
                },
                {
                    id: 'per_break',
                    label: 'Pause',
                    name: elementName + '[per_break]',
                    className: elementCss,
                    placeholder: 'hh:mm',
                    value: period.get('per_break'),
                    required: false,
                    round: +15
                }
            ];

            comment.className+= ' col-sm-6';
        }

        return (
            <div className={styles.row} key={period.get('per_id')}>
                {!isValid ? this.renderErrorMessages() : ''}

                <div className="pull-right"><a onClick={this.props.onRemove}><i className="fa fa-trash text-danger"/></a></div>
                <div className="row">
                    <label className='col-xs-12 col-sm-3 col-lg-2'>
                        <select className='col-xs-12 form-control' name={elementName + '[pty_id]'} value={period.getIn(['type', 'pty_id'])} onChange={this.handleTypeChange}
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
                                                                 onChange={this.handleTimeChange}/>)}

                    <div className={comment.className}>
                        <label htmlFor={comment.name}>Kommentar</label>
                        <input type="text" placeholder="Kommentar" className="form-control"
                               name={comment.name} id={comment.name} value={period.get('per_comment')} onChange={this.handleComment}/>
                    </div>
                </div>

            </div>
        );
    }
});


