import R from 'ramda';
import moment from 'moment';
import { Utils } from '@data';
import periodTypes from './periodtypes';

const createDay = index => ({
    day_id: null,
    day_date: moment({ day: index, month: 1, year: 2001 }),
    day_usr_id: 1,
    day_target_time: {},
    periods: [],
    remaining: {
        hours: 0,
        minutes: 0,
    },
});

describe('createWeeks', () => {
    const timesheet = R.range(0, 20).map(createDay);
    it('should create ', () => {
        const days = Utils.assocPeriodsWithTypes(periodTypes, timesheet);
        const carryTime = {
            hours: 11,
            minutes: 54,
        };

        const weeks = Utils.createWeeks(
            days,
            carryTime,
        );

        expect(R.keys(weeks)).toEqual(['2001-05', '2001-06', '2001-07', '2001-08']);
    });
});
