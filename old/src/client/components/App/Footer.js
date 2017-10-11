import PropTypes from 'prop-types';
import React from 'react';

import Motto from '../Motto';

import styles from './less/Footer.less';

export default class extends React.Component {
    static propTypes = {
        motto: PropTypes.object,
        build: PropTypes.object,
    };

    render() {
        let buildInfo = '';
        if (this.props.build && Object.keys(this.props.build).length > 0) {
            buildInfo = ' | ';

            if (this.props.build.build) {
                buildInfo += `build-${this.props.build.build}-`;
            }

            if (this.props.build.git) {
                buildInfo += `${this.props.build.git} `;
            }
        }

        return (
            <footer className={`${styles.footer} footer`}>
                <div className="container-fluid">
                    <div className={`${styles['footer-copyright']} footer-copyright`}>
                        {this.props.motto
                            ? (
                                <small className={styles['tt-motto']}>
                                    <Motto house={this.props.motto.house} motto={this.props.motto.motto} />
                                </small>
                            )
                            : ''}
                        <i className="fa fa-copyright" />
                        <a href="http://25th-floor.com">25th-floor GmbH</a>
                        <span>{buildInfo}</span>
                    </div>
                </div>
            </footer>
        );
    }
}
