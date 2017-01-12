import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';

import Period from './PeriodsFormRow';
import * as periodUtils from '../../../../../common/periodUtils';

import styles from './less/PeriodsForm.less';

export default class extends React.Component {
    static propTypes = {
        periods: React.PropTypes.instanceOf(Immutable.Collection).isRequired,
        types: React.PropTypes.instanceOf(Immutable.List).isRequired,
        dayTargetTime: React.PropTypes.objectOf(moment.duration).isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.handleAddPeriod = this.handleAddPeriod.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleRemovePeriod = this.handleRemovePeriod.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleUpdatePeriod = this.handleUpdatePeriod.bind(this);
        // add at least one element if turning to edit mode
        let periods = props.periods.toList();
        if (periods.size === 0) {
            periods = periods.push(new Immutable.Map({ id: 1 }));
        }

        this.state = {
            // todo id setzen
            periods,

            // todo immutable?
            removed: [],
        };
    }

    handleAddPeriod() {
        const maxId = this.state.periods.reduce((max, fi) => Math.max(max, fi.get('id')), 0);
        this.setState({
            periods: this.state.periods.push(new Immutable.Map({ id: maxId + 1 })),
            removed: this.state.removed,
        });
    }

    handleRemovePeriod(index) {
        const toBeRemoved = this.state.periods.get(index);
        const removed = this.state.removed;
        if (toBeRemoved.get('per_id')) {
            removed.push(toBeRemoved.get('per_id'));
        }

        const periods = this.state.periods.delete(index);
        this.setState({
            periods,
            removed,
        });
    }

    handleUpdatePeriod(index, period) {
        this.setState({
            periods: this.state.periods.set(
                index,
                period
            ),

            removed: this.state.removed,
        });
    }

    handleSave(e) {
        e.preventDefault();
        if (this.isValid()) {
            this.props.onSave(this.state.periods, this.state.removed);
        }
    }

    handleCancel(event) {
        event.preventDefault();
        this.props.onCancel(event);
    }

    handleKeyDown(event) {
        if (event.keyCode === 13) {
            this.handleSave(event);
            // escape just cancel everything
        } else if (event.keyCode === 27) {
            this.handleCancel(event);
        }
    }

    isValid() {
        // no periods
        if (this.state.periods.size === 0 && this.state.removed.length === 0) return false;
        // not valid
        if (!periodUtils.validatePeriods(this.state.periods)) return false;
        return true;
    }

    render() {
        const periods = this.state.periods;
        const disableSaveButton = !this.isValid();
        const isOverlapping = periodUtils.isOverlapping(periods);

        return (
            <div className={styles.form}>
                <form onSubmit={this.handleSave} onKeyDown={this.handleKeyDown}>
                    {periods.map((period, index) => <Period
                        period={period}
                        types={this.props.types}
                        dayTargetTime={this.props.dayTargetTime}
                        key={(period.get('per_id') || period.get('id'))}
                        index={index}
                        onRemove={this.handleRemovePeriod.bind(this, index)}
                        onUpdate={this.handleUpdatePeriod.bind(this, index)}
                    />)}

                    { isOverlapping ? <div className="alert alert-warning">
                        Der Zeitraum überschneidet sich mit anderen Einträgen an diesem Tag!
                    </div>
                        : ''
                    }

                    <div className={styles.row}>
                        <button
                            className={`${styles.btn} btn btn-primary pull-right`}
                            disabled={disableSaveButton}
                            onClick={this.handleSave}
                        >Speichern</button>
                        <button
                            className={`${styles.btn} btn btn-default pull-right`}
                            onClick={this.handleCancel}
                        >Abbrechen</button>

                        <button
                            className={`${styles.btn} btn btn-success`}
                            onClick={this.handleAddPeriod}
                        ><i className="fa fa-fw fa-plus" /> Eintrag hinzufügen</button>
                    </div>
                </form>
            </div>
        );
    }
}
