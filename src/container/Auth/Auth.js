// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import { Actions, Resources } from '@data';
import type { UserType } from '@data/Resources/ResourcesTypes';
import typeof { login } from '@data/Auth/AuthAction';

import { Login } from './components/Login';

export type AuthProps = {
    login: login,
    history: any,
};

const { Users } = Resources;

const mapStateToProps = (_, { history }) => ({
    history,
});

const mapDispatchToProps = dispatch => ({
    login: bindActionCreators(Actions.Auth.login, dispatch),
});

type State = {
    users: Array<UserType>,
};

/**
 * Auth
 */
export class AuthContainer extends Component<AuthProps, State> {
    state = {
        users: [],
    };

    loadUsers = async () => {
        this.setState({
            users: await Users.collection(),
        });
    };

    componentDidMount() {
        this.loadUsers();
    }

    handleLogin = (user: UserType) => {
        this.props.login(user);
        this.props.history.push('/home');
    };

    render() {
        const { users } = this.state;
        return (<Login users={users} onUserSelect={this.handleLogin} />);
    }
}

export const Auth = withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthContainer));
