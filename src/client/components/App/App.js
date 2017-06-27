import PropTypes from 'prop-types';
import React from 'react';

import Navigation from '../Navigation';
import AppFooter from './Footer';

import styles from './less/App.less';

export default class extends React.Component {
    static propTypes = {
        motto: PropTypes.object.isRequired,
        onLogout: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        build: PropTypes.object,
    };

    render() {
        return (
            <div className={styles['site-container']}>
                <div className="container-fluid">
                    <Navigation motto={this.props.motto} onLogout={this.props.onLogout} activeUser={this.props.user} />
                    <div>{this.props.children}</div>
                </div>

                <AppFooter motto={this.props.motto} build={this.props.build} />

            </div>
        );
    }
}

