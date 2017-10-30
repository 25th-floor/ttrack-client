import { AuthReducer as reducer } from '@data/Auth/AuthReducer';

describe('Authentication reducer', () => {
    // const initialState = { };

    it('should be imported', () => {
        expect(reducer).not.toBe(undefined);
    });

/*     xit('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    }); */
});
