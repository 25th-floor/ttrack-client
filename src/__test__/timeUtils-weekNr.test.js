import moment from 'moment';
import { Utils } from '@data';

describe('Utils.weekNr', () => {
    describe('weekNr', () => {
        describe('test week is still in old year returns 2015-53', () => {
            it('for 2016-01-01', () => {
                expect(Utils.weekNr(moment('2016-01-01'))).toEqual('2015-53');
            });

            it('for 2015-12-30', () => {
                expect(Utils.weekNr(moment('2015-12-30'))).toEqual('2015-53');
            });
        });

        describe('test week is already in new year returns 2015-01', () => {
            it('for 2015-01-01', () => {
                expect(Utils.weekNr(moment('2015-01-01'))).toEqual('2015-01');
            });

            it('for 2014-12-30', () => {
                expect(Utils.weekNr(moment('2014-12-30'))).toEqual('2015-01');
            });
        });
    });
});
