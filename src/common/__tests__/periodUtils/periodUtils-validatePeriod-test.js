jest.dontMock('../../periodUtils.js');

import Immutable from 'immutable';

require('jasmine-check').install();

describe('periodUtils', function() {
    let periodUtils;

    beforeEach(function() {
        periodUtils = require('../../periodUtils.js');
    });

    describe('validatePeriod', function() {
        it('returns false if period is invalid', function() {
            expect(periodUtils.validatePeriod(null)).toBeFalsy();
            expect(periodUtils.validatePeriod(false)).toBeFalsy();
            expect(periodUtils.validatePeriod(true)).toBeFalsy();
            expect(periodUtils.validatePeriod({})).toBeFalsy();
        });

        it('returns false if there is no duration and no starttime', function() {
            expect(periodUtils.validatePeriod(Immutable.Map([]))).toBeFalsy();
        });

        it('returns false if duration is unknown and no starttime', function() {
            expect(periodUtils.validatePeriod(Immutable.Map({duration: 'foo'}))).toBeFalsy();
        });

        it('returns true if duration is Full day', function() {
            expect(periodUtils.validatePeriod(Immutable.Map({duration: periodUtils.FULLDAY}))).toBeTruthy();
        });

        it('returns true if duration is half day', function() {
            expect(periodUtils.validatePeriod(Immutable.Map({duration: periodUtils.HALFDAY}))).toBeTruthy();
        });

        it('returns false if duration is none but the config does not allow it', function() {
            expect(periodUtils.validatePeriod(Immutable.Map({duration: periodUtils.NONE}))).toBeFalsy();
            expect(periodUtils.validatePeriod(
                Immutable.Map(Immutable.fromJS({duration: periodUtils.NONE, type: { pty_config: { types: {fullday: true} }}})))
            ).toBeFalsy();
        });

        it('returns true if duration is none and the config allows it', function() {
            expect(periodUtils.validatePeriod(
                Immutable.Map(Immutable.fromJS({duration: periodUtils.NONE, type: { pty_config: { types: {period: false, fullday: false, halfday: false} }}})))
            ).toBeTruthy();
        });

        it('returns true if there is a starttime', function() {
            expect(periodUtils.validatePeriod(
                Immutable.Map(Immutable.fromJS({per_start: {hours: 8, minutes: 45}})))
            ).toBeTruthy();
        });

        it('returns true if there is a starttime, but it does not check if starttime is valid', function() {
            expect(periodUtils.validatePeriod(
                Immutable.Map(Immutable.fromJS({per_start: {foo: 42}})))
            ).toBeTruthy();
        });

        describe('if there is an endtime', function() {
            it('returns false if endtime is before starttime', function() {
                expect(periodUtils.validatePeriod(
                    Immutable.Map(Immutable.fromJS({
                        per_start: {hours: 8, minutes: 45},
                        per_stop: {hours: 8},
                    })))
                ).toBeFalsy();
            });

            it('returns true if endtime is after starttime', function() {
                expect(periodUtils.validatePeriod(
                    Immutable.Map(Immutable.fromJS({
                        per_start: {hours: 8, minutes: 45},
                        per_stop: {hours: 9},
                    })))
                ).toBeTruthy();
            });

            it('returns false if there is a breaktime and it is invalid', function() {
                expect(periodUtils.validatePeriod(
                    Immutable.Map(Immutable.fromJS({
                        per_start: {hours: 8},
                        per_stop: {hours: 9},
                        per_break: {hours: 2},
                    })))
                ).toBeFalsy();
            });

            it('returns true if there is a breaktime and it valid', function() {
                expect(periodUtils.validatePeriod(
                    Immutable.Map(Immutable.fromJS({
                        per_start: {hours: 8},
                        per_stop: {hours: 9},
                        per_break: {minutes: 30},
                    })))
                ).toBeTruthy();
            });

        });
    });
});
