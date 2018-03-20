// @flow
import React from 'react';
import { Brand, Footer } from '@components';

import type { ApiUserType } from '@data/Resources/ResourcesTypes';

import { UserSelection, type SelectFn } from '../UserSelection';

// https://github.com/facebookincubator/create-react-app/pull/2285
import styles from './Login.module.css';
import './Login.css';

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
        <div className="loginBrand">
            <Brand />
        </div>
        <UserSelection users={users} onSelect={onUserSelect} />
        <Footer />
    </div>
);

export default Login;
