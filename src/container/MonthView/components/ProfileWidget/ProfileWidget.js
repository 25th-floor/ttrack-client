// @flow
import React from 'react';
import { Avatar } from '@components';

import type { ApiUserType } from '@data/Resources';

import styles from './ProfileWidget.module.css';

export type ProfileWidgetProps = {
    user: ApiUserType,
};

/**
 * ProfileWidget
 */
export const ProfileWidget = ({ user }: ProfileWidgetProps) => (
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

export default ProfileWidget;
