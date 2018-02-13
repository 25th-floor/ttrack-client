// @flow
/* eslint-disable jsx-a11y/label-has-for */
// TODO eslint
import React, { Component } from 'react';
import R from 'ramda';

import { Utils } from '@data';
import type { ProcessedPeriodType } from '@data/Constants/utils';
import type { DurationType, ApiPeriodTypeType } from '@data/Resources/ResourcesTypes';

import { TimeInput } from '../TimeInput';

import styles from './PeriodsFormRow.module.css';

function findType(types: Array<ApiPeriodTypeType>, value: string): ApiPeriodTypeType | {} {
    return types.find(type => type.pty_id === value) || {};
}

export type RemoveFn = (index: number) => void;
// export type UpdateFn = (index: number, period: ProcessedPeriodType) => void;
export type UpdateFn = (index: number, period: any) => void; // todo
export type PeriodsFormRowProps = {
    period: ProcessedPeriodType,
    types: Array<ApiPeriodTypeType>,
    dayTargetTime: DurationType,
    index: number,
    onRemove: RemoveFn,
    onUpdate: UpdateFn,
};

type State = {
    period: ProcessedPeriodType,
};

/**
 * PeriodsFormRow
 */
export class PeriodsFormRow extends Component<PeriodsFormRowProps, State> {
    selectType: any; // todo

    constructor(props: PeriodsFormRowProps) {
        super(props);

        let { period } = props;
        if (!period.type) {
            period = {
                ...period,
                type: findType(props.types, 'Work'),
            };
        }
        // handle default duration to be the first duration found in the config
        if (!period.duration) {
            period = {
                ...period,
                duration: 'period',
            };
            // add duration per_duration object if needed
            period = {
                ...period,
                ...this.addDurationTime(period),
            };
        }

        this.state = { period };
    }

    componentDidMount() {
        // focus on select on first creation
        this.selectType.focus();
    }

    addDurationTime(period: ProcessedPeriodType) {
        return {
            per_duration: Utils.calculateDuration(period, this.props.dayTargetTime),
        };
    }

    handleTypeChange = (event: any) => {
        const { period } = this.state;
        const { types } = this.props;

        const type = findType(types, event.target.value);
        const cfg = R.pathOr({}, ['pty_config', 'types'])(type);
        const defaultDuration = R.head(R.keys(R.pickBy(val => val === true, cfg))) || Utils.NONE;
        // ???   _.findKey(cfg, value => value) || Utils.NONE;
        const durationValue = period.duration;

        // cleanup
        let breakDuration = period.per_break;
        let start = period.per_start;
        let stop = period.per_stop;
        if (!cfg.period) {
            breakDuration = null;
            start = null;
            stop = null;
        }

        this.updateState({
            ...period,
            type,
            per_start: start,
            per_stop: stop,
            per_break: breakDuration,
            duration: cfg[durationValue] ? durationValue : defaultDuration,
        });
    };

    handleDurationChange = (event: any) => {
        let period = {
            ...this.state.period,
            duration: event.target.value,
        };

        // if duration type is not period, remove it
        if (event.target.value !== Utils.PERIOD) {
            period = {
                ...period,
                per_start: null,
                per_stop: null,
                per_break: null,
            };
        }

        this.updateState(period);
    };

    handleTimeChange = (name: string, duration: DurationType) => {
        const value = {};
        value[name] = duration;

        this.updateState({
            ...this.state.period,
            ...value,
        });
    };

    handleComment = (event: any) => {
        this.updateState({
            ...this.state.period,
            per_comment: event.target.value,
        });
    };

    updateState(period: any) { // todo any
        // add duration per_duration object if needed
        const per_duration = this.addDurationTime(period);
        const updatedPeriod = {
            ...period,
            ...per_duration,
        };
        this.props.onUpdate(updatedPeriod);
        this.setState({ period: updatedPeriod });
    }

    renderSelectOption = (type: ApiPeriodTypeType) => (
        <option value={type.pty_id} key={type.pty_id}>{type.pty_name}</option>
    );

