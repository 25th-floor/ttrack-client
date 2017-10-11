import PropTypes from 'prop-types';
import React from 'react';

export default class extends React.Component {
    static propTypes = {
        house: PropTypes.string.isRequired,
        motto: PropTypes.string.isRequired,
    };

    render() {
        return (
            <span title={this.props.house}>{this.props.motto}</span>
        );
    }
}
