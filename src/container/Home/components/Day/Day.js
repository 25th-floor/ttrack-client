// @flow
import R from 'ramda';
import moment from 'moment';
import React, { Component } from 'react';
import classSet from 'class-set';

import { Utils } from '@data';
import { PeriodsForm } from '../PeriodsForm';
import { Period } from '../Period';

import styles from './Day.module.css';

export type DayProps = {
};

/**
 * Day
 */

export class Day extends Component {
    props: DayProps;
    constructor(props, context) {
        super(props, context);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.onSave = this.onSave.bind(this);
        this.state = { edit: false };
    }

    onSave(date, periods, removed) {
        this.props.onSaveDay(date, periods, removed);
        this.setState({ edit: false });
    }

    handleEditClick() {
        // don't var user get out with this click
        if (this.state.edit) return;
        this.setState({ edit: !this.state.edit });
    }

    handleCancel() {
        this.setState({ edit: false });
    }

    render() {
        const edit = this.state.edit;

        const day = this.props.day;
        const date = day.date;
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
        const className = classSet(styles.day,
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

        const durationClass = classSet('col-xs-3 col-sm-2 col-lg-1',
            diff.as('ms') >= 0 ? styles['text-success'] : null,
            diff.as('ms') < 0 ? styles['text-danger'] : null,
        );

        let durationBlock = (<dl>
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
        </dl>);

        if (!showDurations) {
            durationBlock = <div className="col-xs-2 col-sm-3 col-lg-3 tt-col-lg-3" />;
        }

        // const onSaveDate = this.onSave.bind(this, date);

        return (
            <fieldset
                className={className}
                key={fullDate}
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
                    date={date}
                    dayTargetTime={day.day_target_time}
                    onCancel={this.handleCancel}
                    onSave={R.curry(this.onSave)(date)}
                />
                    : <Period periods={day.periods} />}

            </fieldset>

        );
    }
}

export default Day;
