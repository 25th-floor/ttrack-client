// @flow

import React from 'react';

import styles from './DatePickerContainer.module.css';

export type DatePickerContainerProps = {
    /**
     * title of the container
     */
    title: string,
    /**
     * children
     */
    children: any,
};

/**
 * DatePickerContainer
 */
export const DatePickerContainer = ({ title, children }: DatePickerContainerProps) => (
    <div className={styles.container} key={title}>
        <h2>{title}</h2>
        <ul>
            {children}
        </ul>
    </div>
);

export default DatePickerContainer;
