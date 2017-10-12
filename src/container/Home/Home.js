import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Utils } from '@data';
import { Footer } from '@components';

import { Navigation } from './components/Navigation';
import { DatePicker } from './components/DatePicker';

import styles from './Home.module.css';

const mapStateToProps = ({ isAuthenticated, user }) => ({
    isAuthenticated,
    user,
});

export class HomeContainer extends Component {
    handleChangeDate() {
        console.log('handleChangeDate');
    }

    render() {
        const { isAuthenticated, user } = this.props;
        if (!isAuthenticated) return null;
        return (
            <div className={styles['site-container']}>
                <div className="container-fluid">
                    <Navigation user={user} />
                    <div className={styles.pageHeader}>
                        <h1 className="hidden-lg hidden-md hidden-sm hidden-xs">Monats Ansicht</h1>
                        <DatePicker
                            activeMonth={Utils.getMomentToday()}
                            years={Utils.getYearsForUser(user, Utils.getMomentToday())}
                            months={Utils.getMonthsForUser(user, Utils.getMomentToday())}
                            onChangeDate={this.handleChangeDate}
                        />
                        <div className="clearfix" />
                    </div>

                    <fieldset className={`${styles.monthHeader} hide`}>
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
        );
    }
}

//    <Footer />
export const Home = connect(mapStateToProps, null)(HomeContainer);
