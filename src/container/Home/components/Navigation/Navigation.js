// @flow

import React, { Component } from 'react';
import { Motto } from '@components';
import styles from './Navigation.module.css';

import { ProfileWidget } from '../ProfileWidget';

export type NavigationProps = {
    handleLogout: () => {},
    user: any,
};

/**
 * Navigation
 */

export class Navigation extends Component {
    props: NavigationProps;

    render() {
        return (
            <nav className={`navbar navbar-inverse navbar-fixed-top ${styles.navbar}`}>
                <div className={`container-fluid ${styles.container}`}>
                    <div className={`navbar-header ${styles.header}`}>
                        <a className={`navbar-brand ${styles.brand}`} href="/">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                                <path
                                    d="M 100.00,0.00
                                       C 100.00,0.00 100.00,20.00 100.00,20.00
                                         100.00,20.00 80.00,20.00 80.00,20.00
                                         80.00,20.00 80.00,100.00 80.00,100.00
                                         80.00,100.00 60.00,100.00 60.00,100.00
                                         60.00,100.00 60.00,20.00 60.00,20.00
                                         60.00,20.00 40.00,20.00 40.00,20.00
                                         40.00,20.00 40.00,100.00 40.00,100.00
                                         40.00,100.00 20.00,100.00 20.00,100.00
                                         20.00,100.00 20.00,20.00 20.00,20.00
                                         20.00,20.00 0.00,20.00 0.00,20.00
                                         0.00,20.00 0.00,0.00 0.00,0.00
                                         0.00,0.00 100.00,0.00 100.00,0.00 Z"
                                />
                            </svg>
                            <span className={`title ${styles.title}`}>
                                <strong>Time</strong> Tracking
                            </span>

                            <small className={styles['tt-motto']}>
                                <Motto />
                            </small>
                        </a>
                    </div>

                    <ProfileWidget user={this.props.user} />

                    <div className={`navbar-container ${styles['navbar-container']}`}>
                        <ul className={`nav navbar-nav ${styles['navbar-nav']}`}>
                            <li className={`active ${styles.active}`}>
                                <a>
                                    <i className="fa fa-calendar" />
                                    <span>Monatsansicht</span>
                                </a>
                            </li>
                            <li className={`logout ${styles.logout}`}>
                                <a onClick={this.props.handleLogout} href="">
                                    <i className="fa fa-power-off" />
                                    <span>Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
export default Navigation;
// <ProfileWidget activeUser={this.props.activeUser} />
