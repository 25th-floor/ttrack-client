// @flow
import React, { Component } from 'react';
import { Footer, Motto } from '@components';

import { UserSelection } from '../UserSelection';
import { Brand } from '../Brand';

import styles from './Login.css';

export type LoginProps = {
    users: any,
    motto: any,
    onUserSelect: ()=>{},
    build: any,
};

/**
 * Login
 */
export class Login extends Component {
    props: LoginProps;

    render() {
        const { motto, users, onUserSelect, build } = this.props;
        return (<div id="login" className={styles.login}>
            <Brand motto={motto} />
            <UserSelection users={users} onSelect={onUserSelect} />
            <Footer build={build} />
        </div>
        );
    }
}
//            <UserSelection users={users} onSelect={onUserSelect} />
export default Login;
