import React from 'react';

import Navigation from '../Navigation';
import AppFooter from './Footer';

import styles from './less/App.less';

export default class extends React.Component {
    static propTypes = {
        motto: React.PropTypes.object.isRequired,
        onLogout: React.PropTypes.func.isRequired,
        user: React.PropTypes.object.isRequired,
        build: React.PropTypes.object,
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

