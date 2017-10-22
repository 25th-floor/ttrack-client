import R from 'ramda';
import moment from 'moment';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Actions, Utils, Resources } from '@data';
import { Footer } from '@components';

import { Navigation } from './components/Navigation';
import { DatePicker } from './components/DatePicker';
import { Weeks } from './components/Weeks';

import styles from './Home.module.css';

const mapStateToProps = ({ isAuthenticated, user }, { history }) => ({
    isAuthenticated,
    user,
    history,
});

const mapDispatchToProps = dispatch => ({
    logout: bindActionCreators(Actions.Auth.logout, dispatch),
});

function getDurationType(period, targetTime, type) {
    const cfg = type.pty_config.types;

    if (period.per_id !== null) {
        const start = period.per_start;
        const duration = moment.duration(period.per_duration);
        const target = moment.duration(targetTime);

        if (cfg.period && start && moment.duration(start).as('minutes') >= 0) return 'period';
        if (cfg.halfday && duration.as('hours') === (target.as('hours') / 2)) return 'halfday';
        if (cfg.fullday && duration.as('hours') === target.as('hours')) return 'fullday';
        if (cfg.duration) return 'duration';
    } else {
        if (cfg.period) return 'period';
        if (cfg.fullday) return 'fullday';
        if (cfg.halfday) return 'halfday';
        if (cfg.duration) return 'duration';
    }

    return 'none';
}

function assocPeriodWithType(typeMap, targetTime, period) {
    const type = typeMap[period.per_pty_id];
    const duration = getDurationType(period, targetTime, type);
    return {
        ...period,
        type,
        duration,
    };
}

function assocPeriodsWithTypes(types, days) {
    const typeMap = R.compose(
        R.map(R.head),
        R.groupBy(type => type.pty_id),
    )(types);

    // updateIn periods
    return [...R.map(
        day => ({
            ...day,
            periods: R.map(
                R.curry(assocPeriodWithType)(typeMap, day.day_target_time),
            )(day.periods),
        }),
    )(days)];
}

export class HomeContainer extends Component {
    async componentDidMount() {
        const { user, match } = this.props;
        this.activeMonth = match.params.date;
        if (!this.activeMonth) {
            this.activeMonth = Utils.getMomentToday();
        }

        this.getWeeks = this.getWeeks.bind(this);

        this.getWeeks(this.activeMonth);
    }

    async getWeeks(activeMonth) {
        const boundaries = Utils.getFirstAndLastDayOfMonth(activeMonth);
        const responseTimeSheet = await Resources.Timesheet.getTimesheetFromUser(
            this.props.user,
            boundaries.firstDay.format('YYYY-MM-DD'),
            boundaries.lastDay.format('YYYY-MM-DD'),
        );
        const periodTypes = await Resources.Timesheet.getTypes();
        const days = assocPeriodsWithTypes(periodTypes, responseTimeSheet.days);
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
        console.log('RECEIVE NEW PROPS', this.props, nextProps);
    }

    handleChangeDate() {
        console.log('handleChangeDate');
    }

    handelSaveDay = async (date, periods, removed) => {
        console.log('handelSaveDay');
        const { user } = this.props;
        const res = await Resources.Timesheet.saveDay(
            user.usr_id,
            date,
            periods,
            removed);
        console.log(res);
        console.log(date, periods, removed);
    }

    render() {
        const { isAuthenticated, user } = this.props;
        if (!isAuthenticated) return null;

        const activeMonth = Utils.getMomentToday();

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
                                months={Utils.getMonthsForUser(user, Utils.getMomentToday())}
                                onChangeDate={this.handleChangeDate}
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
export const Home = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(HomeContainer),
);
