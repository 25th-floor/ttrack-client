import React from 'react';

export default class extends React.Component {
    static propTypes = {
        house: React.PropTypes.string.isRequired,
        motto: React.PropTypes.string.isRequired,
    };

    render() {
        return (
            <span title={this.props.house}>{this.props.motto}</span>
        );
    }
};


