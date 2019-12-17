
function makePuzzle(seed, fake, width, height) {
    
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