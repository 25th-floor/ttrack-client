import moment from 'moment';
import { Utils } from '@data';

require('jasmine-check').install();

describe('Utils.getValidMoment', () => {
    describe('getValidMoment', () => {
        it('returns null if timestring is invalid', () => {
            expect(Utils.getValidMoment(21)).toBeNull();
            expect(Utils.getValidMoment('$%^&*')).toBeNull();
            expect(Utils.getValidMoment('asdfghjkl')).toBeNull();
            expect(Utils.getValidMoment('1.500,00')).toBeNull();
            expect(Utils.getValidMoment('1.2.3')).toBeNull();
            expect(Utils.getValidMoment('1,2,3')).toBeNull();
            expect(Utils.getValidMoment('1.2,3')).toBeNull();
            expect(Utils.getValidMoment('1:2,3')).toBeNull();
            expect(Utils.getValidMoment('1.2:3')).toBeNull();
            expect(Utils.getValidMoment('0.,:25')).toBeNull();
            expect(Utils.getValidMoment(`${-21}`)).toBeNull();
        });

        describe('returns the correct moment duration', () => {
            it('is a german float string', () => {
                expect(Utils.getValidMoment('0,25').toJSON()).toEqual(moment.duration(15, 'minutes').toJSON());
                expect(Utils.getValidMoment(',25').toJSON()).toEqual(moment.duration(15, 'minutes').toJSON());
                expect(Utils.getValidMoment('1,5').toJSON()).toEqual(moment.duration(90, 'minutes').toJSON());
                expect(Utils.getValidMoment('23,0').toJSON()).toEqual(moment.duration(1380, 'minutes').toJSON());
            });

            check.it('is a float string', [gen.map(n => n[0] / n[1], gen.array([gen.strictPosInt, gen.strictPosInt]))], (f) => {
                expect(Utils.getValidMoment(`${f}`).toJSON()).toEqual(moment.duration(f * 60, 'minutes').toJSON());
            });

            check.it('is a timestring without leading zero  (:<minutes.)', [gen.strictPosInt], (minutes) => {
                expect(Utils.getValidMoment(`:${minutes}`).toJSON()).toEqual(moment.duration(minutes, 'minutes').toJSON());
            });

            check.it('is a timestring with one leading zero (0:<minutes.)', [gen.strictPosInt], (minutes) => {
                expect(Utils.getValidMoment(`0:${minutes}`).toJSON()).toEqual(moment.duration(minutes, 'minutes').toJSON());
            });

            check.it('is a complete timestring', [gen.strictPosInt, gen.strictPosInt], (hours, minutes) => {
                expect(Utils.getValidMoment(`${hours}:${minutes}`).toJSON()).toEqual(moment.duration((hours * 60) + minutes, 'minutes').toJSON());
            });

            check.it('is just a string number', [gen.strictPosInt], (number) => {
                expect(Utils.getValidMoment(`${number}`).toJSON()).toEqual(moment.duration(number, 'hours').toJSON());
            });
        });

        describe('with negative values', () => {
            it('if the value is -33 it returns valid moment', () => {
                expect(Utils.getValidMoment('-33', true).toJSON()).toEqual(moment.duration(-33, 'hours').toJSON());
            });
            it('if the value is -6:30 it returns valid moment', () => {
                expect(Utils.getValidMoment('-6:30', true).toJSON()).toEqual(moment.duration(-390, 'minutes').toJSON());
            });
            it('if the value is -7:30 it returns valid moment', () => {
                expect(Utils.getValidMoment('-7:30', true).toJSON()).toEqual(moment.duration(-450, 'minutes').toJSON());
            });
            it('if the value is -7,5 it returns valid moment', () => {
                expect(Utils.getValidMoment('-7:30', true).toJSON()).toEqual(moment.duration(-450, 'minutes').toJSON());
            });
            it('if the value is -7.5 it returns valid moment', () => {
                expect(Utils.getValidMoment('-7:30', true).toJSON()).toEqual(moment.duration(-450, 'minutes').toJSON());
            });

            it('returns null if timestring is invalid', () => {
                expect(Utils.getValidMoment(21)).toBeNull();
                expect(Utils.getValidMoment('-$%^&*')).toBeNull();
                expect(Utils.getValidMoment('-asdfghjkl')).toBeNull();
                expect(Utils.getValidMoment('-1.500,00')).toBeNull();
                expect(Utils.getValidMoment('-1.2.3')).toBeNull();
                expect(Utils.getValidMoment('-1,2,3')).toBeNull();
                expect(Utils.getValidMoment('-1.2,3')).toBeNull();
                expect(Utils.getValidMoment('-1:2,3')).toBeNull();
                expect(Utils.getValidMoment('-1.2:3')).toBeNull();
                expect(Utils.getValidMoment('-0.,:25')).toBeNull();
                expect(Utils.getValidMoment(`-${-21}`)).toBeNull();
            });
        });
    });
});
