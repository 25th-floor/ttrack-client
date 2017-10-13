// @flow
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
        return (
            <div id={styles.profileWidget}>
                <div className={styles.image}>
                    <img src={'/16.jpg'} alt="" />
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
