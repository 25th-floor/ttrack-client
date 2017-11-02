// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Resources } from '@data';
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

const Vacation = ({ vacation }: VacationProps) => (
    <div>
        {vacation.usr_firstname}
    </div>
);

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
                    Vacancy
                </div>
                {this.state.vacations.vacations.map((vacation, index) => <Vacation vacation={vacation} key={index} />)}
                <Footer />
            </div>
        );
    }
}

export const VacationsOverview = withRouter(connect(mapStateToProps, mapDispatchToProps)(VacationsOverviewContainer));
