import React from 'react';

import Motto from '../Motto';
import UserSelection from './UserSelection';
import AppFooter from '../App/Footer';

import styles from './less/Login.less';

export default class extends React.Component {
    static propTypes = {
        users: React.PropTypes.any.isRequired,
        motto: React.PropTypes.object.isRequired,
        onUserSelect: React.PropTypes.func.isRequired,
        build: React.PropTypes.object,
    };

    render() {
        const motto = this.props.motto;
        return (
            <div id="login" className={styles.login}>
                <div className={styles.loginBrand}>
                    <svg viewBox="0 0 100 100" space="preserve">
                        <path d="M 100.00,0.00
                               C 100.00,0.00 100.00,20.00 100.00,20.00
                                 100.00,20.00 80.00,20.00 80.00,20.00
                                 80.00,20.00 80.00,100.00 80.00,100.00
                                 80.00,100.00 60.00,100.00 60.00,100.00
                                 60.00,100.00 60.00,20.00 60.00,20.00
                                 60.00,20.00 40.00,20.00 40.00,20.00
                                 40.00,20.00 40.00,100.00 40.00,100.00
                                 40.00,100.00 20.00,100.00 20.00,100.00
                                 20.00,100.00 20.00,20.00 20.00,20.00
                                 20.00,20.00 0.00,20.00 0.00,20.00
                                 0.00,20.00 0.00,0.00 0.00,0.00
                                 0.00,0.00 100.00,0.00 100.00,0.00 Z"
                        />
                    </svg>
                    <span className={styles.title}>
                        <strong>Time</strong> Tracking
                    </span>

                    <small className={styles['tt-motto']}><Motto house={motto.house} motto={motto.motto} /></small>
                </div>

                <UserSelection users={this.props.users} onSelect={this.props.onUserSelect} />

                <AppFooter build={this.props.build} />

            </div>

        );
    }
}

