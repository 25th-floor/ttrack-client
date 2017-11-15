// @flow
import React from 'react';
import { Footer } from '@components';

import type { ApiUserType } from '@data/Resources/ResourcesTypes';

import { UserSelection, type SelectFn } from '../UserSelection';
import { Brand } from '../Brand';

// https://github.com/facebookincubator/create-react-app/pull/2285
import styles from './Login.module.css';

export type LoginProps = {
    /**
     * array of ApiUserType to select the user
     */
    users: Array<ApiUserType>,
    /**
     * Function which is called if user is selected
     */
    onUserSelect: SelectFn,
};

/**
 * Login
 */
export const Login = ({ users, onUserSelect }: LoginProps) => (
    <div id="login" className={styles.login}>
        <Brand />
        <UserSelection users={users} onSelect={onUserSelect} />
        <Footer />
    </div>
);

export default Login;
