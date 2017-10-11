import React, { Component } from 'react';
import { connect } from 'react-redux';

export class HomeContainer extends Component {
    render() {
        const { foo, bar } = this.props;
        return (
            <div className="well"> { foo} { bar}</div>);
    }
}

export const Home = connect(null, null)(HomeContainer);
