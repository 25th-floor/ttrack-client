import React from 'react';

import styles from './less/ProfileWidget.less';

export default class extends React.Component {
    static propTypes = {
        activeUser: React.PropTypes.object.isRequired,
    };

    render() {
        let activeUser = this.props.activeUser;

        let userId = activeUser.get('usr_id');
        let imgSrc = `/images/users/${userId}.jpg`;

        return (
            <div id={styles.profileWidget}>
                <div className={styles.image}>
                    <img src={imgSrc} />
                </div>
                <div className={styles.name}>
                    <span className="firstname">{activeUser.get('usr_firstname')} </span> <span
                    className="lastname">{activeUser.get('usr_lastname')}</span>
                </div>
            </div>
        );
    }
};


