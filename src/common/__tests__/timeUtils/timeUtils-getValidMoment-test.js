jest.dontMock('../../timeUtils.js');

var moment = require('moment');

require('jasmine-check').install();

describe('timeUtils.getValidMoment', function() {
    var timeUtils;

    beforeEach(function() {
        timeUtils = require('../../timeUtils.js');
    });

    describe('getValidMoment', function() {
        it('returns null if timestring is invalid', function() {
            expect(timeUtils.getValidMoment(21)).toBeNull();
            expect(timeUtils.getValidMoment('$%^&*')).toBeNull();
            expect(timeUtils.getValidMoment('asdfghjkl')).toBeNull();
            expect(timeUtils.getValidMoment('1.500,00')).toBeNull();
            expect(timeUtils.getValidMoment('1.2.3')).toBeNull();
            expect(timeUtils.getValidMoment('1,2,3')).toBeNull();
            expect(timeUtils.getValidMoment('1.2,3')).toBeNull();
            expect(timeUtils.getValidMoment('1:2,3')).toBeNull();
            expect(timeUtils.getValidMoment('1.2:3')).toBeNull();
            expect(timeUtils.getValidMoment('0.,:25')).toBeNull();
            expect(timeUtils.getValidMoment("" + -21)).toBeNull();
        });

        describe('returns the correct moment duration', function() {
            it('is a german float string', function() {
                expect(timeUtils.getValidMoment('0,25').toJSON()).toEqual(moment.duration(15, 'minutes').toJSON());
                expect(timeUtils.getValidMoment(',25').toJSON()).toEqual(moment.duration(15, 'minutes').toJSON());
                expect(timeUtils.getValidMoment('1,5').toJSON()).toEqual(moment.duration(90, 'minutes').toJSON());
                expect(timeUtils.getValidMoment('23,0').toJSON()).toEqual(moment.duration(1380, 'minutes').toJSON());
            });

            check.it('is a float string', [gen.map((n) => n[0]/n[1], gen.array([gen.strictPosInt, gen.strictPosInt]))], function (f) {
                expect(timeUtils.getValidMoment("" + f).toJSON()).toEqual(moment.duration(f*60, "minutes").toJSON());
            });

            check.it('is a timestring without leading zero  (:<minutes.)', [gen.strictPosInt], function (minutes) {
                expect(timeUtils.getValidMoment(":" + minutes).toJSON()).toEqual(moment.duration(minutes, "minutes").toJSON());
            });

            check.it('is a timestring with one leading zero (0:<minutes.)', [gen.strictPosInt], function (minutes) {
                expect(timeUtils.getValidMoment("0:" + minutes).toJSON()).toEqual(moment.duration(minutes, "minutes").toJSON());
            });

            check.it('is a complete timestring', [gen.strictPosInt,gen.strictPosInt], function (hours, minutes) {
                expect(timeUtils.getValidMoment("" + hours + ":" + minutes).toJSON()).toEqual(moment.duration(hours*60 + minutes, "minutes").toJSON());
            });

            check.it('is just a string number', [gen.strictPosInt], function (number) {
                expect(timeUtils.getValidMoment("" + number).toJSON()).toEqual(moment.duration(number, "hours").toJSON());
            });
        });
    });

});
