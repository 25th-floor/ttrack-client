jest.dontMock('../../timeUtils.js');

const moment = require('moment');
const Immutable = require('immutable');

describe('timeUtils.getYearsForUser', function() {
    let timeUtils;
    let user;
    let today;

    beforeEach(function() {
        timeUtils = require('../../timeUtils.js');
    });

    describe('getYearsForUser', function() {
        it('expects a user', function() {
            expect(function() {return timeUtils.getYearsForUser(42)})
                .toThrowError('getYearsForUser expects an Immutable Map Object!');
        });

        it('expects a user and today', function() {
            expect(function() {return timeUtils.getYearsForUser(Immutable.fromJS({1:2}), 21)})
                .toThrowError('getYearsForUser expects a Today Object!');
        });

        describe('user has no start/enddate', function() {
            beforeEach(function() {
                user = Immutable.fromJS({});
            });

            it('returns all 6 years', function() {
                const yearsForUser = timeUtils.getYearsForUser(user, moment());
                expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                    .toEqual(["2017", "2016", "2015", "2014", "2013", "2012"]);
            });

        });

        describe('user has start/enddate', function() {
            describe('test with user that has a startDate 2000', function() {
                beforeEach(function() {
                    user = Immutable.fromJS({
                        usr_employment_start: '2000-01-01',
                    });
                });

                it('returns only next year if it is 1999', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('1999-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2000"]);
                });

                it('returns only this and next year if it is 2000', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2000-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2001", "2000"]);
                });

                it('returns only last, this and next year if it is 2001', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2001-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2002", "2001", "2000"]);
                });

            });

            describe('test with user that has a stopDate 2005', function() {
                beforeEach(function() {
                    user = Immutable.fromJS({
                        usr_employment_start: '2000-01-01',
                        usr_employment_stop: '2005-06-01',
                    });
                });

                it('returns 2005 to 2000 if it is 2004', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2004-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2005", "2004", "2003", "2002", "2001", "2000"]);
                });

                it('returns only 2005 to 2001 if it is 2005', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2005-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2005", "2004", "2003", "2002", "2001"]);
                });

                it('returns only 2005 to 2002 if it is 2006', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2006-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2005", "2004", "2003", "2002"]);
                });

            });

            describe('test special case with user that started and stopped in 2005', function() {
                beforeEach(function() {
                    user = Immutable.fromJS({
                        usr_employment_start: '2005-01-01',
                        usr_employment_stop: '2005-06-01',
                    });
                });

                it('returns 2005 if it is 2004', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2004-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2005"]);
                });

                it('returns 2005 if it is 2005', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2005-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2005"]);
                });

                it('returns 2005 if it is 2006', function() {
                    const yearsForUser = timeUtils.getYearsForUser(user, moment('2006-01-01'));
                    expect(Immutable.List.isList(yearsForUser)).toBeTruthy();
                    expect(yearsForUser.toJSON().map(date => date.substr(0,4)))
                        .toEqual(["2005"]);
                });
            });

        });

    });
});
