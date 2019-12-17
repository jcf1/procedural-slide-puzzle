import React, { Component } from 'react';
import Square from './Square.jsx';

export default class Goal extends Component {
    render() {
        //const {info: { size, top, left }} = this.props;
        const size = this.props.size;
        const top = this.props.position.top;
        const left = this.props.position.left;
        return (
            <Square
                size = {size}
                position={{ top, left }}
                color='red' />
        );
    }
}