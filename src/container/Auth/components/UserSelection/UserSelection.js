// @flow
/* eslint-disable jsx-a11y/anchor-is-valid */
import R from 'ramda';
import React, { Component } from 'react';
import { Avatar } from '@components';
import type { UserType } from '@data/Resources/ResourcesTypes';

import styles from './UserSelection.module.css';

export type SelectFn = (user: UserType) => void;
export type UserSelectionProps = {
    users: Array<UserType>,
    onSelect: SelectFn,
};

const SortByLastName = R.sortBy(R.compose(R.toLower, R.prop('usr_lastname')));

/**
 * UserSelection
 */
export class UserSelection extends Component<UserSelectionProps> {
    renderUserItem = (user: UserType, index: number) => {
        const { usr_firstname, usr_lastname } = user;
        return (
            <li key={index} className="col-xs-6 col-sm-3">
                <a onClick={() => this.props.onSelect(user)} href="#" role="button" tabIndex="0">
                    <div className={styles.imageContainer}>
                        <Avatar user={user} />
                    </div>
                    <span>
                        {usr_firstname}
                        <span className={styles.lastname}>
                            {` ${usr_lastname}`}
                        </span>
                    </span>
                </a>
            </li>
        );
    };

    render() {
        const users = SortByLastName(this.props.users);
        return (
            <div className={`container ${styles.userSelection}`}>
                <ul className={`${styles.userlist} row`}>
                    {users.map(this.renderUserItem)}
                </ul>
                <div className="clear" />
            </div>
        );
    }
}

export default UserSelection;

