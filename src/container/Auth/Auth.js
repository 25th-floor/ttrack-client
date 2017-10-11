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
import { Actions } from '@data';

import { Login } from './components/Login';

export type AuthProps = {
    isAuthenticated: boolean,
    login: () => {},
    logout: () => {},
};

const mapStateToProps = ({ isAuthenticated, motto, users, buildInfo }) => ({
    isAuthenticated,
    motto,
    users,
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
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogin = this.handleLogin.bind(this);

        this.renderLogout = this.renderLogout.bind(this);
    }
    componentDidMount() {
        console.log('foo');
    }

    handleLogout = (userId, history) => {
        this.props.logout(userId);
        // history.push('/out');
    }

    handleLogin = (userId, history) => {
        this.props.login(userId);
        // history.push('/login');
    }

    renderLogout(userId, history) {
        return (<button onClick={() => this.handleLogout(userId, history)} >Sign out</button>);
    }

    render() {
        const { motto, users, buildInfo } = this.props;
        const Foo = withRouter(
            ({ history }) => {
                if (this.props.isAuthenticated) {
                    return this.renderLogout(1, history);
                }
                return (<Login
                    motto={motto}
                    users={users}
                    build={buildInfo}
                    onUserSelect={this.handleLogin}
                />);
            },
        );
        return (
            <div>
                <Foo />
            </div>
        );
    }
}

export const Auth = connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
