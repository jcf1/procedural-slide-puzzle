//===================================================
// Position class
function Position(y, x) {
    this.y = y;
    this.x = x;
}

Position.prototype.equals = function(pos) {
    return (this.y === pos.y) && (this.x === pos.x);
}

function positionHash(pos) {
    let tmp = pos.y + ((pos.x + 1) / 2);
    return pos.x + (tmp * tmp);
}
//===================================================

//===================================================
// Random Number Generator
Math.seededRandom = function(max) {
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
    return rnd * max
}
//===================================================

//===================================================
// Constants

// Directions
const DOWN  = 0;
const UP    = 1;
const LEFT  = 2;
const RIGHT = 3;

const DIRECTIONS = 4;

// Puzzle Cells
const EMPTY = 0;
const START = 1;
const END   = 2;
const BLOCK = 3;

// Next move is Horizontal or Vertical
const UPDOWN    = 0;
const LEFTRIGHT = 1;

// Next move is Left or Right if Horizontal or Up or Down if Vertical
const LEFTUP    = 0;
const RIGHTDOWN = 1;
//===================================================

//===================================================
// Global Variables
var reachPositions;
var incomingDirections;

var solutionPositions;
var playerPositions;
var blockPositions;
var unusedNextPositions;
//===================================================

function computePossibleNextPositions() {

}

function computeReachability(puzzle, prev_reachSet, prev_incomingSet, index, start, direction) {
    var reachSet = prev_reachSet;
    var incomingSet = prev_incomingSet;

    if(direction === -1) {
        reachSet[positionHash(start)] = 0;
        incomingSet[positionHash(start)] = start;
    }

    var posQueue = [];
    var dirQueue = [];

    var possibilities = [];
    possibilities.push(DOWN);
    possibilities.push(UP);
    possibilities.push(LEFT);
    possibilities.push(RIGHT);
    if(direction != -1) {

    }

    while(possibilities.length > 0) {
        posQueue.push(start);
        dirQueue.push(possibilities.pop());
    }

    while(posQueue.length > 0 && dirQueue.length > 0) {
        let pos = posQueue.pop();
        let action = dirQueue.pop();
        let length = reachSet[positionHash(pos)] + 1;
        var repeat = true;
        let y = pos.y;
        let x = pos.x;

        switch(action) {
            case LEFT:
                for(var i = x-1; i >= 0; i--) {
                    var next = Position(y, i+1);
                    if() {

                    }

                    if((i === 0 && puzzle[y][i] === EMPTY) || (puzzle[y][i] ===END)) {
                        next = Position(y, i);
                        if() {

                        }
                        break;
                    } else if(puzzle[y][i] === BLOCK) {
                        if(!repeat) {
                            posQueue.push(next);
                            dirQueue.push(UP);
                            posQueue.push(next);
                            dirQueue.push(DOWN);
                        }
                        break;
                    }
                }
                break;

        }
    }
}

//===================================================
// Path Generation
function generatePath(puzzle, length) {
    var startVertOrHori = Math.seededRandom(1) === 0 ? UPDOWN : LEFTRIGHT;
    if(tryStart(puzzle, length, startVertOrHori)) {
        return playerPositions[length-1];
    }
    startVertOrHori = startVertOrHori === UPDOWN ? LEFTRIGHT : UPDOWN;
    if(tryStart(puzzle, length, startVertOrHori)) {
        return playerPositions[length-1];
    }
    return null;
}

function tryStart(puzzle, length, vertOrHori) {
    var count = 0;

    var success = generateStartMove(puzzle, count, vertOrHori);
    if(!success) {
        return false;
    }

    while(count < (length-1)) {
        if(count == (length-2)) {
            success = generateEndMove(puzzle, count, length, vertOrHori);
            if(success) {
                return true;
            }
        } else {
            success = generateSingleMove(puzzle, count, vertOrHori);
        }
        vertOrHori = vertOrHori === UPDOWN ? LEFTRIGHT : UPDOWN;
        
        if(success) {
            count++;
        } else {
            //removePosition(puzzle, count);
            count--;
        }

        if(count !== -1) {
            return false;
        }
    }
    return false;
}

function generateStartMove(puzzle, index, vertOrHori) {
    let start = playerPositions[index];
    let options = computePossibleNextPositions(puzzle, index, start, vertOrHori);
    unusedNextPositions[index] = options;
    if((options[0].length === 0) && (options[1].length === 0)) {
        return false;
    }
    computeReachability(puzzle, {}, {}, index, start, -1);
    return true;
}

function generateSingleMove(puzzle, index, vertOrHori) {
    return false;
}

function generateEndMove(puzzle, index, length, vertOrHori) {
    return false;
}
//===================================================

function makePuzzleNew(seed, fake, width, height) {
    // Seed Random Generator
    Math.seed = seed;

    // Set Length of Solution
    let length;
    if(width >= height) {
        length = ((height * 3) / 4) + Math.seededRandom(height / 2);
    } else {
        length = ((width * 3) / 4) + Math.seededRandom(width / 2);
    }

    // Initialize Puzzle Array
    var puzz = new Array(height);
    for(var i = 0; i < height; i++) {
        puzz[i] = new Array(width);
    }

    var remainingStarts = new Array();
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            remainingStarts.push(Position(y, x));
        }
    }
    var start = Position(0,0);
    var goal;

    do {
        // Initialize global Structures
        solutionPositions = new Array(length - 1);
        playerPositions = new Array(length);
        blockPositions = new Array(length - 1);
        reachPositions = new Array(length);
        incomingDirections = new Array(length);
        unusedNextPositions = new Array(length);

        puzz[start.y][start.x] = EMPTY;
        start = remainingStarts.splice(Math.seededRandom(remainingStarts.length - 1), 1);
        puzz[start.y][start.x] = START;

        solutionPositions.push({});
        solutionPositions[0][start.positionHash()] = start;
        playerPositions.push(start);
        blockPositions.push(start);

        goal = generatePath(puzz, length);
    } while (goal == null &&  remainingStarts.length > 0);

    if(goal == null) {
        return null;
    }

    //Remove Start Position from Block Positions
    blockPositions.splice(0,1);

    // Add Fake Blocks Here if "fake" is true

    return {
        start: start,
        goal: goal,
        blocks: blockPositions
    }
}

function makePuzzle(seed, fake, width, height) {
    // Seed Random Generator
    Math.seed = seed;
    
    console.log("Make Puzzle");
    console.log(seed);
    console.log(fake);
    console.log(width);
    console.log(height);

    let start = {y: 5, x: 5};
    let goal = {y: 1, x: 14};
    let block1 = {y: 15, x: 5};
    let block2 = {y: 14, x: 15};
    let blocks = [block1,block2];

    return {
        start: start,
        goal: goal,
        blocks: blocks
    }
}

var PuzzleMaker = {
    makePuzzle
}

module.exports = PuzzleMaker;