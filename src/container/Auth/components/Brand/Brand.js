import React from 'react';
import { Motto } from '@components';

import styles from './Brand.module.css';

/**
 * Brand
 */
export const Brand = ({ motto }) => (
    <div className={styles.loginBrand}>
        <svg viewBox="0 0 100 100">
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
        <span className={styles.title}>
            <strong>Time</strong> Tracking
        </span>

        <small className={styles['tt-motto']}>
            <Motto />
        </small>
    </div>
);
