//==============================================
// Position Code
function Position(y,x) {
    this.y = y;
    this.x = x;
}

Position.prototype = {
    isAdjacent: function(pos){
        return (Math.abs(pos.y - this.y) < 2) && (Math.abs(pos.x - this.x) < 2);
    },
    equals: function(pos){
        return (pos.y === this.y) && (pos.x === this.x);
    }
}
//==============================================

//==============================================
// Puzzle Code
function Puzzle(start, goal, blocks) {
    this.start = start;
    this.goal = goal;
    this.blocks = blocks;
}
//==============================================

//==============================================
// Random Number Generator
Math.generateRandomNum = function(max) {
    max = max || 1;
 
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
 
    return rnd * max;
}
//==============================================

let DOWN = 0;
let UP = 1;
let LEFT = 2;
let RIGHT = 3;
/*
EMPTY: 0,
START: 1,
END: 2,
BLOCK: 8,

UPDOWN: 0,
LEFTRIGHT: 1,
*/
/*
var PuzzleMaker = {
    // CONSTANTS
    
    DOWN = 0,
    UP: 1,
    LEFT: 2,
    RIGHT: 3,

    EMPTY: 0,
    START: 1,
    END: 2,
    BLOCK: 8,

    UPDOWN: 0,
    LEFTRIGHT: 1,
    
    //DATA-STRUCTURES
    
    reachPositions = [[]],
    incomingPositions = [[]],
    solutionPositions = [[]],
    playerPositions = [],
    blockPositions = [],
    unusedNextPositions = [[[]]],
    
    oppositeDirection(dir) {
        switch(dir) {
        case LEFT:
            return RIGHT;
		case RIGHT:
			return LEFT;
		case UP:
			return DOWN;
		case DOWN:
            return UP;
        default:
            return -1
		}
    },

    makePuzzle(seed, height, width, fake) {
        Math.seed = seed;
        let start = Position(Math.generateRandomNum(height), Math.generateRandomNum(width));
        let goal = Position(0,0);
        return start;
        //return Puzzle(start, goal, []);
    }
};
*/
function makePuzzle(seed, height, width, fake) {
    Math.seed = seed;
    let start = Position(Math.generateRandomNum(height), Math.generateRandomNum(width));
    let goal = Position(0,0);
    return start;
    //return Puzzle(start, goal, []);
}

var PuzzleMaker = {
    makePuzzle
}

module.exports = Position;
module.exports = PuzzleMaker;
