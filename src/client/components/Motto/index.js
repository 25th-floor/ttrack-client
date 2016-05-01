import React from 'react';

export default React.createClass({
    propTypes: {
        house: React.PropTypes.string.isRequired,
        motto: React.PropTypes.string.isRequired
    },
    render: function () {
        return (
            <span title={this.props.house}>{this.props.motto}</span>
        );
    }
});


