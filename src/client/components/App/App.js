'use strict';

import React from 'react';

import Motto from '../Motto';
import Navigation from '../Navigation';
import AppFooter from './Footer';

import styles from './less/App.less';

export default React.createClass({
    propTypes: {
        motto: React.PropTypes.object.isRequired,
        logout: React.PropTypes.func.isRequired,
        user: React.PropTypes.object.isRequired,
        build: React.PropTypes.object
    },
    render: function () {
        return (
            <div className={styles['site-container']}>
                <div className="container-fluid">
                    <Navigation motto={this.props.motto} onLogout={this.props.logout} activeUser={this.props.user} />
                    <div>{this.props.children}</div>
                </div>

                <AppFooter motto={this.props.motto} build={this.props.build} />

            </div>
        );
    }
});

