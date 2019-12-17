import React, { Component } from 'react';
import Square from './Square.jsx';

export default class Player extends Component {
    
    // Check if going out of bounds, hit block, or reach goal
    componentDidUpdate() {

    }

    render() {
        const size = this.props.size;
        const top = this.props.position.top;
        const left = this.props.position.left;
        return (
            <Square
                size = {size}
                position={{ top, left }}
                color='blue' />
        );
    }
}