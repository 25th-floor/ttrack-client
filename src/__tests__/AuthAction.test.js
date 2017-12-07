import { Actions } from '@data';
import actionTypes from '@data/Auth/AuthTypes';

describe('Authentifiction actions', () => {
    it('should login user', () => {
        const user = {};
        const expectedAction = {
            type: actionTypes.LOGIN,
            user,
        };
        expect(Actions.Auth.login(user)).toEqual(expectedAction);
    });

    it('should logout user', () => {
        const user = {};
        const expectedAction = {
            type: actionTypes.LOGOUT,
            user,
        };
        expect(Actions.Auth.logout(user)).toEqual(expectedAction);
    });
});
