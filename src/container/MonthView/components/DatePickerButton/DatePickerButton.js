// @flow

import React from 'react';
import { NavLink } from 'react-router-dom';
import classSet from 'class-set';

import styles from './DatePickerButton.module.css';

export type DatePickerButtonProps = {
    /**
     * class name
     */
    className: any,
    /**
     * link string
     */
    link: string,
    /**
     * children
     */
    children: any,
};

/**
 * DatePickerButton
 */
export const DatePickerButton = ({ className, link, children }: DatePickerButtonProps) => {
    const name = classSet(
        'col-xs-1',
        styles.button,
        className,
    );
    return (
        <li className={name} key={link}>
            <NavLink to={link} activeClassName={styles.active}>{children}</NavLink>
        </li>
    );
};


export default DatePickerButton;
