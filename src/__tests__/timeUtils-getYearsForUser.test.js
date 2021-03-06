import moment from 'moment';
import { Utils } from '@data';

describe('Utils.getYearsForUser', () => {
    let user;
    // let today;

    describe('getYearsForUser', () => {
        it('expects a user and today', () => {
            expect(() => Utils.getYearsForUser({ 1: 2 }, 21)).toThrowError('getYearsForUser expects a Today Object!');
        });

        describe('user has no start/enddate', () => {
            beforeEach(() => {
                user = {};
            });

            it('returns all 6 years', () => {
                const yearsForUser = Utils.getYearsForUser(user, moment());
                expect(yearsForUser).not.toHaveLength(0);

                const expectedYears = [];
                for (let i = 0; i < 6; i++) {
                    expectedYears.push(moment().add(1, 'year').subtract(i, 'years').format('YYYY'));
                }
                expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(expectedYears);
            });
        });

        describe('user has start/enddate', () => {
            describe('test with user that has a startDate 2000', () => {
                beforeEach(() => {
                    user = {
                        usr_employment_start: '2000-01-01',
                    };
                });

                it('returns only next year if it is 1999', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('1999-01-01'));
                    expect(yearsForUser).toHaveLength(1);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2000']);
                });

                it('returns only this and next year if it is 2000', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2000-01-01'));
                    expect(yearsForUser).toHaveLength(2);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2001', '2000']);
                });

                it('returns only last, this and next year if it is 2001', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2001-01-01'));
                    expect(yearsForUser).toHaveLength(3);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2002', '2001', '2000']);
                });
            });

            describe('test with user that has a stopDate 2005', () => {
                beforeEach(() => {
                    user = {
                        usr_employment_start: '2000-01-01',
                        usr_employment_stop: '2005-06-01',
                    };
                });

                it('returns 2005 to 2000 if it is 2004', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2004-01-01'));
                    expect(yearsForUser).toHaveLength(6);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2005', '2004', '2003', '2002', '2001', '2000']);
                });

                it('returns only 2005 to 2001 if it is 2005', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2005-01-01'));
                    expect(yearsForUser).toHaveLength(5);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2005', '2004', '2003', '2002', '2001']);
                });

                it('returns only 2005 to 2002 if it is 2006', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2006-01-01'));
                    expect(yearsForUser).toHaveLength(4);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2005', '2004', '2003', '2002']);
                });
            });

            describe('test special case with user that started and stopped in 2005', () => {
                beforeEach(() => {
                    user = {
                        usr_employment_start: '2005-01-01',
                        usr_employment_stop: '2005-06-01',
                    };
                });

                it('returns 2005 if it is 2004', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2004-01-01'));
                    expect(yearsForUser).toHaveLength(1);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2005']);
                });

                it('returns 2005 if it is 2005', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2005-01-01'));
                    expect(yearsForUser).toHaveLength(1);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2005']);
                });

                it('returns 2005 if it is 2006', () => {
                    const yearsForUser = Utils.getYearsForUser(user, moment('2006-01-01'));
                    expect(yearsForUser).toHaveLength(1);
                    expect(yearsForUser.map(date => date.format('YYYY'))).toEqual(['2005']);
                });
            });
        });
    });
});
