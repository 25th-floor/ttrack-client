// @flow
import faker from 'faker';
import React, { Component } from 'react';

import styles from './ProfileWidget.module.css';

export type ProfileWidgetProps = {
};

/**
 * ProfileWidget
 */

export class ProfileWidget extends Component {
    props: ProfileWidgetProps;

    render() {
        const { user } = this.props;
        const imgSrc = faker.image.imageUrl();

        return (
            <div id={styles.profileWidget}>
                <div className={styles.image}>
                    <img src={imgSrc} alt="" />
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
