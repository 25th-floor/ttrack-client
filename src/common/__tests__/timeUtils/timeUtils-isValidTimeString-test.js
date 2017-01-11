jest.dontMock('../../timeUtils.js');

describe('timeUtils.isValidTimeString', function() {
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
            for(var negative in [false, true]) {
                var description = negative ? 'negative values allowed' : 'only positive values allowed';
                var prefix = negative ? '-' : '';
                describe(description, function() {
                    it(`if there are only digits (${prefix}2)`, function() {
                        expect(timeUtils.isValidTimeString(`${prefix}2`, true, negative)).toBeTruthy();
                    });

                    it('if there it is a german floor number', function() {
                        expect(timeUtils.isValidTimeString(`${prefix}2,13`, true, negative)).toBeTruthy();
                    });

                    it('if there it is a german floor number with only fractions', function() {
                        expect(timeUtils.isValidTimeString(`${prefix},13`, true, negative)).toBeTruthy();
                    });

                    it('if there it is a floor number', function() {
                        expect(timeUtils.isValidTimeString(`${prefix}2.13`, true, negative)).toBeTruthy();
                    });

                    it('if there it is a floor fraction number', function() {
                        expect(timeUtils.isValidTimeString(`${prefix}.13`, true, negative)).toBeTruthy();
                    });

                    it('if it is a timestring', function() {
                        expect(timeUtils.isValidTimeString(`${prefix}02:15`, true, negative)).toBeTruthy();
                    });

                    it('if it is a timestring with one leading zero', function() {
                        expect(timeUtils.isValidTimeString(`${prefix}0:15`, true, negative)).toBeTruthy();
                    });

                    it('if it is a timestring with only minutes', function() {
                        expect(timeUtils.isValidTimeString(`${prefix}:15`, true, negative)).toBeTruthy();
                    });
                });

            }
        });

        describe('special cases', function() {
            it('if the value is -33 it returns true', function() {
                expect(timeUtils.isValidTimeString('-33', true, true)).toBeTruthy();
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
