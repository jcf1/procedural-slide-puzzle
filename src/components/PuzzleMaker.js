//===================================================
// Position class
function Position(y, x) {
    this.y = y;
    this.x = x;
    this.hash = function() {
        return y+","+x;
    }
}
/*
Position.prototype.hash = function() {
    return this.y+","+this.x;
}
*/
//===================================================

//===================================================
// Random Number Generator
Math.seededRandom = function(max) {
    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;
    return Math.round(rnd * max);
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

var solution;

// ArrayList<HashMap<Position,Integer>>
var reachPositions;
// ArrayList<HashMap<Position,Position>>
var incomingDirections;

// ArrayList<HashSet<Position>>
var solutionPositions;
// ArrayList<Position>
var playerPositions;
var playerPositions_hash;
// ArrayList<Position>
var blockPositions;
// ArrayList<ArrayList<LinkedList<Position>>>
var unusedNextPositions;
//===================================================

function printSolution() {
    let solution_text = []
    for(var i = 0; i < solution.length; i++) {
        switch(solution[i]) {
            case LEFT:
                solution_text.push("LEFT");
                break;
            case RIGHT:
                solution_text.push("RIGHT");
                break;
            case UP:
                solution_text.push("UP");
                break;
            case DOWN:
                solution_text.push("DOWN");
                break;
            default:
                break;
        }
    }
    console.log(solution_text);
}

function oppositeDirection(action) {
    switch(action) {
        case LEFT:
            return RIGHT;
        case RIGHT:
            return LEFT;
        case UP:
            return DOWN;
        case DOWN:
            return UP;
        default:
            return -1;
    }
}

function computePossibleNextPositions(puzzle, height, width, index, pos, vertOrHori) {
    var options = [];
    var leftup = [];
    var rightdown = [];

    let y = pos.y;
    let x = pos.x;

    var i;
    var j;
    var next;
    var block;
    switch(vertOrHori) {
        case UPDOWN:
            for(i = y-1; i > 0; i--) {
                if(puzzle[i][x] === BLOCK) {
                    break;
                }
                leftup.push(new Position(i,x));
            }

            for(i = y+1; i < height-1; i++) {
                if(puzzle[i][x] === BLOCK) {
                    break;
                }
                rightdown.push(new Position(i,x));
            }

            var currSolPositions;
            for(i = 0; i < index; i++) {
                currSolPositions = solutionPositions[i];
                var leftRemove = [];
                for(j = 0; j < leftup.length; j++) {
                    next = leftup[j];
                    block = new Position(next.y - 1, next.x);
                    if(playerPositions_hash.includes(next.hash()) || currSolPositions.has(block.hash()) || reachPositions[index-1].has(next.hash())) {
                        leftRemove.push(j);
                    }
                }
                var rightRemove = [];
                for(j = 0; j < rightdown.length; j++) {
                    next = rightdown[j];
                    block = new Position(next.y - 1, next.x);
                    if(playerPositions_hash.includes(next.hash()) || currSolPositions.has(block.hash()) || reachPositions[index-1].has(next.hash())) {
                        rightRemove.push(j);
                    }
                }
                for(j = 0; j < leftRemove.length; j++) {
                    leftup.splice(leftRemove[j],1);
                }
                for(j = 0; j < rightRemove.length; j++) {
                    rightdown.splice(rightRemove[j],1);
                }
            }
            break;
        case LEFTRIGHT:
            for(i = x-1; i > 0; i--) {
                if(puzzle[y][i] === BLOCK) {
                    break;
                }
                leftup.push(new Position(y,i));
            }

            for(i = x+1; i < width-1; i++) {
                if(puzzle[y][i] === BLOCK) {
                    break;
                }
                rightdown.push(new Position(y,i));
            }

            for(i = 0; i < index; i++) {
                currSolPositions = solutionPositions[i];
                var upRemove = [];
                for(j = 0; j < leftup.length; j++) {
                    next = leftup[j];
                    block = new Position(next.y, next.x - 1);
                    if(playerPositions_hash.includes(next.hash()) || currSolPositions.has(block.hash()) || reachPositions[index-1].has(next.hash())) {
                        upRemove.push(j);
                    }
                }
                var downRemove = [];
                for(j = 0; j < rightdown.length; j++) {
                    next = rightdown[j];
                    block = new Position(next.y, next.x + 1);
                    if(playerPositions_hash.includes(next.hash()) || currSolPositions.has(block.hash()) || reachPositions[index-1].has(next.hash())) {
                        downRemove.push(j);
                    }
                }
                for(j = 0; j < upRemove.length; j++) {
                    leftup.splice(upRemove[j],1);
                }
                for(j = 0; j < downRemove.length; j++) {
                    rightdown.splice(downRemove[j],1);
                }
            }
            break;
        default:
            break;
    }
    
    var change;
    var temp;
    for(i = 0; i < leftup.length; i++) {
        change = i + Math.seededRandom(leftup.length - i - 1);
        temp = leftup[change];
        leftup.splice(change, 1, leftup[i]);
        leftup.splice(i, 1, temp);
    }
    for(i = 0; i < rightdown.length; i++) {
        change = i + Math.seededRandom(rightdown.length - i - 1);
        temp = rightdown[change];
        rightdown.splice(change, 1, rightdown[i]);
        rightdown.splice(i, 1, temp);
    }
    
    options.push(leftup);
    options.push(rightdown);
    return options;
}

function computePossibleEndPositions(puzzle, height, width, length, index, pos, vertOrHori) {
    var options = [];
    var leftup = [];
    var rightdown = [];

    let y = pos.y;
    let x = pos.x;

    var i;
    var next;
    switch(vertOrHori) {
        case UPDOWN:
            for(i = y-1; i > 0; i--) {
                if(puzzle[i][x] === BLOCK) {
                    break;
                }
                next = new Position(i,x);
                if(reachPositions[index].get(next.hash()) === length) {
                    leftup.push(next);
                }
            }

            for(i = y+1; i < height-1; i++) {
                if(puzzle[i][x] === BLOCK) {
                    break;
                }
                next = new Position(i,x);
                if(reachPositions[index].get(next.hash()) === length) {
                    rightdown.push(next);
                }
            }
            break;
        case LEFTRIGHT:
            for(i = x-1; i > 0; i--) {
                if(puzzle[y][i] === BLOCK) {
                    break;
                }
                next = new Position(y,i);
                if(reachPositions[index].get(next.hash()) === length) {
                    leftup.push(next);
                }
            }

            for(i = x+1; i < width-1; i++) {
                if(puzzle[y][i] === BLOCK) {
                    break;
                }
                next = new Position(y,i);
                if(reachPositions[index].get(next.hash()) === length) {
                    rightdown.push(next);
                }
            }
            break;
        default:
            break;
    }
    
    var change;
    var temp;
    for(i = 0; i < leftup.length; i++) {
        change = i + Math.seededRandom(leftup.length - i - 1);
        temp = leftup[change];
        leftup.splice(change, 1, leftup[i]);
        leftup.splice(i, 1, temp);
    }
    for(i = 0; i < rightdown.length; i++) {
        change = i + Math.seededRandom(rightdown.length - i - 1);
        temp = rightdown[change];
        rightdown.splice(change, 1, rightdown[i]);
        rightdown.splice(i, 1, temp);
    }
    
    options.push(leftup);
    options.push(rightdown);
    return options;
}

function computeReachability(puzzle, height, width, prev_reachSet, prev_incomingSet, index, start, direction) {
    var reachSet = prev_reachSet;
    var incomingSet = prev_incomingSet;

    if(direction === -1) {
        reachSet.set(start.hash(), 0);
        incomingSet.set(start.hash(), start.hash());
    }

    var posQueue = [];
    var dirQueue = [];

    var possibilities = [];
    switch(direction) {
        case LEFT:
            possibilities.push(DOWN);
            possibilities.push(UP);
            break;
        case RIGHT:
            possibilities.push(DOWN);
            possibilities.push(UP);
            break;
        case UP:
            possibilities.push(LEFT);
            possibilities.push(RIGHT);
            break;
        case DOWN:
            possibilities.push(LEFT);
            possibilities.push(RIGHT);
            break;
        default:
            possibilities.push(DOWN);
            possibilities.push(UP);
            possibilities.push(LEFT);
            possibilities.push(RIGHT);
            break;
        
    }

    while(possibilities.length > 0) {
        posQueue.push(start);
        dirQueue.push(possibilities.pop());
    }

    while(posQueue.length > 0 && dirQueue.length > 0) {

        let pos = posQueue.shift();
        let action = dirQueue.shift();
        let length = reachSet.get(pos.hash()) + 1;
        var repeat = true;
        let y = pos.y;
        let x = pos.x;

        var i;
        var next;
        switch(action) {
            case LEFT:
                for(i = x-1; i >= 0; i--) {
                    next = new Position(y, i+1);
                    if(!reachSet.has(next.hash())) {
                        reachSet.set(next.hash(),length);
                        incomingSet.set(next.hash(),pos.hash());
                        repeat = false;
                    }

                    if((i === 0 && puzzle[y][i] === EMPTY) || (puzzle[y][i] === END)) {
                        next = new Position(y, i);
                        if(!reachSet.has(next.hash())) {
                            reachSet.set(next.hash(),length);
                            incomingSet.set(next.hash(),pos.hash());
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
            case RIGHT:
                for(i = x+1; i < width; i++) {
                    next = new Position(y, i-1);

                    if(!reachSet.has(next.hash())) {
                        reachSet.set(next.hash(),length);
                        incomingSet.set(next.hash(),pos.hash());
                        repeat = false;
                    }

                    if((i === width - 1 && puzzle[y][i] === EMPTY) || (puzzle[y][i] === END)) {
                        next = new Position(y, i);
                        if(!reachSet.has(next.hash())) {
                            reachSet.set(next.hash(),length);
                            incomingSet.set(next.hash(),pos.hash());
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
            case UP:
                for(i = y-1; i >= 0; i--) {
                    next = new Position(i+1, x);

                    if(!reachSet.has(next.hash())) {
                        reachSet.set(next.hash(),length);
                        incomingSet.set(next.hash(),pos.hash());
                        repeat = false;
                    }

                    if((i === 0 && puzzle[i][x] === EMPTY) || (puzzle[i][x] === END)) {
                        next = new Position(i, x);
                        if(!reachSet.has(next.hash())) {
                            reachSet.set(next.hash(),length);
                            incomingSet.set(next.hash(),pos.hash());
                        }
                        break;
                    } else if(puzzle[i][x] === BLOCK) {
                        if(!repeat) {
                            posQueue.push(next);
                            dirQueue.push(LEFT);
                            posQueue.push(next);
                            dirQueue.push(RIGHT);
                        }
                        break;
                    }
                }
                break;
            case DOWN:
                for(i = y+1; i < height; i++) {
                    next = new Position(i-1, x);

                    if(!reachSet.has(next.hash())) {
                        reachSet.set(next.hash(),length);
                        incomingSet.set(next.hash(),pos.hash());
                        repeat = false;
                    }

                    if((i === height - 1 && puzzle[i][x] === EMPTY) || (puzzle[i][x] === END)) {
                        next = new Position(i, x);
                        if(!reachSet.has(next.hash())) {
                            reachSet.set(next.hash(),length);
                            incomingSet.set(next.hash(),pos.hash());
                        }
                        break;
                    } else if(puzzle[i][x] === BLOCK) {
                        if(!repeat) {
                            posQueue.push(next);
                            dirQueue.push(LEFT);
                            posQueue.push(next);
                            dirQueue.push(RIGHT);
                        }
                        break;
                    }
                }
                break;
            default:
                break;
        }
    }
    reachPositions.splice(index,1,reachSet);
	incomingDirections.splice(index,1,incomingSet);
}

function addPosition(index, pos1, pos2, direction) {
    let y = pos2.y;
    let x = pos2.x;
    var addPositions = new Map();

    var i;
    var pos;
    switch(direction) {
        case LEFT:
            for(i = pos1.x; i >= x; i--) {
                pos = new Position(y, i);
                addPositions.set(pos.hash(), pos);
            }
            break;
        case RIGHT:
            for(i = pos1.x; i <= x; i++) {
                pos = new Position(y, i);
                addPositions.set(pos.hash(), pos);
            }
            break;
        case UP:
            for(i = pos1.y; i >= y; i--) {
                pos = new Position(i, x);
                addPositions.set(pos.hash(), pos);
            }
            break;
        case DOWN:
            for(i = pos1.y; i <= y; i++) {
                pos = new Position(i, x);
                addPositions.set(pos.hash(), pos);
            }
            break;
        default:
            break;
    }

    solutionPositions.splice(index, 1, addPositions);
}

function addBlock(puzzle, index, pos, direction) {
    let y = pos.y;
    let x = pos.x;

    var block;
    switch(direction) {
        case LEFT:
            puzzle[y][x-1] = BLOCK;
            block = new Position(y, x-1);
            break;
        case RIGHT:
            puzzle[y][x+1] = BLOCK;
            block = new Position(y, x+1);
            break;
        case UP:
            puzzle[y-1][x] = BLOCK;
			block = new Position(y-1, x);
            break;
        case DOWN:
            puzzle[y+1][x] = BLOCK;
			block = new Position(y+1, x);
            break;
        default:
            block = new Position(-1,-1);
            break;
    }

    solutionPositions[index].set(block.hash(),block);
	blockPositions.splice(index, 1, block);
	let isReach = reachPositions[index-1].has(block.hash());

	return isReach;
}

function removePosition(puzzle, index) {
    const pos = blockPositions[index];
    const y = pos.y;
    const x = pos.x;
    puzzle[y][x] = EMPTY;
}

//===================================================
// Path Generation
function generatePath(puzzle, height, width, length) {
    var startVertOrHori = Math.seededRandom(1) === 0 ? UPDOWN : LEFTRIGHT;
    if(tryStart(puzzle, height, width, length, startVertOrHori)) {
        return playerPositions[length];
    }
    startVertOrHori = startVertOrHori === UPDOWN ? LEFTRIGHT : UPDOWN;
    if(tryStart(puzzle, height, width, length, startVertOrHori)) {
        return playerPositions[length];
    }
    return null;
}

function tryStart(puzzle, height, width, length, vertOrHori) {
    let count = 0;
    let max = 0;

    var success = generateStartMove(puzzle, height, width, count, vertOrHori);
    if(!success) {
        return false;
    }

    while(count < (length-1)) {
        //console.log("Progress: "+count+" of "+length);
        //printSolution();
        if(count === (length-2)) {
            success = generateEndMove(puzzle, height, width, count, length, vertOrHori);
            if(success) {
                //printSolution();
                return true;
            }
        } else {
            success = generateSingleMove(puzzle, height, width, count, vertOrHori);
        }
        vertOrHori = vertOrHori === UPDOWN ? LEFTRIGHT : UPDOWN;
        if(success) {
            //console.log("Success "+count);
            count += 1;
        } else {
            //console.log("Failed "+count);
            count -= 1;
        }

        if(count > max) {
            max = count;
        }

        if(count === -1 || count <= (max - 2)) {
            return false;
        }
    }
    return false;
}

function generateStartMove(puzzle, height, width, index, vertOrHori) {
    let start = playerPositions[index];
    computeReachability(puzzle, height, width, new Map(), new Map(), index, start, -1);
    let options = computePossibleNextPositions(puzzle, height, width, index, start, vertOrHori);
    unusedNextPositions[index] = options;
    if((options[0].length === 0) && (options[1].length === 0)) {
        return false;
    }
    return true;
}

function generateSingleMove(puzzle, height, width, index, vertOrHori) {
    let current = playerPositions[index];

    var direction;
    var options = unusedNextPositions[index];
    if(options[0].length > 0 && options[1].length > 0) {
        if(Math.seededRandom(1) === 0) {
            direction = vertOrHori === UPDOWN ? UP : LEFT;
        } else {
            direction = vertOrHori === UPDOWN ? DOWN : RIGHT;
        }
    } else if(options[0].length > 0) {
        direction = vertOrHori === UPDOWN ? UP : LEFT;
    } else if(options[1].length > 0) {
        direction = vertOrHori === UPDOWN ? DOWN : RIGHT;
    } else {
        return false;
    }

    vertOrHori = vertOrHori === UPDOWN ? LEFTRIGHT : UPDOWN;
	var directionIdx = ((direction === LEFT) || (direction === UP)) ? LEFTUP : RIGHTDOWN;
	var possibleNext = options[directionIdx];
    var nextPos;
    do {
        if(possibleNext.length === 0) {
            direction = oppositeDirection(direction);
            directionIdx = directionIdx === RIGHTDOWN ? LEFTUP : RIGHTDOWN;
            possibleNext = unusedNextPositions[index][directionIdx];
            if(possibleNext.length === 0) {
                return false;
            }
        }

        nextPos = possibleNext.shift();
        options = computePossibleNextPositions(puzzle, height, width, index + 1, nextPos, vertOrHori);
    } while(options[0].length === 0 && options[1].length === 0);

    solution.splice(index,1,direction);

    addPosition(index+1, current, nextPos, direction);
    let isReach = addBlock(puzzle, index+1, nextPos, direction);

    unusedNextPositions.splice(index+1,1,options);
    playerPositions.splice(index+1,1,nextPos);
    playerPositions_hash.splice(index+1,1,nextPos.hash());
    
	if(!isReach) {
        computeReachability(puzzle, height, width, reachPositions[index], incomingDirections[index],  index+1, nextPos, direction);
	} else {
		let start = playerPositions[0];
		computeReachability(puzzle, height, width, new Map(), new Map(), index+1, start, -1);
	}
	return true;
}

function generateEndMove(puzzle, height, width, index, length, vertOrHori) {
    let current = playerPositions[index];

    var direction;
    var options = unusedNextPositions[index];
    if(options[0].length > 0 && options[1].length > 0) {
        if(Math.seededRandom(1) === 0) {
            direction = vertOrHori === UPDOWN ? UP : LEFT;
        } else {
            direction = vertOrHori === UPDOWN ? DOWN : RIGHT;
        }
    } else if(options[0].length > 0) {
        direction = vertOrHori === UPDOWN ? UP : LEFT;
    } else if(options[1].length > 0) {
        direction = vertOrHori === UPDOWN ? DOWN : RIGHT;
    } else {
        return false;
    }

    vertOrHori = vertOrHori === UPDOWN ? LEFTRIGHT : UPDOWN;
	var directionIdx = ((direction === LEFT) || (direction === UP)) ? LEFTUP : RIGHTDOWN;
    var possibleNext = options[directionIdx];

    const start = playerPositions[0];
    var nextPos;
    var testPos;
    do {
        if(possibleNext.length === 0) {
            direction = oppositeDirection(direction);
            directionIdx = directionIdx === RIGHTDOWN ? LEFTUP : RIGHTDOWN;
            possibleNext = unusedNextPositions[index][directionIdx];
            if(possibleNext.length === 0) {
                return false;
            }
        }
        nextPos = possibleNext.shift();
        switch(direction) {
            case LEFT:
                testPos = new Position(nextPos.y, nextPos.x - 1);
                break;
            case RIGHT:
                testPos = new Position(nextPos.y, nextPos.x + 1);
                break;
            case UP:
                testPos = new Position(nextPos.y - 1, nextPos.x);
                break;
            case DOWN:
                testPos = new Position(nextPos.y + 1, nextPos.x);
                break;
            default:
                testPos = new Position(nextPos.y, nextPos.x);
                break;
        }
        if(!solutionPositions[index].has(testPos.hash())) {
            puzzle[testPos.y][testPos.x] = BLOCK;
            computeReachability(puzzle, height, width, new Map(), new Map(), index+1, start, -1);
            options = computePossibleEndPositions(puzzle, height, width, length, index+1, nextPos, vertOrHori);
            if(options[0].length === 0 && options[1].length === 0) {
                puzzle[testPos.y][testPos.x] = EMPTY;
            }
        }
    } while(options[0].length === 0 && options[1].length === 0);

    solution.splice(index,1,direction);
    addPosition(index+1, current, nextPos, direction);
    addBlock(puzzle, index+1, nextPos, direction);
    playerPositions.splice(index+1,1,nextPos);
    playerPositions_hash.splice(index+1,1,nextPos.hash());

    current = nextPos;
    if(options[0].length > 0 && options[1].length > 0) {
        if(Math.seededRandom(1) === 0) {
            direction = vertOrHori === UPDOWN ? UP : LEFT;
            possibleNext = options[0];
        } else {
            direction = vertOrHori === UPDOWN ? DOWN : RIGHT;
            possibleNext = options[1];
        }
    } else if(options[0].length > 0) {
        direction = vertOrHori === UPDOWN ? UP : LEFT;
        possibleNext = options[0];
    } else if(options[1].length > 0) {
        direction = vertOrHori === UPDOWN ? DOWN : RIGHT;
        possibleNext = options[1];
    } else {
        return false;
    }
    
	nextPos = possibleNext.shift();
	addPosition(index+2, current, nextPos, direction);
    playerPositions.splice(index+2,1,nextPos);
    playerPositions_hash.splice(index+2,1,nextPos.hash());
	solution.splice(index+1,1,direction);
	puzzle[nextPos.y][nextPos.x] = END;

    return true;
}
//===================================================


//===================================================
// Fake Block Codes
function addFakePosition(puzzle, combined_allPositions, pos1, pos2, action) {
    const y = pos2.y;
    const x = pos2.x;

    let i;
    let new_pos;
    switch(action) {
        case LEFT:
            for(i = pos1.x; i >= x; i--) {
                if(puzzle[y][i] === EMPTY) {
                    new_pos = new Position(y, i);    
                    combined_allPositions.set(new_pos.hash(), new_pos);
                }
            }
            break;
        case RIGHT:
            for(i = pos1.x; i <= x; i++) {
                if(puzzle[y][i] === EMPTY) {
                    new_pos = new Position(y, i);    
                    combined_allPositions.set(new_pos.hash(), new_pos);
                }
            }
            break;
        case UP:
            for(i = pos1.y; i >= y; i--) {
                if(puzzle[i][x] === EMPTY) {
                    new_pos = new Position(i, x);    
                    combined_allPositions.set(new_pos.hash(), new_pos);
                }
            }
            break;
        case DOWN:
            for(i = pos1.y; i <= y; i++) {
                if(puzzle[i][x] === EMPTY) {
                    new_pos = new Position(i, x);    
                    combined_allPositions.set(new_pos.hash(), new_pos);
                }
            }
            break;
        default:
            break;
    }

    return combined_allPositions;
}

function pathDirection(pos1, pos2) {
    if(pos1.x === pos2.x) {
        if(pos1.y < pos2.y) {
            return DOWN;
        } else if(pos1.y > pos2.y) {
            return UP;
        }
    } else if(pos1.y === pos2.y) {
        if(pos1.x < pos2.x) {
            return RIGHT;
        } else if(pos1.x > pos2.x) {
            return LEFT;
        }
    }
    return -1;
}

function addFakeBlocks(puzzle, height, width, start, end, length, numBlocks) {
    let fake_blocks = [];

    computeReachability(puzzle, height, width, new Map(), new Map(), 0, start, -1);
    let old_reachSet = reachPositions[0];
    let old_incomingSet = incomingDirections[0];

    for(let i = 0; i < numBlocks; i++) {
        let reachSet = old_reachSet;
        let incomingSet = old_incomingSet;
        
        let combined_allPositions = new Map();               
        for(let j = 0; j < solutionPositions.length; j++) {
            let map = solutionPositions[j];
            for(const pos_hash of map.keys()) {
                combined_allPositions.set(pos_hash,map[pos_hash]);
            }
        }
        
        let reachNotAll = new Map();
        let possible = [];
        for(const pos_hash of incomingSet.keys()) {
            if(!combined_allPositions.has(pos_hash)) {
                let arr = pos_hash.split(",");
                let pos = new Position(Number(arr[0]),Number(arr[1]));
                reachNotAll.set(pos_hash,pos);
                possible.push(pos);
            }
        }
        
        let update = false;
        while(possible.length !== 0 && !update) {
            let pos = possible.splice(Math.seededRandom(possible.length - 1),1)[0];
            let arr = incomingSet.get(pos.hash()).split(",");
            let pos2 = new Position(Number(arr[0]),Number(arr[1]));
            let action = pathDirection(pos2,pos);

            let block;

            const y = pos.y;
            const x = pos.x;
            switch(action) {
                case LEFT:
                    if((x - 1) < 0) {
                        continue;
                    }
                    block = new Position(y, x-1);
                    break;
                case RIGHT:
                    if((x + 1) >= width) {
                        continue;
                    }
                    block = new Position(y, x+1);
                    break;
                case UP:
                    if((y - 1) < 0) {
                        continue;
                    }
                    block = new Position(y-1, x);
                    break;
                case DOWN:
                    if((x + 1) < height) {
                        continue;
                    }
                    block = new Position(y+1, x);
                    break;
                default:
                    break;
            }

            if(combined_allPositions.has(block) || puzzle[block.y][block.x] !== EMPTY || puzzle[pos.y][pos.x] !== EMPTY) {
                continue;
            }

            puzzle[block.y][block.x] = BLOCK;
            computeReachability(puzzle, height, width, new Map(), new Map(), 0, start, -1);
            reachSet = reachPositions[0];
            incomingSet = incomingDirections[0];

            if(reachSet.get(end.hash()) === length) {
                update = true;
                fake_blocks.push(block);
                combined_allPositions = addFakePosition(puzzle, combined_allPositions,  pos, old_incomingSet.get(pos.hash()), action);
                old_reachSet = reachSet;
                old_incomingSet = incomingSet;
            } else {
                puzzle[block.y][block.x] = EMPTY;
                reachSet = old_reachSet;
                incomingSet = old_incomingSet;
            }
        }
        if(possible.length === 0) {
            return fake_blocks;
        }
    }
    return fake_blocks;
}
//===================================================

function makePuzzle(seed, fake, width, height) {
    // Seed Random Generator
    Math.seed = seed;

    //Math.seed = 728802;

    // Set Length of Solution
    let length;
    
    if(width >= height) {
        length = ((height * 3) / 4) + Math.seededRandom(height / 2);
    } else {
        length = ((width * 3) / 4) + Math.seededRandom(width / 2);
    }

    //length = 25;

    console.log("Make Puzzle");
    console.log("SEED: "+seed);
    console.log("FAKE: "+fake);
    console.log("WIDTH: "+width);
    console.log("HEIGHT: "+height);
    console.log("LENGTH: "+length);

    var remainingStarts = [];
    for(var y = 0; y < height; y++) {
        for(var x = 0; x < width; x++) {
            remainingStarts.push(new Position(y, x));
        }
    }

    var start = new Position(0,0);
    var goal;
    do {

        // Initialize Puzzle Array
        var puzzle = [];
        for(var i = 0; i < height; i++) {
            puzzle[i] = [];
            for(var j = 0; j < width; j++) {
                puzzle[i].push(0);
            }
        }

        // Initialize global Structures
        solution = [];
        solutionPositions = [];
        playerPositions = [];
        playerPositions_hash = [];
        blockPositions = [];
        reachPositions = [];
        incomingDirections = [];
        unusedNextPositions = [];

        for(i = 0; i < length; i++) {
            solution.push(-1);
            solutionPositions.push(new Map());
            playerPositions.push(new Position(-1,-1));
            playerPositions_hash.push("-1,-1");
            blockPositions.push(new Position(-1,-1));
            reachPositions.push(new Map());
            incomingDirections.push(new Map());
            unusedNextPositions.push([]);
        }

        start = remainingStarts.splice(Math.seededRandom(remainingStarts.length - 1), 1)[0];
        puzzle[start.y][start.x] = START;

        solutionPositions[0].set(start.hash(), start);
        playerPositions.splice(0,1,start);
        playerPositions_hash.splice(0,1,start.hash());
        blockPositions.splice(0,1,start);

        goal = generatePath(puzzle, height, width, length);
    } while (goal == null &&  remainingStarts.length > 0);

    if(goal == null) {
        return null;
    }

    //Remove Start Position from Block Positions
    blockPositions.splice(0,1);
    printSolution();
    
    // Add Fake Blocks Here if "fake" is true
    if(fake) {
        let numBlocks = Math.floor(length / 2) + Math.seededRandom(Math.floor(length / 4));
        let fake_blocks = addFakeBlocks(puzzle, height, width, start, goal, length, numBlocks)
        //console.log(blockPositions);
        //console.log(fake_blocks);
        blockPositions = blockPositions.concat(fake_blocks);
        //console.log(blockPositions);
    }
    

    return {
        start: start,
        goal: goal,
        blocks: blockPositions
    }
}

/*
function makePuzzle(seed, fake, width, height) {
    // Seed Random Generator
    Math.seed = seed;
    
    console.log("Make Puzzle");
    console.log(seed);
    console.log(fake);
    console.log(width);
    console.log(height);

    var leftup = [0,1,2,3,4,5,6,7,8,9];
    console.log(leftup);
    var change;
    var temp;
    for(let i = 0; i < leftup.length; i++) {
        change = i + Math.seededRandom(leftup.length - i - 1);
        temp = leftup[change];
        leftup.splice(change, 1, leftup[i]);
        leftup.splice(i, 1, temp);
    }
    console.log(leftup);

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
*/
var PuzzleMaker = {
    makePuzzle
}

module.exports = PuzzleMaker;