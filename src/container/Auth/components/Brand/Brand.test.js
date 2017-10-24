import React from 'react';
import { Motto } from '@components';
import { shallow, mount, render } from 'enzyme';

import { Brand } from './Brand';
import styles from './Brand.module.css';

describe('<Brand />', () => {
    const component = shallow(<Brand />);
    it('should contain Motto component', () => {
        expect(component.find(Motto).length).toEqual(1);
    });
    it('should contain a svg', () => {
        expect(component.find('svg').length).toEqual(1);
    });

    it('should contain a .loginBrand', () => {
        expect(component.hasClass(styles.loginBrand)).toBe(true);
    });
});
