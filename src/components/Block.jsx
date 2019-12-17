import React, { Component } from 'react';
import Square from './Square.jsx';

export default class Block extends Component {
    render() {
        const size = this.props.size;
        const top = this.props.position.top;
        const left = this.props.position.left;
        return (
            <Square
                size = {size}
                position={{ top, left }}
                color='#000000' />
        );
    }
}