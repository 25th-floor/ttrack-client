import React from 'react';
import Immutable from 'immutable';
import classSet from 'class-set';

import Day from './Day';
import * as timeUtils from './../../../common/timeUtils';

import styles from './less/Weeks.less';

export default class extends React.Component {
    static propTypes = {
        weeks: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        types: React.PropTypes.instanceOf(Immutable.List).isRequired,
        user: React.PropTypes.object.isRequired,
        activeMonth: React.PropTypes.object.isRequired,
        onSaveDay: React.PropTypes.func.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.renderDayItem = this.renderDayItem.bind(this);
        this.renderWeekItem = this.renderWeekItem.bind(this);
    }

    renderDayItem(day) {
        return (
            <Day
                day={day} key={day.get('day_date')} activeMonth={this.props.activeMonth} types={this.props.types}
                user={this.props.user} onSaveDay={this.props.onSaveDay}
            />
        );
    }

    renderDeltaItem(classes, delta) {
        const str = delta.format('hh:mm', { trim: false });
        const className = classSet(
            classes || '',
            {
                'text-success': delta.as('ms') >= 0,
                'text-danger': delta.as('ms') < 0,
            },
        );
        return <dd className={className}>{str}</dd>;
    }

    renderWeekSum(week) {
        const workDuration = week.get('workDuration').format('hh:mm', { trim: false });

        const diff = week.get('diffUntilToday');
        const carry = week.get('carry');

        const firstDate = week.get('days').first().get('date');
        const lastDate = week.get('days').last().get('date');

        const className = classSet(styles.weekSumRow,
            !timeUtils.isDateInEmploymentInterval(firstDate, this.props.user) &&
            !timeUtils.isDateInEmploymentInterval(lastDate, this.props.user) ? styles.dayOutOfScope : null,
        );

        let carryTime = '';
        let diffTime = '';

        if (!timeUtils.isWeekInFuture(week)) {
            carryTime = this.renderDeltaItem(
                'col-xs-2 col-sm-1 col-sm-offset-4 col-lg-offset-3 tt-col-lg-offset-3', carry,
            );
            diffTime = this.renderDeltaItem('col-xs-2 col-sm-7 col-sm-offset-1 col-lg-7 col-lg-offset-1', diff);
        }
        return (
            <fieldset className={className}>
                <legend>Wochensumme {week.get('weekNr')}</legend>

                <dl>
                    <dt>Kalenderwoche</dt>
                    <dd className="col-xs-9 col-sm-2 tt-col-lg-2-s">KW {week.get('weekNr')}</dd>

                    <dt>Summe Arbeitszeit</dt>
                    <dd className="col-sm-1 col-sm-offset-1 hidden-xs col-lg-offset-0 tt-col-lg-1">{workDuration}</dd>

                    <dt>Wochendifferenz</dt>
                    {diffTime}
                </dl>

                <dl className={styles.weekCarry}>
                    <dt className="col-xs-9 col-sm-1 tt-col-lg-1">Übertrag</dt>
                    {carryTime}
                </dl>
            </fieldset>
        );
    }

    renderWeekItem(week) {
        return (
            <fieldset className={styles.week} key={week.get('weekNr')}>
                <legend>Week {week.get('weekNr')}</legend>
                {week.get('days').map(this.renderDayItem)}
                {this.renderWeekSum(week)}
            </fieldset>
        );
    }

    render() {
        const weeks = this.props.weeks;
        return (
            <div className={styles.weeks}>
                {weeks.toList().map(this.renderWeekItem)}
            </div>
        );
    }
}
