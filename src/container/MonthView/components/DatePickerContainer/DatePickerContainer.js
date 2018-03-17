// @flow

import React from 'react';
import classSet from 'class-set';

import styles from './DatePickerContainer.module.css';

export type DatePickerContainerProps = {
    /**
     * class name
     */
    className?: any,
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
export const DatePickerContainer = ({ className, title, children }: DatePickerContainerProps) => {
    const name = classSet(
        styles.container,
        className,
    );

    return (
        <div className={name} key={title}>
            <h2>{title}</h2>
            <ul>
                {children}
            </ul>
        </div>
    );
};

export default DatePickerContainer;
