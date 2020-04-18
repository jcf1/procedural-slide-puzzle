import React, { Component } from 'react';
import Player from './Player';
import Goal from './Goal';
import Block from './Block';
import { UP,LEFT,DOWN,RIGHT,NONE,LOCK,UP_KEY,DOWN_KEY,LEFT_KEY,RIGHT_KEY,SCREEN_RATIO } from '../helpers/constants';

export default class Board extends Component {

  style = () => {
    return {
      position: "relative",
      margin: "1% auto",
      width: this.state.boardSize.width + "px",
      height: this.state.boardSize.height + "px",
      border: (this.state.boardSize.height/100) + "px solid #000000"
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      boardSize: {
        width: 0,
        height: 0
      },
      blockSize: {
        width: 0,
        height: 0,
        border: 0
      },
      blockSize_percent: {
        width: 0,
        height: 0
      },
      playerPos: {top: 0, left: 0},
      playerDir: LOCK,
      goalPos: {top: 0, left: 0},
      blocks: []
    };

    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.playerDeath = this.playerDeath.bind(this);
    this.playerStop = this.playerStop.bind(this);
  }

  handleKeyPress(e) {
    if(this.state.playerDir !== NONE) {
      return;
    }

    let direction;
    switch(e.keyCode) {
        case LEFT_KEY:
            // LEFT
            direction = LEFT;
            break;
        case UP_KEY:
            // UP
            direction = UP;
            break;
        case RIGHT_KEY:
            // RIGHT
            direction = RIGHT;
            break;
        case DOWN_KEY:
            // DOWN
            direction = DOWN;
            break;
        default:
            return;
    }
    this.setState({playerDir: direction});
  }

  updatePlayerPos = () => {
    let pos = this.state.playerPos;
    let dir = this.state.playerDir;

    switch(dir) {
      case LEFT:
        // LEFT
        pos = {top: pos.top, left: pos.left - 1};
        break;
      case UP:
        // UP
        pos = {top: pos.top - 1, left: pos.left};
        break;
      case RIGHT:
        // RIGHT
        pos = {top: pos.top, left: pos.left + 1};
        break;
      case DOWN:
        // DOWN
        pos = {top: pos.top + 1, left: pos.left};
        break;
      default:
        return;
    }

    this.setState({playerPos: pos});
  }

  positionCalc = (pos) => {
    let blockWidth = 100.0/this.props.width;
    let blockHeight = 100.0/this.props.height;
    return ({top: blockHeight * pos.y, left: blockWidth * pos.x});
  };

  playerDeath() {
    this.setState({
      playerPos: this.positionCalc(this.props.start),
      playerDir: NONE
    });
  }

  playerStop() {
    this.setState({
      playerDir: NONE
    });
  }

  win() {
    this.playerDeath();
  }

  update() {
    let blockWidth  = (((100.0/this.props.width)/100.0) * this.state.boardSize.width) - 2;
    let blockHeight = (((100.0/this.props.height)/100.0) * this.state.boardSize.height) - 2;
    let blockBorder = 1;

    let blockWidth_percent = 100.0/this.props.width;
    let blockHeight_percent = 100.0/this.props.height;

    this.setState({
      playerPos: this.positionCalc(this.props.start),
      goalPos: this.positionCalc(this.props.goal),
      blocks:  this.props.blocks.map((block,i) => this.positionCalc(block)),
      playerDir: NONE,
      blockSize: {
        width: blockWidth,
        height: blockHeight,
        border: blockBorder
      },
      blockSize_percent: {
        width: blockWidth_percent,
        height: blockHeight_percent
      }
    });
  }
  
  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    this.setState({ playerPos: this.props.start });
    window.onkeydown = this.handleKeyPress;
    this.playerInterval = setInterval(this.updatePlayerPos, 15);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.seed !== prevProps.seed || (this.props.blocks.length !== prevProps.blocks.length)) {
      this.update();
    }
  }

  updateWindowDimensions() {
    if(window.innerHeight < window.innerWidth) {
      this.setState({ boardSize : { width: window.innerHeight * SCREEN_RATIO, height: window.innerHeight * SCREEN_RATIO } });
    } else {
      this.setState({ boardSize : { width: window.innerWidth * SCREEN_RATIO, height: window.innerWidth * SCREEN_RATIO } });
    }
  }

  render() {
    return (      
        <div>
          <div>
            <center><h2>Current Seed: {this.props.current}</h2></center>  
          </div>
          <div style={this.style()}>
            < Player size={this.state.blockSize} size_percent={this.state.blockSize_percent} position={this.state.playerPos} direction={this.state.playerDir} boardSize={this.state.boardSize} blocks={this.state.blocks} goal={this.state.goalPos} win={this.win} playerDeath={this.playerDeath} playerStop={this.playerStop} />
            < Goal size={this.state.blockSize} position={this.state.goalPos} />
            {
              this.state.blocks.map((block,i) => 
              < Block key={i} size={this.state.blockSize} position={block} />)
            }
          </div>
        </div>
    );
  }
}
