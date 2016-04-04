jest.dontMock('../../timeUtils.js');

describe('timeUtils', function() {
    var timeUtils;
    var strict;

    beforeEach(function() {
        timeUtils = require('../../timeUtils.js');
    });

    describe('isValidTimeString', function() {
        it('expects a string', function() {
            expect(timeUtils.isValidTimeString(42)).toBeFalsy();
        });

        describe('in strict mode', function() {
            beforeEach(function() {
                strict = true;
            });

            it('returns false in case of empty string', function() {
                expect(timeUtils.isValidTimeString('', strict)).toBeFalsy();
            });

        });

        describe('in non strict mode', function() {
            beforeEach(function() {
                strict = false;
            });

            it('returns true in case of empty string', function() {
                expect(timeUtils.isValidTimeString('', strict)).toBeTruthy();
            });

        });

        describe('it returns true', function() {
            it('if there are only digits', function() {
                expect(timeUtils.isValidTimeString('2')).toBeTruthy();
            });

            it('if there it is a german floor number', function() {
                expect(timeUtils.isValidTimeString('2,13')).toBeTruthy();
            });

            it('if there it is a german floor number with only fractions', function() {
                expect(timeUtils.isValidTimeString(',13')).toBeTruthy();
            });

            it('if there it is a floor number', function() {
                expect(timeUtils.isValidTimeString('2.13')).toBeTruthy();
            });

            it('if there it is a floor fraction number', function() {
                expect(timeUtils.isValidTimeString('.13')).toBeTruthy();
            });

            it('if it is a timestring', function() {
                expect(timeUtils.isValidTimeString('02:15')).toBeTruthy();
            });

            it('if it is a timestring with one leading zero', function() {
                expect(timeUtils.isValidTimeString('0:15')).toBeTruthy();
            });

            it('if it is a timestring with only minutes', function() {
                expect(timeUtils.isValidTimeString(':15')).toBeTruthy();
            });
        });

        describe('it returns false', function() {
            it('if there are only chars', function() {
                expect(timeUtils.isValidTimeString('abc')).toBeFalsy();
            });

            it('if there are only special chars', function() {
                expect(timeUtils.isValidTimeString('@#$%^&')).toBeFalsy();
            });

            it('if there is at least one chars', function() {
                expect(timeUtils.isValidTimeString('21a1')).toBeFalsy();
            });

            it('if there is at least one special chars', function() {
                expect(timeUtils.isValidTimeString('21%1')).toBeFalsy();
            });

        });
    });
});
