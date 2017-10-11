// @flow
import React, { Component } from 'react';
import { Footer, Motto } from '@components';

import { UserSelection } from '../UserSelection';
import { Brand } from '../Brand';

// https://github.com/facebookincubator/create-react-app/pull/2285
import styles from './Login.module.css';

export type LoginProps = {
    users: any,
    onUserSelect: ()=>{},
};

/**
 * Login
 */
export class Login extends Component {
    props: LoginProps;
    render() {
        const { users, onUserSelect } = this.props;
        return (<div id="login" className={styles.login}>
            <Brand />
            <UserSelection users={users} onSelect={onUserSelect} />
            <Footer />
        </div>
        );
    }
}
