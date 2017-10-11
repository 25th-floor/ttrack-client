// @flow
import R from 'ramda';
import React, { Component } from 'react';

import styles from './UserSelection.css';

export type UserSelectionProps = {
    users: any,
    onSelect: ()=> {},
};

const SortByLastName = R.sortBy(R.prop('usr_lastname'));


/**
 * UserSelection
 */

export class UserSelection extends Component {
    props: UserSelectionProps;

    constructor(props, context) {
        super(props, context);
        this.changeUser = this.changeUser.bind(this);
        this.renderUserItem = this.renderUserItem.bind(this);
    }

    changeUser(user) {
        this.props.onSelect(user);
    }

    renderUserItem(user, index) {
        const userId = user.get('usr_id');
        const imgSrc = `/images/users/${userId}.jpg`;
        return (
            <li key={index} className="col-xs-6 col-sm-3">
                <a onClick={R.curry(this.changeUser)(user)} role="button" tabIndex="0">
                    <div className={styles.imageContainer}>
                        <img src={imgSrc} alt="" />
                    </div>
                    <span>
                        {user.get('usr_firstname')}
                        <span className={styles.lastname}>
                            {` ${user.get('usr_lastname')}`}
                        </span>
                    </span>
                </a>
            </li>
        );
    }

    render() {
        console.log(this.props.users);
        const users = SortByLastName(this.props.users);
        // .sortBy(user => user.get('usr_lastname').toLowerCase());
        return (
            <div className={`container ${styles.userSelection}`}>
                <ul className={`${styles.userlist} row`}>
                    {users.map(this.renderUserItem)}
                </ul>
                <div className="clear" />
            </div>
        );
    }
}

export default UserSelection;

