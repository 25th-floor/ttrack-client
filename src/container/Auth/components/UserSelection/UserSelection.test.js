import React from 'react';
import { shallow } from 'enzyme';

import { UserSelection, User } from './UserSelection';

describe('<UserSelection />', () => {
    const users = [{
        usr_id: 16,
        usr_lastname: 'muster',
        usr_email: 'ti@asd.com',
        usr_firstname: 'mann',
        usr_employment_start: '2017-03-01T00:00:00.000Z',
        usr_employment_end: null,
    }, {
        usr_id: 17,
        usr_lastname: 'Foobar',
        usr_email: 'fb@bar.com',
        usr_firstname: 'foo',
        usr_employment_start: '2017-03-01T00:00:00.000Z',
        usr_employment_end: null,
    }];

    const onSelectMock = jest.fn();

    const component = shallow(<UserSelection
        users={users}
        onSelect={onSelectMock}
    />);

    it('should contain container and userSelection', () => {
        expect(component.hasClass('container')).toEqual(true);
    });

    it('should render two users', () => {
        expect(component.instance().props.users).toEqual(users);
        expect(component.find('ul').children().length).toBe(2);
    });

    it('should render userItem', () => {
        const index = '0';
        const item = shallow(<User user={users[index]} index={index} />);
        expect(item.key()).toBe(index);
        expect(item.hasClass('col-xs-6 col-sm-3')).toEqual(true);
    });
});
