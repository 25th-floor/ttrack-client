// @flow
import R from 'ramda';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    withRouter,
    Redirect,
    Route,
} from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { Actions, Resources, Constants, Utils } from '@data';

import { Login } from './components/Login';

export type AuthProps = {
/*     isAuthenticated: boolean,
    login: () => {},
    logout: () => {}, */
};

const { Users } = Resources;
const { mottos } = Constants;

const motto = R.indexOf(
    Utils.getRandomInt(0, R.length(mottos)),
)(mottos);

const mapStateToProps = ({ isAuthenticated, buildInfo }, { history }) => ({
    history,
    isAuthenticated,
    buildInfo,
});

const mapDispatchToProps = dispatch => ({
    login: bindActionCreators(Actions.Auth.login, dispatch),
    logout: bindActionCreators(Actions.Auth.logout, dispatch),
});

/**
 * Auth
 */
export class AuthContainer extends Component {
    props: AuthProps;
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.renderLogout = this.renderLogout.bind(this);
    }
    async componentDidMount() {
        this.setState({
            users: await Users.collection(),
        });
    }

    handleLogout = (user) => {
        this.props.logout(user);
    }

    handleLogin = (user) => {
        this.props.login(user);
        this.props.history.push('/home');
    }

    renderLogout(userId, history) {
        return (<button onClick={() => this.handleLogout(userId, history)} >Sign out</button>);
    }

    render() {
        console.log('redner');
        const { buildInfo, isAuthenticated } = this.props;
        const { users } = this.state;
        return (<Login users={users} onUserSelect={this.handleLogin} />);
    }
}

export const Auth = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AuthContainer),
);