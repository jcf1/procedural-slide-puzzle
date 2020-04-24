import React, { Component } from 'react';
import Board from './Board';
import PuzzleMaker from './PuzzleMaker';
import { SCREEN_RATIO } from '../helpers/constants';

const getRandomSeed = () => {
    return Math.floor(Math.random() * 1000000000);
}

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            windowSize: {
                width: 0,
                height: 0
            },
            start: {y: 0, x: 0},
            goal: {y: 0, x: 0},
            blocks: [],
            seed: -1,
            current: -1,
            width: 20,
            height: 20,
            fake: false
        }

        this.buttonClicked = this.buttonClicked.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    makeNewPuzzle = (seed) => {
        this.setState({current:seed});
        //Call Puzzle Generation
        let puzzle = PuzzleMaker.makePuzzle(seed, this.state.fake, this.state.width, this.state.height);
        this.setState({start: puzzle.start, goal: puzzle.goal, blocks: puzzle.blocks});
    }

    buttonClicked = () => {
        let seed = document.getElementById("seed-box").value;
        if(seed < 0 || seed > 1000000000) {
            seed = getRandomSeed();;
            document.getElementById("seed-box").value = seed;
        } 
        this.setState({seed: seed});
        this.makeNewPuzzle(seed);
    }

    newSeed = () => {
        let seed = getRandomSeed();
        this.setState({seed: seed});
        document.getElementById("seed-box").value = seed;
    }

    reset = () => {
        let seed = getRandomSeed();
        this.setState({seed: seed});
        document.getElementById("seed-box").value = seed;
        this.makeNewPuzzle(seed);
    }

    componentDidMount() {
        this.buttonClicked();
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions.bind(this));
    }
    
      componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions.bind(this));
      }
    
      updateWindowDimensions() {
        this.setState({ windowSize : { width: window.innerWidth, height: window.innerHeight } });
      }
    
    render() {
        return (
            <div className="game-options">
                <div>
                    <label>Random Seed:</label>
                    <input type="number" min="0" id="seed-box" defaultValue={getRandomSeed()} />
                </div>
                <div>
                    <label>Add Fake Blocks:</label>
                    <input id="fake-box" type="checkbox" onChange={(e) => this.setState(prevState => ({fake: !prevState.fake})) } />
                </div>
                <div>
                    <button onClick={this.buttonClicked.bind(this)}>Make Puzzle</button>
                </div>
                <div>
                    <button onClick={this.newSeed.bind(this)}>Random Seed</button>
                </div>
                <div>
                    < Board seed={this.state.seed} boardSize={(this.state.windowSize.width > this.state.windowSize.height ? this.state.windowSize.height : this.state.windowSize.width) * SCREEN_RATIO} current={this.state.current} width={this.state.width} height={this.state.height} start={this.state.start} goal={this.state.goal} blocks={this.state.blocks} reset={this.reset.bind(this)} />
                </div>
                <div style={{margin:"0 auto", width : (this.state.windowSize.width * 0.75)+"px"}}>
                    <div><b>OBJECTIVE:</b>&emsp;Use the arrow keys to move the blue block to the red block by sliding and colliding with the black blocks. If you slide off the board, you will be put back into the starting position.</div>
                    <div><b>OPTIONS:</b>&emsp;&emsp; Change the level by changing the "Random Seed" value above and clickint the "Make Puzzle" button. The "Random Seed" button will generate a new "Random Seed" for you. Setting the "Fake Blocks" option will add blocks that are not required for the level's solution to the board.</div>
                </div>
            </div>
        );
    }
}