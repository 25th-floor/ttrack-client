// @flow
import React, { Component } from 'react';
import { Avatar } from '@components';

import type { UserType } from '@data/Resources';

import styles from './ProfileWidget.module.css';

export type ProfileWidgetProps = {
    user: UserType,
};

/**
 * ProfileWidget
 */

export class ProfileWidget extends Component {
    props: ProfileWidgetProps;

    render() {
        const { user } = this.props;
        return (
            <div id={styles.profileWidget}>
                <div className={styles.image}>
                    <Avatar user={user} />
                </div>
                <div className={styles.name}>
                    <span className="firstname">{user.usr_firstname} </span>
                    <span className="lastname">{user.usr_lastname}</span>
                </div>
            </div>
        );
    }
}

export default ProfileWidget;
