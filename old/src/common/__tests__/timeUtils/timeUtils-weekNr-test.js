jest.dontMock('../../timeUtils.js');

var moment = require('moment');

describe('timeUtils.weekNr', function() {
    var timeUtils;

    beforeEach(function() {
        timeUtils = require('../../timeUtils.js');
    });

    describe('weekNr', function() {

        describe('test week is still in old year returns 2015-53', function() {
            it('for 2016-01-01', function() {
                expect(timeUtils.weekNr(moment('2016-01-01'))).toEqual('2015-53');
            });

            it('for 2015-12-30', function() {
                expect(timeUtils.weekNr(moment('2015-12-30'))).toEqual('2015-53');
            });

        });

        describe('test week is already in new year returns 2015-01', function() {
            it('for 2015-01-01', function() {
                expect(timeUtils.weekNr(moment('2015-01-01'))).toEqual('2015-01');
            });

            it('for 2014-12-30', function() {
                expect(timeUtils.weekNr(moment('2014-12-30'))).toEqual('2015-01');
            });

        });
    });

});
