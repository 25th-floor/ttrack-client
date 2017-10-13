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

export class HomeContainer extends Component {
    componentDidMount() {
        console.log(this);
        const { user } = this.props;
        const a = Utils.getYearsForUser(
            user,
            Utils.getMomentToday(),
        );
        console.log(this.props);
        /*         const c = Utils.getMonthsForUser(user, Utils.getMomentToday());
        const found = Utils.getNearestDateWithinEmployment(Utils.getMomentToday(), user);

        console.log(found); */
        // console.log(a.map(b => b.format('YYYY')));
        // console.log(c.map(d => d.format('MM')));
        // Resources.Timesheet.getTimesheetFromUser()
    }

    handleLogout = (user) => {
        this.props.logout(user);
    }

    handleChangeDate() {
        console.log('handleChangeDate');
    }

    handelSaveDay() {
        console.log('handelSaveDay');
    }

    render() {
        const { isAuthenticated, user, weeks, types } = this.props;
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
                <Footer />
            </div>
        );
    }
}

/* <Weeks
weeks={weeks}
activeMonth={activeMonth}
types={types}
user={user}
onSaveDay={this.onSaveDay}
/> */

//    <Footer />
export const Home = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(HomeContainer),
);
