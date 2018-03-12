// @flow

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment, { type Moment } from 'moment';

import { Actions, Utils, Resources } from '@data';
import { Page } from '@components';

import type { AppState } from '@data';
import { type ProcessedPeriodType, type ProcessedWeekType } from '@data/Constants/utils';
import { type ApiUserType, type ApiPeriodTypeType } from '@data/Resources/ResourcesTypes';


import { DatePicker } from './components/DatePicker';
import { Weeks } from './components/Weeks';

import styles from './MonthView.module.css';

type BoundaryType = {
    firstDay: Moment,
    lastDay: Moment,
};

function getFirstAndLastDayOfMonth(month: Moment): BoundaryType {
    const ret = {};
    ret.firstDay = month.clone();

    // get first day of that month
    ret.firstDay.startOf('month');

    // get last day of that month
    ret.lastDay = ret.firstDay.clone().endOf('month');

    // go back to last monday before first day of month
    ret.firstDay.subtract(ret.firstDay.isoWeekday() - 1, 'day');

    // extend last day to next sunday
    ret.lastDay.add(7 - ret.lastDay.isoWeekday(), 'day');

    return ret;
}

export type MonthViewContainerProps = {
    user: ApiUserType,
    isAuthenticated: boolean,
    // eslint-disable-next-line react/no-unused-prop-types
    match: any, // todo router
};

type State = {
    weeks: Array<ProcessedWeekType>,
    types: Array<ApiPeriodTypeType>,
};

export class MonthViewContainer extends Component<MonthViewContainerProps, State> {
    activeMonth: string;

    componentDidMount() {
        this.setActiveMonth(this.props);
        this.getWeeks(this.activeMonth);
    }

    setActiveMonth = ({ match }: MonthViewContainerProps) => {
        this.activeMonth = match.params.date;
        if (!this.activeMonth) {
            this.activeMonth = Utils.getMomentToday();
        }
    };

    getWeeks = async (activeMonth: string) => {
        const date = moment.utc(activeMonth, 'YYYY-MM', true).startOf('month');
        const boundaries = getFirstAndLastDayOfMonth(date);
        const responseTimeSheet = await Resources.Timesheet.getTimesheetFromUser(
            this.props.user,
            boundaries.firstDay.format('YYYY-MM-DD'),
            boundaries.lastDay.format('YYYY-MM-DD'),
        );
        const periodTypes = await Resources.Timesheet.getTypes();
        const days = Utils.assocPeriodsWithTypes(periodTypes, responseTimeSheet.days);
        const weeks = Utils.createWeeks(
            days,
            responseTimeSheet.carryTime,
        );

        await this.setState({
            weeks,
            types: periodTypes,
        });
    };

    componentWillReceiveProps(nextProps: MonthViewContainerProps) {
        // will set active month from router params or uses the current month
        this.setActiveMonth(nextProps);
        // fetch timesheet from selected month
        this.getWeeks(this.activeMonth);
    }

    handelSaveDay = async (date: Moment, periods: Array<ProcessedPeriodType>, removed: Array<number>) => {
        const { user } = this.props;
        const res = await Resources.Timesheet.saveDay(
            user.usr_id,
            date,
            periods,
            removed,
        );
        // success reload props
        if (res.length !== 0) this.getWeeks(this.activeMonth);
    };

    render() {
        const { isAuthenticated, user } = this.props;
        if (!isAuthenticated) return null;
        const activeMonth = moment.utc(this.activeMonth, 'YYYY-MM', true).startOf('month');
        return (
            <Page>
                <div id={styles.month}>
                    <div className={styles.pageHeader}>
                        <h1 className="hidden-lg hidden-md hidden-sm hidden-xs">Monats Ansicht</h1>
                        <DatePicker
                            activeMonth={activeMonth}
                            years={Utils.getYearsForUser(user, Utils.getMomentToday())}
                            months={Utils.getMonthsForUser(user, activeMonth)}
                        />
                        <div className="clearfix" />
                    </div>

                    <fieldset className={`${styles.monthHeader}`}>
                        <dl>
                            <dt className="col-sm-3 col-md-1 col-lg-1">Datum</dt>
                            <dt className="hidden-sm col-md-2 tt-col-lg-1 col-lg-1">Wochentag</dt>
                            <dt className="col-sm-1 col-lg-1">Arbeitszeit</dt>
                            <dt className="col-sm-1 tt-col-lg-1">Pause</dt>
                            <dt className="col-sm-1 col-lg-1">Differenz</dt>
                            <dt className="col-sm-4 col-lg-6">Kommentar</dt>
                        </dl>
                    </fieldset>
                </div>
                {this.state
                && <Weeks
                    weeks={this.state.weeks}
                    activeMonth={activeMonth}
                    types={this.state.types}
                    user={user}
                    onSaveDay={this.handelSaveDay}
                />}
            </Page>
        );
    }
}

const mapStateToProps = ({ auth }: AppState, { history }) => ({
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    history,
});

const mapDispatchToProps = dispatch => ({
    logout: bindActionCreators(Actions.Auth.logout, dispatch),
});

export const MonthView = withRouter(connect(mapStateToProps, mapDispatchToProps)(MonthViewContainer));
