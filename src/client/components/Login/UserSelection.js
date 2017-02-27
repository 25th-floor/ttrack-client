import React from 'react';
import styles from './less/UserSelection.less';

export default class extends React.Component {
    static propTypes = {
        users: React.PropTypes.any.isRequired,
        onSelect: React.PropTypes.func.isRequired,
    };

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
        const onChangeUser = this.changeUser.bind(this, user);
        return (
            <li key={index} className="col-xs-6 col-sm-3">
                <a onClick={onChangeUser}>
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
        const users = this.props.users.sortBy(user => user.get('usr_lastname').toLowerCase());
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
