// @flow
/* eslint-disable jsx-a11y/click-events-have-key-events */
// TODO FIX eslint error
import React, { Component } from 'react';
import R from 'ramda';
import moment, { type Moment } from 'moment';
import classSet from 'class-set';

import { Utils } from '@data';
import type { AssocPeriodType, ProcessedDayType } from '@data/Constants/utils';
import type { PeriodTypeType, UserType } from '@data/Resources/ResourcesTypes';

import { PeriodsForm } from '../PeriodsForm';
import { Periods } from '../Period';

import styles from './Day.module.css';

export type SaveFn = (date: Moment, periods: Array<AssocPeriodType>, removed: Array<number>) => any; // void or promise
export type DayProps = {
    /**
     * Day
     */
    day: ProcessedDayType,
    /**
     * Active Month as Moment, todo: remove?
     */
    activeMonth: Moment,
    /**
     * Array of PeriodTypes
     */
    types: Array<PeriodTypeType>,
    /**
     * UserType element
     */
    user: UserType,
    onSaveDay: SaveFn,
};

type State = {
    edit: boolean,
};

/**
 * Day
 */
export class Day extends Component<DayProps, State> {
    state = { edit: false };

    onSave = R.curry((date, periods, removed) => {
        this.props.onSaveDay(date, periods, removed);
        this.setState({ edit: false });
    });

    handleEditClick = () => {
        // don't var user get out with this click
        if (this.state.edit) return;
        this.setState({ edit: !this.state.edit });
    };

    handleCancel = () => {
        this.setState({ edit: false });
    };

    render() {
        const { edit } = this.state;

        const { day } = this.props;
        const { date } = day;
        const isToday = date.isSame(moment(), 'day');
        const isFuture = date.isAfter(moment(), 'day');

        const fullDate = date.format('DD.MM.YYYY');
        const shortDate = date.format('DD.MM');
        const weekDayShort = date.format('dd');
        const weekDayFull = date.format('dddd');
        const workDuration = Utils.formatDurationHoursToLocale(day.workDuration);
        const breakDuration = Utils.formatDurationHoursToLocale(day.breakDuration);
        const balanceDuration = Utils.formatDurationHoursToLocale(day.balanceDuration);

        const diff = moment.duration(day.workDuration).subtract(day.remaining);
        let diffDuration = Utils.formatDurationHoursToLocale(diff);

        // hide target time diff if there is no workDuration isToday
        // aka don't start with a negative value into the day
        if ((isToday || isFuture) && day.workDuration.asSeconds() === 0) {
            diffDuration = '';
        }

        const dateOutOfEmploymentScope = !Utils.isDateInEmploymentInterval(date, this.props.user);
        const className = classSet(
            styles.day,
            !edit ? styles.editable : null,
            Utils.isWeekend(date) ? styles.dayWeekend : null,
            isFuture ? styles.dayFuture : null,
            !date.isSame(this.props.activeMonth, 'month') || dateOutOfEmploymentScope ? styles.dayOutOfScope : null,
            day.isUnfinished ? styles.dayUnfinished : null,
            isToday ? styles.dayCurrent : null,
        );

        const showDurations = day.workDuration.asSeconds() !== 0 ||
            day.remaining.asSeconds() !== 0 ||
            day.breakDuration.asSeconds() !== 0;

        const durationClass = classSet(
            'col-xs-3 col-sm-2 col-lg-1',
            diff.as('ms') >= 0 ? styles['text-success'] : null,
            diff.as('ms') < 0 ? styles['text-danger'] : null,
        );

        let durationBlock = (
            <dl>
                <dt>Arbeitszeit</dt>
                <dd className="col-sm-1 hidden-xs col-lg-1">
                    {day.workDuration.asSeconds() !== 0 ? workDuration : null}
                    {day.balanceDuration.asSeconds() !== 0 ? <div>{balanceDuration}</div> : null}
                </dd>
                <dt>Pause</dt>
                <dd className="col-sm-1 hidden-xs tt-col-lg-1">
                    {day.breakDuration.asSeconds() !== 0 ? breakDuration : null}
                </dd>
                <dt>Differenz</dt>
                <dd className={durationClass}>{diffDuration}</dd>
            </dl>
        );

        if (!showDurations) {
            durationBlock = <div className="col-xs-2 col-sm-3 col-lg-3 tt-col-lg-3" />;
        }

        const onSave = this.onSave(date);

        return (
            <fieldset
                className={className}
                onClick={dateOutOfEmploymentScope ? null : this.handleEditClick}
            >
                <legend>
                    Tag {fullDate}
                </legend>

                <i className={`fa fa-pencil ${styles.editIcon}`} />

                <dl>
                    <dt>Datum</dt>
                    <dd className="col-sm-1 tt-hidden-xsm col-lg-1">{fullDate}</dd>
                    <dd className="col-xs-2 col-sm-1 tt-visible-xsm">{shortDate}</dd>
                    <dt>Wochentag</dt>
                    <dd className="col-sm-2 hidden-xs tt-col-lg-1 col-lg-1">{weekDayShort}</dd>
                    <dd className="col-xs-7 visible-xs">{weekDayFull}</dd>
                </dl>

                {durationBlock}

                {edit ? <PeriodsForm
                    periods={day.periods}
                    types={this.props.types}
                    dayTargetTime={day.day_target_time}
                    onCancel={this.handleCancel}
                    onSave={onSave}
                />
                    : <Periods periods={day.periods} />}

            </fieldset>

        );
    }
}

export default Day;
