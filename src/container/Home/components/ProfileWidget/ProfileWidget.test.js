// @flow
import React from 'react';
import { shallow } from 'enzyme';
import type { UserType } from '@data/Resources';
import { sampleOne } from 'babel-plugin-transform-flow-to-gen/api';
import { ProfileWidget } from './ProfileWidget';

require('jasmine-check').install();

describe('<ProfileWidget />', () => {
    check.it('should render the component with props', [UserType()], (props) => {
        const sample = sampleOne(props);
        const component = shallow(<ProfileWidget user={sample} />);
        expect(component.instance().props).toEqual({
            user: sample,
        });
        expect(component.find('.firstname').text()).toBe(`${sample.usr_firstname} `);
    });
});
