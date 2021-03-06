/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// TODO BUG in PLUGIN
// https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md

// @flow
import React, { Component } from 'react';
import R from 'ramda';
import type { Duration } from 'moment';

import { Utils } from '@data';
import type { ProcessedPeriodType } from '@data/Constants/utils';
import type { ApiPeriodTypeType } from '@data/Resources/ResourcesTypes';

import { PeriodsFormRow } from '../PeriodsFormRow';
import styles from './PeriodsForm.module.css';

export type CancelFn = () => void;
type SaveFn = (periods: Array<ProcessedPeriodType>, removed: Array<number>) => void;
export type PeriodsFormProps = {
    periods: Array<ProcessedPeriodType>,
    types: Array<ApiPeriodTypeType>,
    dayTargetTime: Duration,
    onCancel: CancelFn,
    onSave: SaveFn,
};

type State = {
    // periods: Array<ProcessedPeriodType>,
    periods: Array<any>, // todo
    removed: Array<number>,
};

/**
 * PeriodsForm
 */
export class PeriodsForm extends Component<PeriodsFormProps, State> {
    constructor(props: PeriodsFormProps) {
        super(props);

        // add at least one element if turning to edit mode
        let { periods } = props;
        if (periods.length === 0) {
            periods = [
                { id: 1 },
            ];
        }
        this.state = {
            // todo id setzen
            periods,

            // todo immutable?
            removed: [],
        };
    }

    // TODO pseudo generation of id ???
    handleAddPeriod = () => {
        const maxId = this.state.periods.reduce((max, fi) => Math.max(max, fi.per_id), 0);

        this.setState({
            periods: R.append({ id: maxId + 1 })(this.state.periods),
            removed: this.state.removed,
        });
    };

    handleRemovePeriod = (index: number) => {
        const toBeRemoved = this.state.periods[index];
        const { removed } = this.state;
        if (toBeRemoved.per_id) {
            removed.push(toBeRemoved.per_id);
        }

        const periods = R.remove(index, 1)(this.state.periods);

        this.setState({
            periods,
            removed,
        });
    };

    handleUpdatePeriod = R.curry((index, period) => {
        const newPeriods = [
            ...this.state.periods,
        ];

        newPeriods[index] = {
            ...period,
        };

        this.setState({
            periods: newPeriods,
            removed: this.state.removed,
        });
    });

    handleSave = (event: any) => {
        event.preventDefault();
        if (this.isValid()) {
            this.props.onSave(this.state.periods, this.state.removed);
        }
    };

    handleCancel = (event: any) => {
        event.preventDefault();
        this.props.onCancel();
    };

    handleKeyDown = (event: any) => {
        if (event.keyCode === 13) {
            this.handleSave(event);
            // escape just cancel everything
        } else if (event.keyCode === 27) {
            this.handleCancel(event);
        }
    };

    isValid = () => {
        // no periods
        const noPeriods = this.state.periods.length === 0;
        const noRemoved = this.state.removed.length === 0;

        if (noPeriods && noRemoved) return false;

        if (!Utils.validatePeriods(this.state.periods)) return false;
        return true;
    };

    render() {
        const { periods } = this.state;
        const disableSaveButton = !this.isValid();
        const isOverlapping = Utils.isOverlapping(periods);
        return (
            <div className={styles.form}>
                <form onSubmit={this.handleSave} onKeyDown={this.handleKeyDown}>
                    {periods.map((period, index) => (<PeriodsFormRow
                        key={`${(period.per_id || period.id)}-${index}`}
                        period={period}
                        types={this.props.types}
                        dayTargetTime={this.props.dayTargetTime}
                        index={index}
                        onRemove={() => this.handleRemovePeriod(index)}
                        onUpdate={R.curry(this.handleUpdatePeriod)(index)}
                    />))}

                    {
                        isOverlapping ?
                            <div className="alert alert-warning">
                                Der Zeitraum überschneidet sich mit anderen Einträgen an diesem Tag!
                            </div>
                            : ''
                    }

                    <div className={styles.row}>
                        <button
                            className={`${styles.btn} btn btn-primary pull-right`}
                            disabled={disableSaveButton}
                            onClick={this.handleSave}
                        >
                            Speichern
                        </button>
                        <button
                            className={`${styles.btn} btn btn-default pull-right`}
                            onClick={this.handleCancel}
                        >
                            Abbrechen
                        </button>

                        <button
                            className={`${styles.btn} btn btn-success`}
                            onClick={this.handleAddPeriod}
                        ><i className="fa fa-fw fa-plus" /> Eintrag hinzufügen
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default PeriodsForm;
