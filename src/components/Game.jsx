import React, { Component } from 'react';
import Board from './Board';
import PuzzleMaker from './PuzzleMaker';

const getRandomSeed = () => {
    return Math.floor(Math.random() * 1000000);
}

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {
            start: {y: 0, x: 0},
            goal: {y: 0, x: 0},
            blocks: [],
            seed: -1,
            width: 0,
            height: 0,
            fake: false
        }

        this.buttonClicked = this.buttonClicked.bind(this);
    }

    makeNewPuzzle = (seed) => {
        //User input
        this.setState({width: 20, height:20});

        let width = 20;
        let height = 20;
        //Call Puzzle Generation
        let puzzle = PuzzleMaker.makePuzzleNew(seed, this.state.fake, width, height);
        //let puzzle = PuzzleMaker.makePuzzle(seed, this.state.fake, width, height);

        this.setState({start: puzzle.start, goal: puzzle.goal, blocks: puzzle.blocks});
    }

    buttonClicked = () => {
        let seed = document.getElementById("seed-box").value;
        this.setState({seed: seed});
        this.makeNewPuzzle(seed);
    }

    reset = () => {
        let seed = getRandomSeed();
        this.setState({seed: seed});
        document.getElementById("seed-box").value = seed;
        this.makeNewPuzzle(seed);
    }

    componentDidMount() {
        this.buttonClicked();
    }
    
    render() {
        return (
            <div className="game-options">
                <div>
                    <label>Random Seed:</label>
                    <input id="seed-box" defaultValue={getRandomSeed()} />
                </div>
                <div>
                    <label>Add Fake Blocks:</label>
                    <input id="fake-box" type="checkbox" onChange={(e) => this.setState(prevState => ({fake: !prevState.fake})) } />
                </div>
                <div>
                    <button onClick={this.buttonClicked.bind(this)}>Make Puzzle</button>
                </div>
                < Board seed={this.state.seed} width={this.state.width} height={this.state.height} start={this.state.start} goal={this.state.goal} blocks={this.state.blocks} reset={this.reset.bind(this)} />
            </div>
        );
    }
}
