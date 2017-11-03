// @flow
import React from 'react';
import moment from 'moment';
import { Utils } from '@data';

import type { ApiVacationType } from '@data/Resources/ResourcesTypes';

import styles from './Vacation.module.css';

type VacationProps = {
    vacation: ApiVacationType,
};

export const Vacation = ({ vacation }: VacationProps) => {
    const date = moment(vacation.day_date);
    const fullDate = date.format('DD.MM.YYYY');
    const shortDate = date.format('DD.MM');

    const targetTime = Utils.formatDurationHoursToLocale(moment.duration(vacation.day_target_time));
    return (
        <fieldset className={styles.vacation}>
            <dl>
                <dt className="visible-xs">Datum</dt>
                <dd className="hidden-sm col-md-1">{fullDate}</dd>
                <dd className="col-sm-1 visible-sm">{shortDate}</dd>

                <dt className="visible-xs hidden-sm">Sollzeit</dt>
                <dd className="col-sm-1 col-lg-1 hidden-sm">{targetTime}</dd>

                <dt className="visible-xs">User</dt>
                <dd className="col-sm-4 col-md-3 col-lg-2">{vacation.usr_firstname} {vacation.usr_lastname}</dd>

                <dt className="visible-xs">Kommentar</dt>
                <dd className="col-sm-6 col-md-7 col-lg-8">{vacation.per_comment}</dd>
            </dl>
        </fieldset>
    );
};


export default Vacation;
