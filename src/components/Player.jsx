import React, { Component } from 'react';
import Square from './Square.jsx';
import { UP,LEFT,DOWN,RIGHT,NONE,LOCK } from '../helpers/constants';

export default class Player extends Component {
    
    // Check if going out of bounds, hit block, or reach goal
    componentDidUpdate() {
        let bounds;

        var block;
        var i;

        let size = this.props.size;
        let pos = this.props.position;
        let goal = this.props.goal;
        let blocks = this.props.blocks;

        switch(this.props.direction) {
            case UP:
                bounds = 0;

                if(pos.top <= bounds) {
                    console.log("DIE UP");
                    this.props.playerDeath();
                } else if((pos.left === goal.left) && (pos.top === (goal.top + size.height))) {
                    console.log("WIN UP");
                    this.props.playerDeath();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.left === block.left) && (pos.top === (block.top + size.height))) {
                            console.log("STOP UP");
                            this.props.playerStop()
                        }
                    }
                }
                break;
            case LEFT:
                bounds = 0;

                if(pos.left <= bounds) {
                    console.log("DIE LEFT");
                    this.props.playerDeath();
                } else if((pos.top === goal.top) && (pos.left === (goal.left + size.width))) {
                    console.log("WIN LEFT");
                    this.props.playerDeath();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.top === block.top) && (pos.left === (block.left + size.width))) {
                            console.log("STOP LEFT");
                            this.props.playerStop()
                        }
                    }
                }
                break;
            case RIGHT:
                bounds = 100;

                if((pos.left + size.width) >= bounds) {
                    console.log("DIE RIGHT");
                    this.props.playerDeath();
                } else if((pos.top === goal.top) && ((pos.left + size.width) === goal.left)) {
                    console.log("WIN RIGHT");
                    this.props.playerDeath();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.top === block.top) && ((pos.left + size.width) === block.left)) {
                            console.log("STOP RIGHT");
                            this.props.playerStop()
                        }
                    }
                }
                break;
            case DOWN:
                bounds = 100;

                if((pos.top + size.height) >= bounds) {
                    console.log("DIE DOWN");
                    this.props.playerDeath();
                } else if((pos.left === goal.left) && ((pos.top + size.height) === goal.top)) {
                    console.log("WIN DOWN");
                    this.props.playerDeath();
                } else {
                    for(i = 0; i < blocks.length; i++) {
                        block = blocks[i];
                        if((pos.left === block.left) && ((pos.top + size.height) === block.top)) {
                            console.log("STOP DOWN");
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