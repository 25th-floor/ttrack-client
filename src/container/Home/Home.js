// @flow

import moment from 'moment';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Actions, Utils, Resources } from '@data';
import { Footer } from '@components';

import type { UserType } from '@data/Resources';
import type { LogoutActionType, AuthState } from '@data/Auth/AuthTypes';

import { Navigation } from './components/Navigation';
import { DatePicker } from './components/DatePicker';
import { Weeks } from './components/Weeks';

import styles from './Home.module.css';

const mapStateToProps = ({ isAuthenticated, user }: AuthState, { history }) => ({
    isAuthenticated,
    user,
    history,
});

const mapDispatchToProps = dispatch => ({
    logout: bindActionCreators(Actions.Auth.logout, dispatch),
});

export type MonthViewContainerProps = {
    user: UserType,
    isAuthenticated: boolean,
    logout: LogoutActionType,
};

export class MonthViewContainer extends Component {
    props: MonthViewContainerProps;

    async componentDidMount() {
        this.setActiveMonth(this.props);
        this.getWeeks = this.getWeeks.bind(this);
        this.getWeeks(this.activeMonth);
    }

    setActiveMonth = ({ match }) => {
        this.activeMonth = match.params.date;
        if (!this.activeMonth) {
            this.activeMonth = Utils.getMomentToday();
        }
    };

    async getWeeks(activeMonth) {
        const date = moment(activeMonth, 'YYYY-MM', true).startOf('month');
        const boundaries = Utils.getFirstAndLastDayOfMonth(date);
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
    }

    handleLogout = (user) => {
        this.props.logout(user);
    }

    componentWillReceiveProps(nextProps) {
        // will set active month from router params or uses the current month
        this.setActiveMonth(nextProps);
        // fetch timesheet from selected month
        this.getWeeks(this.activeMonth);
    }

    handelSaveDay = async (date, periods, removed) => {
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
        const activeMonth = moment(this.activeMonth, 'YYYY-MM', true).startOf('month');
        return (
            <div className={styles['site-container']}>
                <div className="container-fluid">
                    <div id={styles.month}>
                        <Navigation user={user} onLogout={this.handleLogout} />
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
                </div>
                {this.state
                && <Weeks
                    weeks={this.state.weeks}
                    activeMonth={activeMonth}
                    types={this.state.types}
                    user={user}
                    onSaveDay={this.handelSaveDay}
                />}
                <Footer />
            </div>
        );
    }
}

//    <Footer />
export const Home = withRouter(connect(mapStateToProps, mapDispatchToProps)(MonthViewContainer));
