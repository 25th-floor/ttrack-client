// @flow
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

type UserProps = {
    user: UserType,
    index: number,
    onSelect: SelectFn,
};

export const User = (props: UserProps) => (
    <li key={props.index} className={`${styles.user} col-xs-6 col-sm-3`}>
        <button onClick={() => props.onSelect(props.user)} className={`${styles.userButton}`}>
            <div className={styles.imageContainer}>
                <Avatar user={props.user} />
            </div>
            <span>
                {props.user.usr_firstname}
                <span className={styles.lastname}>
                    {` ${props.user.usr_lastname}`}
                </span>
            </span>
        </button>
    </li>
);

/**
 * UserSelection
 */
export class UserSelection extends Component<UserSelectionProps> {
    render() {
        const users = SortByLastName(this.props.users);
        return (
            <div className="container">
                <ul className={`${styles.userlist} row`}>
                    {users.map((user, index) => (
                        <User user={user} index={index} key={index} onSelect={this.props.onSelect} />
                    ))}
                </ul>
                <div className="clear" />
            </div>
        );
    }
}
