import { Utils } from '@data';

require('jasmine-check').install();

describe('Utils', () => {
    describe('validatePeriod', () => {
        it('returns false if period is invalid', () => {
            expect(Utils.validatePeriod(null)).toBeFalsy();
            expect(Utils.validatePeriod(false)).toBeFalsy();
            expect(Utils.validatePeriod(true)).toBeFalsy();
            expect(Utils.validatePeriod({})).toBeFalsy();
        });

        it('returns false if there is no duration and no starttime', () => {
            expect(Utils.validatePeriod([])).toBeFalsy();
        });

        it('returns false if duration is unknown and no starttime', () => {
            expect(Utils.validatePeriod({ duration: 'foo' })).toBeFalsy();
        });

        it('returns true if duration is Full day', () => {
            expect(Utils.validatePeriod({ duration: Utils.FULLDAY })).toBeTruthy();
        });

        it('returns true if duration is half day', () => {
            expect(Utils.validatePeriod({ duration: Utils.HALFDAY })).toBeTruthy();
        });

        it('returns false if duration is none but the config does not allow it', () => {
            expect(Utils.validatePeriod({ duration: Utils.NONE })).toBeFalsy();
            expect(Utils.validatePeriod({
                duration: Utils.NONE,
                type: {
                    pty_config: {
                        types: {
                            fullday: true,
                        },
                    },
                },
            })).toBeFalsy();
        });

        xit('returns true if duration is none and the config allows it', () => {
            expect(Utils.validatePeriod({
                duration: Utils.NONE,
                type: { pty_config: { types: { period: false, fullday: false, halfday: false } } },
            })).toBeTruthy();
        });

        xit('returns true if there is a starttime', () => {
            expect(Utils.validatePeriod({ per_start: { hours: 8, minutes: 45 } })).toBeTruthy();
        });

        xit('returns true if there is a starttime, but it does not check if starttime is valid', () => {
            expect(Utils.validatePeriod({ per_start: { foo: 42 } })).toBeTruthy();
        });

        describe('if there is an endtime', () => {
            it('returns false if endtime is before starttime', () => {
                expect(Utils.validatePeriod({
                    per_start: { hours: 8, minutes: 45 },
                    per_stop: { hours: 8 },
                })).toBeFalsy();
            });

            xit('returns true if endtime is after starttime', () => {
                expect(Utils.validatePeriod({
                    per_start: { hours: 8, minutes: 45 },
                    per_stop: { hours: 9 },
                })).toBeTruthy();
            });

            it('returns false if there is a breaktime and it is invalid', () => {
                expect(Utils.validatePeriod({
                    per_start: { hours: 8 },
                    per_stop: { hours: 9 },
                    per_break: { hours: 2 },
                })).toBeFalsy();
            });

            xit('returns true if there is a breaktime and it valid', () => {
                expect(Utils.validatePeriod({
                    per_start: { hours: 8 },
                    per_stop: { hours: 9 },
                    per_break: { minutes: 30 },
                })).toBeTruthy();
            });
        });
    });
});
