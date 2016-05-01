import React from 'react';
import Immutable from 'immutable';
import moment from 'moment';
import momentDuration from 'moment-duration-format';
import classSet from 'class-set';

import Period from './Period';
import PeriodsForm from './Period/Form';
import * as timeUtils from './../../../common/timeUtils';

import styles from './less/Day.less';

export default class extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
        this.onSave = this.onSave.bind(this);
        this.state = { edit: false };
    }

    static propTypes = {
        day: React.PropTypes.instanceOf(Immutable.Map).isRequired,
        types: React.PropTypes.instanceOf(Immutable.List).isRequired,
        user: React.PropTypes.object.isRequired,
        activeMonth: React.PropTypes.object.isRequired,
        onSaveDay: React.PropTypes.func.isRequired,
    };

    handleEditClick(event) {
        // don't let user get out with this click
        if (this.state.edit) return;
        this.setState({ edit: !this.state.edit });
    }

    handleCancel(event) {
        this.setState({ edit: false });
    }

    onSave(date, periods, removed) {
        this.props.onSaveDay(date, periods, removed);
        this.setState({ edit: false });
    }

    render() {
        let edit = this.state.edit;

        let day = this.props.day;
        let date = day.get('date');
        let isToday = date.isSame(moment(), 'day');
        let isFuture = date.isAfter(moment(), 'day');

        let fullDate = date.format('DD.MM.YYYY');
        let shortDate = date.format('DD.MM');
        let weekDayShort = date.format('dd');
        let weekDayFull = date.format('dddd');
        let workDuration = timeUtils.formatDurationHoursToLocale(day.get('workDuration'));
        let breakDuration = timeUtils.formatDurationHoursToLocale(day.get('breakDuration'));

        let diff = moment.duration(day.get('workDuration')).subtract(day.get('remaining'));
        let diffDuration = timeUtils.formatDurationHoursToLocale(diff);

        // hide target time diff if there is no workDuration isToday
        // aka don't start with a negative value into the day
        if ((isToday || isFuture) && day.get('workDuration').asSeconds() == 0) {
            diffDuration = '';
        }

        let dateOutOfEmploymentScope = !timeUtils.isDateInEmploymentInterval(date, this.props.user);
        let className = classSet(styles.day,
            !edit ? styles.editable : null,
            timeUtils.isWeekend(date) ? styles.dayWeekend : null,
            isFuture ? styles.dayFuture : null,
            !date.isSame(this.props.activeMonth, 'month') || dateOutOfEmploymentScope ? styles.dayOutOfScope : null,
            day.get('isUnfinished') ? styles.dayUnfinished : null,
            isToday ? styles.dayCurrent : null
        );

        let showDurations = day.get('workDuration') != 0 || day.get('remaining') != 0 || day.get('breakDuration') != 0;

        let durationClass = classSet('col-xs-3 col-sm-2 col-lg-1',
            diff.as('ms') >= 0 ? styles['text-success'] : null,
            diff.as('ms') < 0 ? styles['text-danger'] : null
        );

        let durationBlock = <dl>
            <dt>Arbeitszeit</dt>
            <dd className="col-sm-1 hidden-xs col-lg-1">{day.get('workDuration') != 0 ? workDuration : null}</dd>
            <dt>Pause</dt>
            <dd className="col-sm-1 hidden-xs tt-col-lg-1">{day.get('breakDuration') != 0 ? breakDuration : null}</dd>
            <dt>Differenz</dt>
            <dd className={durationClass}>{diffDuration}</dd>
        </dl>;

        if (!showDurations) {
            durationBlock = <div className="col-xs-2 col-sm-3 col-lg-3 tt-col-lg-3"></div>;
        }

        return (
            <fieldset className={className} key={fullDate} onClick={dateOutOfEmploymentScope ? null : this.handleEditClick}>
                <legend>
                    Tag {fullDate}
                </legend>

                <i className={'fa fa-pencil ' + styles.editIcon} />

                <dl>
                    <dt>Datum</dt>
                    <dd className="col-sm-1 tt-hidden-xsm col-lg-1">{fullDate}</dd>
                    <dd className="col-xs-2 col-sm-1 tt-visible-xsm">{shortDate}</dd>
                    <dt>Wochentag</dt>
                    <dd className="col-sm-2 hidden-xs tt-col-lg-1 col-lg-1">{weekDayShort}</dd>
                    <dd className="col-xs-7 visible-xs">{weekDayFull}</dd>
                </dl>

                {durationBlock}

                {edit ? <PeriodsForm periods={day.get('periods')} types={this.props.types} date={date}
                                     dayTargetTime={day.get('day_target_time')}
                                     onCancel={this.handleCancel} onSave={this.onSave.bind(this, date)} />
                    : <Period periods={day.get('periods')} />}

            </fieldset>

        );
    }
};


