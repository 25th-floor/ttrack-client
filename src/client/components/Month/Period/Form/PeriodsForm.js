import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';

import Period from './PeriodsFormRow';
import * as periodUtils from '../../../../../common/periodUtils';

import styles from './less/PeriodsForm.less';

export default React.createClass({
    propTypes: {
        periods: React.PropTypes.instanceOf(Immutable.Collection).isRequired,
        types: React.PropTypes.instanceOf(Immutable.List).isRequired,
        dayTargetTime: React.PropTypes.objectOf(moment.duration).isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onSave: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        // add at least one element if turning to edit mode
        let periods = this.props.periods.toList();
        if (periods.size == 0) {
            periods = periods.push(Immutable.Map({ id: 1 }));
        }

        return {
            periods: periods, // todo id setzen
            removed: [] // todo immutable?
        };
    },
    onAddPeriod: function () {
        const maxId = this.state.periods.reduce(function (maxId, fi) {
            return Math.max(maxId, fi.get('id'));
        }, 0);
        this.setState({
            periods: this.state.periods.push(Immutable.Map({ id: maxId + 1 })),
            removed: this.state.removed
        });
    },
    onRemovePeriod: function (index) {
        let toBeRemoved = this.state.periods.get(index);
        let removed = this.state.removed;
        if (toBeRemoved.get('per_id')) {
            removed.push(toBeRemoved.get('per_id'));
        }

        var periods = this.state.periods.delete(index);
        this.setState({
            periods: periods,
            removed: removed
        });
    },
    onUpdatePeriod: function (index, period) {
        this.setState({
            periods: this.state.periods.set(
                index,
                period
            ),
            removed: this.state.removed
        });
    },
    onSave: function (e) {
        e.preventDefault();
        if (this.isValid()) {
            this.props.onSave(this.state.periods, this.state.removed);
        } else {
            console.log('not valid');
        }
    },
    onCancel: function (event) {
        event.preventDefault();
        this.props.onCancel(event);
    },
    onKeyDown: function (event) {
        if (event.keyCode === 13) {
            this.onSave(event);
            // escape just cancel everything
        } else if (event.keyCode === 27) {
            this.onCancel(event);
        }
    },
    isValid: function () {
        // no periods
        if (this.state.periods.size == 0 && this.state.removed.length == 0) return false;
        // not valid
        if (!periodUtils.validatePeriods(this.state.periods)) return false;
        return true;
    },
    render: function () {
        let periods = this.state.periods;
        let disableSaveButton = !this.isValid();
        let isOverlapping = periodUtils.isOverlapping(periods);

        return (
            <div className={styles.form}>
                <form onSubmit={this.onSave} onKeyDown={this.onKeyDown}>
                    {periods.map((period, index) => <Period period={period}
                                                            types={this.props.types}
                                                            dayTargetTime={this.props.dayTargetTime}
                                                            key={(period.get('per_id') || period.get('id'))}
                                                            index={index}
                                                            onRemove={this.onRemovePeriod.bind(this, index)}
                                                            onUpdate={this.onUpdatePeriod.bind(this, index)} />)}

                    { isOverlapping ? <div className="alert alert-warning">Der Zeitraum überschneidet sich mit anderen Einträgen an diesem Tag!</div> : ''}

                    <div className={styles.row}>
                        <button className={styles.btn + ' btn btn-primary pull-right'} disabled={disableSaveButton} onClick={this.onSave}>Speichern</button>
                        <button className={styles.btn + ' btn btn-default pull-right'} onClick={this.onCancel}>Abbrechen</button>

                        <button className={styles.btn + ' btn btn-success'} onClick={this.onAddPeriod}><i className="fa fa-fw fa-plus" /> Eintrag hinzufügen</button>
                    </div>
                </form>
            </div>
        );
    }
});


