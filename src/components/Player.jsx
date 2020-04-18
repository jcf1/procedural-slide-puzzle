import React, { Component } from 'react';
import Square from './Square.jsx';
import { UP,LEFT,DOWN,RIGHT } from '../helpers/constants';

export default class Player extends Component {
    
    // Check if going out of bounds, hit block, or reach goal
    componentDidUpdate() {
        let bounds;

        var block;
        var i;

        let size = this.props.size_percent;
        let pos = this.props.position;
        let goal = this.props.goal;
        let blocks = this.props.blocks;

        switch(this.props.direction) {
            case UP:
                bounds = 0;
                if(pos.top <= bounds) {
                    this.props.playerDeath();
                } else if((pos.left === goal.left) && (pos.top === (goal.top + size.height))) {
                    this.props.win();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.left === block.left) && (pos.top === (block.top + size.height))) {
                            this.props.playerStop()
                        }
                    }
                }
                break;
            case LEFT:
                bounds = 0;
                if(pos.left <= bounds) {
                    this.props.playerDeath();
                } else if((pos.top === goal.top) && (pos.left === (goal.left + size.width))) {
                    this.props.win();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.top === block.top) && (pos.left === (block.left + size.width))) {
                            this.props.playerStop()
                        }
                    }
                }
                break;
            case RIGHT:
                bounds = 100;
                if((pos.left + size.width) >= bounds) {
                    this.props.playerDeath();
                } else if((pos.top === goal.top) && ((pos.left + size.width) === goal.left)) {
                    this.props.win();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.top === block.top) && ((pos.left + size.width) === block.left)) {
                            this.props.playerStop()
                        }
                    }
                }
                break;
            case DOWN:
                bounds = 100;
                if((pos.top + size.height) >= bounds) {
                    this.props.playerDeath();
                } else if((pos.left === goal.left) && ((pos.top + size.height) === goal.top)) {
                    this.props.win();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.left === block.left) && ((pos.top + size.height) === block.top)) {
                            this.props.playerStop()
                        }
                    }
                }
                break;
            default:
                return;
        }
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