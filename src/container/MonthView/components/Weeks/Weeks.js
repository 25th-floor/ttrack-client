// @flow
import React, { Component } from 'react';
import R from 'ramda';
import classSet from 'class-set';
import type { Moment, Duration } from 'moment';

import { Utils } from '@data';
import type { ProcessedWeekType, ProcessedDayType } from '@data/Constants/utils';
import type { PeriodTypeType, UserType } from '@data/Resources/ResourcesTypes';

import { Day, type SaveFn } from '../Day';

import styles from './Weeks.module.css';

export type WeeksProps = {
    weeks: Array<ProcessedWeekType>,
    activeMonth: Moment,
    types: Array<PeriodTypeType>,
    user: UserType,
    onSaveDay: SaveFn,
};

/**
 * Weeks
 */
export class Weeks extends Component<WeeksProps> {
    renderDayItem = (day: ProcessedDayType) => (
        <Day
            day={day}
            key={day.day_date}
            activeMonth={this.props.activeMonth}
            types={this.props.types}
            user={this.props.user}
            onSaveDay={this.props.onSaveDay}
        />
    );

    renderDeltaItem(classes: string, delta: Duration) {
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

    renderWeekSum(week: ProcessedWeekType) {
        const workDuration = week.workDuration.format('hh:mm', { trim: false });

        const diff = week.diffUntilToday;
        const { carry } = week;

        const firstDayOfWeek = R.last(week.days);
        const lastDayOfWeek = R.last(week.days);

        const className = classSet(
            styles.weekSumRow,
            !Utils.isDateInEmploymentInterval(firstDayOfWeek.date, this.props.user) &&
            !Utils.isDateInEmploymentInterval(lastDayOfWeek.date, this.props.user) ? styles.dayOutOfScope : null,
        );

        let carryTime = '';
        let diffTime = '';

        if (!Utils.isWeekInFuture(week)) {
            carryTime = this.renderDeltaItem('col-xs-2 col-sm-1 col-sm-offset-4 col-lg-offset-3 tt-col-lg-offset-3', carry);
            diffTime = this.renderDeltaItem('col-xs-2 col-sm-7 col-sm-offset-1 col-lg-7 col-lg-offset-1', diff);
        }

        return (
            <fieldset key={`weeksum-${week.weekNr}`} className={className}>
                <legend>Wochensumme {week.weekNr}</legend>

                <dl>
                    <dt>Kalenderwoche</dt>
                    <dd className="col-xs-9 col-sm-2 tt-col-lg-2-s">KW {week.weekNr}</dd>

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

    renderWeekItem = (week: ProcessedWeekType) => (
        <fieldset className={styles.week} key={week.weekNr}>
            <legend>Week {week.weekNr}</legend>
            {week.days.map(this.renderDayItem)}
            {this.renderWeekSum(week)}
        </fieldset>
    );

    render() {
        const { weeks } = this.props;
        return (
            <div className={styles.weeks}>
                { R.compose(R.map(this.renderWeekItem), R.values)(weeks) }
            </div>
        );
    }
}
// {R.mapObjIndexed(this.renderWeekItem)(weeks[0])}

export default Weeks;
