import React from 'react';
import { Footer } from '@components';
import { shallow } from 'enzyme';

import { Login } from './Login';
import { UserSelection } from '../UserSelection';
import { Brand } from '../Brand';

import styles from './Login.module.css';

describe('<Login />', () => {
    const component = shallow(<Login />);
    it('Expect to have unit tests specified', () => {
        expect(true).toEqual(true);
    });

    it('should contain Motto component', () => {
        expect(component.find(Footer).length).toEqual(1);
    });

    it('should contain Motto component', () => {
        expect(component.find(UserSelection).length).toEqual(1);
    });

    it('should contain Motto component', () => {
        expect(component.find(Brand).length).toEqual(1);
    });

    it('should contain .login', () => {
        expect(component.hasClass(styles.login)).toBe(true);
    });
});
