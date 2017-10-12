// @flow
import R from 'ramda';
import React, { Component } from 'react';

import styles from './UserSelection.module.css';

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

    handleBla = user => this.props.onSelect(user)

    renderUserItem(user, index) {
        const { usr_Id, usr_firstname, usr_lastname } = user;
        return (
            <li key={index} className="col-xs-6 col-sm-3">
                <a onClick={() => this.handleBla(user)} role="button" tabIndex="0">
                    <div className={styles.imageContainer}>
                        <img src={'/16.jpg'} alt="" />
                    </div>
                    <span>
                        {usr_firstname}
                        <span className={styles.lastname}>
                            {` ${usr_lastname}`}
                        </span>
                    </span>
                </a>
            </li>
        );
    }

    render() {
        const users = SortByLastName(this.props.users);
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