    renderDurationRadio = R.curry((elementName, value, duration) => {
        const id = `${elementName}-${duration.name}`;
        return (
            <div className="col-xs-4 col-sm-2" key={id}>
                <label htmlFor={id} className="radio-inline">
                    <input
                        type="radio"
                        name={`${elementName}[duration]`}
                        id={id}
                        value={duration.name}
                        checked={duration.name === value}
                        onChange={this.handleDurationChange}
                    />
                    {duration.description}
                </label>
            </div>
        );
    });

    renderErrorMessages() {
        const { period } = this.state;
        const errors = Utils.getAllErrors(period);

        return (
            <div className="alert alert-warning">
                {errors.map((msg, index) => <span key={index}>{msg}</span>)}
            </div>
        );
    }

    ref = (selectType: any) => {
        this.selectType = selectType;
    };

    render() {
        const { period } = this.state;
        const isValid = Utils.validatePeriod(period);

        const elementName = `period-${period.per_id ? period.per_id : this.props.index}`;

        const cfg = period.type.pty_config.types || {};

        const durations = Utils.durationConfig.filter(d => R.prop(d.name)(cfg) === true);

        let periodElements = [];
        const elementCss = 'controls col-xs-6 col-sm-2 col-lg-1 tt-col-lg-1';
        const comment = { name: `${elementName}[per_comment]`, className: 'controls col-xs-12 col-lg-8' };

        if (period.duration === Utils.PERIOD) {
            periodElements = [{
                id: 'per_start',
                label: 'Startzeit',
                name: `${elementName}[per_start]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.per_start,
                required: true,
                round: -15,
            }, {
                id: 'per_stop',
                label: 'Endzeit',
                name: `${elementName}[per_stop]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.per_stop,
                required: false,
                round: +15,
            }, {
                id: 'per_break',
                label: 'Pause',
                name: `${elementName}[per_break]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.per_break,
                required: false,
                round: +15,
            }];

            comment.className += ' col-sm-6';
        } else if (period.duration === Utils.DURATION) {
            periodElements = [{
                id: 'per_duration',
                label: 'Zeit',
                name: `${elementName}[per_duration]`,
                className: elementCss,
                placeholder: 'hh:mm',
                value: period.per_duration,
                required: true,
                round: 0,
                negative: true,
            }];
        }

        const DurationRadio = this.renderDurationRadio(elementName, period.duration);
        const DurationRadios = R.map(DurationRadio)(durations);

        return (
            <div className={styles.row} key={period.per_id}>
                {!isValid ? this.renderErrorMessages() : ''}

                <div className="pull-right">
                    <button onClick={this.props.onRemove} tabIndex={0} className="btn-link">
                        <i className="fa fa-trash text-danger" />
                    </button>
                </div>
                <div className="row">
                    <label className="col-xs-12 col-sm-3 col-lg-2" htmlFor={`${elementName}[pty_id]`}>
                        <select
                            className="col-xs-12 form-control"
                            name={`${elementName}[pty_id]`}
                            value={period.type.pty_id}
                            onChange={this.handleTypeChange}
                            ref={this.ref}
                        >
                            {this.props.types.map(this.renderSelectOption)}
                        </select>
                    </label>
                    {DurationRadios}
                </div>

                <div className="row">
                    {periodElements.map((p, i) => (
                        <TimeInput
                            id={p.id}
                            label={p.label}
                            name={p.name}
                            css={p.className}
                            placeholder={p.placeholder}
                            time={p.value}
                            required={p.required}
                            key={`${p.id}-${i}-timeinput`}
                            round={p.round}
                            allowNegativeValues={p.negative || false}
                            onChange={this.handleTimeChange}
                        />
                    ))}

                    <div className={comment.className}>
                        <label htmlFor={comment.name}>Kommentar</label>
                        <input
                            type="text"
                            placeholder="Kommentar"
                            className="form-control"
                            name={comment.name}
                            id={comment.name}
                            value={period.per_comment || ''}
                            onChange={this.handleComment}
                        />
                    </div>
                </div>

            </div>
        );
    }
}
