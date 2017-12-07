// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Resources, type AppState } from '@data';
import { Page } from '@components';

import type { ApiVacationsType } from '@data/Resources/ResourcesTypes';

import { Vacation } from './components/Vacation';

import styles from './VacationsOverview.module.css';

const mapStateToProps = ({ auth }: AppState, { history }) => ({
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    history,
});

const mapDispatchToProps = () => ({});

export type VacationOverviewProps = {
    isAuthenticated: boolean,

    // eslint-disable-next-line react/no-unused-prop-types
    match: any, // todo router
};

type State = {
    vacations: ApiVacationsType,
    start: number,
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
        const start = this.state.vacations.vacations.length;
        const vacations: ApiVacationsType = await Resources.Vacations.collection(start);

        await this.setState({
            vacations: {
                vacations: [...this.state.vacations.vacations, ...vacations.vacations],
                // eslint-disable-next-line no-underscore-dangle
                _meta: vacations._meta,
            },
        });
    };

    render() {
        const { isAuthenticated } = this.props;
        if (!isAuthenticated) return null;

        const { _meta } = this.state.vacations;
        let showMore = true;
        if (_meta !== undefined) {
            const { total, start, count } = _meta;
            if (start + count >= total) {
                showMore = false;
            }
        }
        return (
            <Page>
                <fieldset className={`hidden-xs ${styles.header}`}>
                    <dl>
                        <dt className="col-sm-2 col-md-1">Datum</dt>
                        <dt className="hidden-sm hidden-md col-lg-1">Sollzeit</dt>
                        <dt className="hidden-sm hidden-md col-lg-1">Dauer</dt>
                        <dt className="col-sm-1">Prozent</dt>
                        <dt className="col-sm-4 col-md-3 col-lg-2">User</dt>
                        <dt className="col-sm-5 col-md-7 col-lg-6">Kommentar</dt>
                    </dl>
                </fieldset>
                {this.state.vacations.vacations.map((vacation, index) => <Vacation vacation={vacation} key={index} />)}
                {showMore && (<button onClick={this.loadVacancies}>load more</button>) }
            </Page>
        );
    }
}

export const VacationsOverview = withRouter(connect(mapStateToProps, mapDispatchToProps)(VacationsOverviewContainer));
