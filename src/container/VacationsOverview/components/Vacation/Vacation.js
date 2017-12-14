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

    const targetDuration = moment.duration(vacation.day_target_time);
    const periodDuration = moment.duration(vacation.per_duration);
    const percentage = Math.round((periodDuration.asMinutes() / targetDuration.asMinutes()) * 100);

    const targetTime = Utils.formatDurationHoursToLocale(targetDuration);
    const duration = Utils.formatDurationHoursToLocale(periodDuration);
    return (
        <fieldset className={styles.vacation}>
            <dl>
                <dt className="visible-xs">Datum</dt>
                <dd className="hidden-sm col-md-1">{fullDate}</dd>
                <dd className="col-sm-1 visible-sm">{shortDate}</dd>

                <dt className="visible-xs">Sollzeit</dt>
                <dd className="hidden-sm hidden-md col-lg-1">{targetTime}</dd>

                <dt className="visible-xs">Dauer</dt>
                <dd className="hidden-sm hidden-md col-lg-1">{duration}</dd>

                <dt className="visible-xs">Prozent</dt>
                <dd className="col-sm-1">{percentage} %</dd>

                <dt className="visible-xs">User</dt>
                <dd className="col-sm-4 col-md-3 col-lg-2">{vacation.usr_firstname} {vacation.usr_lastname}</dd>

                <dt className="visible-xs">Kommentar</dt>
                <dd className="col-sm-5 col-md-7 col-lg-6">{vacation.per_comment}</dd>
            </dl>
        </fieldset>
    );
};


export default Vacation;
