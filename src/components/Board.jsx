import React, { Component } from 'react';
import Player from './Player';
import Goal from './Goal';
import Block from './Block';

export default class Board extends Component {

  style = () => {
    return {
      position: "relative",
      margin: "50px auto",
      width: "600px",
      height: "600px",
      border: "2px solid #000000"
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      playerPos: {y: 0, x: 0},
      playerDir: 5,
      goalPos: {y: 0, x: 0},
      blocks: []
    };

    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleKeyPress(e) {
    console.log(e.keyCode);
    if(this.state.playerDir < 4) {
      return;
    }

    let direction;
    switch(e.keyCode) {
        case 37:
            // LEFT
            direction = 0;
            break;
        case 38:
            // UP
            direction = 1;
            break;
        case 39:
            // RIGHT
            direction = 2;
            break;
        case 40:
            // DOWN
            console.log("DOWN");
            direction = 3;
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
      case 0:
        // LEFT
        pos = {y: pos.y, x: pos.x - 1};
        break;
      case 1:
        // UP
        pos = {y: pos.y - 1, x: pos.x};
        break;
      case 2:
        // RIGHT
        pos = {y: pos.y, x: pos.x + 1};
        break;
      case 3:
        // DOWN
        pos = {y: pos.y + 1, x: pos.x};
        break;
      default:
        return;
    }

    this.setState({playerPos: pos});
  }

  update() {
    this.setState({
      playerPos: this.props.start,
      goalPos: this.props.goal,
      blocks: this.props.blocks
    });
  }
  
  componentDidMount() {
    this.setState({ playerPos: this.props.start });
    window.onkeydown = this.handleKeyPress;
    this.playerInterval = setInterval(this.updatePlayerPos, 100);
  }
  
  componentDidUpdate(prevProps) {
    if(this.props.seed !== prevProps.seed) {
      this.update();
    }
  }

  //< Player size={{width: blockWidth, height: blockHeight}} position={{top: 0, left: 0}} />
  //< Goal size={{width: blockWidth, height: blockHeight}} position={{top: 0, left: 10}} />
  //< Block size={{width: blockWidth, height: blockHeight}} position={{top: 0, left: 20}} />
  render() {
    let blockSize = {
      width: 100.0/this.props.width, 
      height: 100.0/this.props.height
    };

    let positionCalc = (pos) => {
      return ({top: blockSize.height * pos.y, left: blockSize.width * pos.x});
    };

    return (
        <div style={this.style()}>
            < Player size={blockSize} position={positionCalc(this.state.playerPos)} width={this.props.width} height={this.props.height} blocks={this.state.blocks} goal={this.state.goal} />
            < Goal size={blockSize} position={positionCalc(this.state.goalPos)} />
            {
              this.state.blocks.map((block,i) => 
              < Block key={i} size={blockSize} position={positionCalc(block)} />)
            }
        </div>
    );
  }
}
