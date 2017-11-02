// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

import { Resources, Utils } from '@data';
import { Footer } from '@components';

import type { ApiVacationsType, ApiVacationType } from '@data/Resources/ResourcesTypes';
import type { AuthState } from '@data/Auth/AuthTypes';

// import { Navigation } from './components/Navigation';

import styles from './VacationsOverview.module.css';

const mapStateToProps = ({ isAuthenticated, user }: AuthState, { history }) => ({
    isAuthenticated,
    user,
    history,
});

const mapDispatchToProps = () => ({});

type VacationProps = {
    vacation: ApiVacationType,
};

const Vacation = ({ vacation }: VacationProps) => {
    const date = moment(vacation.day_date);
    const fullDate = date.format('DD.MM.YYYY');
    const shortDate = date.format('DD.MM');

    const targetTime = Utils.formatDurationHoursToLocale(moment.duration(vacation.day_target_time));
    return (
        <fieldset className="">
            <dl>
                <dt className="visible-xs">Datum</dt>
                <dd className="hidden-sm col-md-1">{fullDate}</dd>
                <dd className="col-sm-1 visible-sm">{shortDate}</dd>

                <dt className="visible-xs hidden-sm">Sollzeit</dt>
                <dd className="col-sm-1 col-lg-1 hidden-sm">{targetTime}</dd>

                <dt className="visible-xs">User</dt>
                <dd className="col-sm-4 col-md-3 col-lg-2">{vacation.usr_firstname} {vacation.usr_lastname}</dd>

                <dt className="visible-xs">Kommentar</dt>
                <dd className="col-sm-6 col-md-7 col-lg-8">{vacation.per_comment}</dd>
            </dl>
        </fieldset>
    );
};

export type VacationOverviewProps = {
    isAuthenticated: boolean,

    // eslint-disable-next-line react/no-unused-prop-types
    match: any, // todo router
};

type State = {
    vacations: ApiVacationsType,
};

export class VacationsOverviewContainer extends Component<VacationOverviewProps, State> {
    state = {
        vacations: {
            vacations: [],
        },
    };

    componentDidMount() {
        this.loadVacancies();
    }

    loadVacancies = async () => {
        const vacations = await Resources.Vacations.collection();

        await this.setState({
            vacations,
        });
    };

    render() {
        const { isAuthenticated } = this.props;
        if (!isAuthenticated) return null;
        return (
            <div className={styles['site-container']}>
                <div className="container-fluid">
                    <fieldset className="hidden-xs">
                        <dl>
                            <dt className="col-sm-2 col-md-1">Datum</dt>
                            <dt className="hidden-sm col-sm-1">Sollzeit</dt>
                            <dt className="col-sm-4 col-md-3 col-lg-2">User</dt>
                            <dt className="col-sm-6 col-md-7 col-lg-8">Kommentar</dt>
                        </dl>
                    </fieldset>
                </div>
                {this.state.vacations.vacations.map((vacation, index) => <Vacation vacation={vacation} key={index} />)}
                <Footer />
            </div>
        );
    }
}

export const VacationsOverview = withRouter(connect(mapStateToProps, mapDispatchToProps)(VacationsOverviewContainer));
