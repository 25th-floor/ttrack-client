// @flow
// TODO remove a tags
import React from 'react';
import { Motto } from '@components';

import type { ApiUserType } from '@data/Resources';

import { ProfileWidget } from '../ProfileWidget';

import styles from './Navigation.module.css';

type LogoutFn = (user: ApiUserType) => void; // todo
export type NavigationProps = {
    onLogout: LogoutFn,
    user: ApiUserType,
};

/**
 * Navigation
 */
export const Navigation = ({ user, onLogout }: NavigationProps) => (
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

            <ProfileWidget user={user} />

            <div className={`navbar-container ${styles['navbar-container']}`}>
                <ul className={`nav navbar-nav ${styles['navbar-nav']}`}>
                    <li className={`active ${styles.active}`}>
                        <a href="/#">
                            <i className="fa fa-calendar" />
                            <span>Monatsansicht</span>
                        </a>
                    </li>
                    <li className={`logout ${styles.logout}`}>
                        <a onClick={onLogout} href="/#">
                            <i className="fa fa-power-off" />
                            <span>Logout</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);
