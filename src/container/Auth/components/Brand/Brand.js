import React from 'react';
import { Motto, TTLogo } from '@components';

import styles from './Brand.module.css';

/**
 * Brand
 */
export const Brand = () => (
    <div className={styles.loginBrand}>
        <TTLogo />
        <span className={styles.title}>
            <strong>Time</strong> Tracking
        </span>

        <small className={styles.motto}>
            <Motto />
        </small>
    </div>
);

export default Brand;
