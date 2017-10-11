import PropTypes from 'prop-types';
import React from 'react';

import styles from './less/ProfileWidget.less';

export default class extends React.Component {
    static propTypes = {
        activeUser: PropTypes.object.isRequired,
    };

    render() {
        const activeUser = this.props.activeUser;

        const userId = activeUser.get('usr_id');
        const imgSrc = `/images/users/${userId}.jpg`;

        return (
            <div id={styles.profileWidget}>
                <div className={styles.image}>
                    <img src={imgSrc} alt="" />
                </div>
                <div className={styles.name}>
                    <span className="firstname">{activeUser.get('usr_firstname')} </span>
                    <span className="lastname">{activeUser.get('usr_lastname')}</span>
                </div>
            </div>
        );
    }
}
