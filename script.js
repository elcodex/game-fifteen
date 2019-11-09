const emptyNumber = 16;
const inversions = numbers => {
    let count = 0;
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (numbers[i] > numbers[j] && i < j) count++;
        }  
    }
    return count;    
}
const shuffle = _ => {
    let numbers = [...new Array(15)].map((_, i) => i+1);
    for (let i = 0; i < numbers.length; i++) {
        const j = i + Math.floor(Math.random() * (numbers.length - i));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    numbers.push(emptyNumber);
    return numbers; 
}
const goodShuffle = _ => {
    let numbers = shuffle();
    while (inversions(numbers) % 2 !== 0) {
        numbers = shuffle();
    }
    return numbers;
}

const game = values => {
  let numbers = [...values];
 // numbers.push(emptyNumber);
  return {
    turn: number => {
        const i1 = numbers.indexOf(number);
        const i2 = numbers.indexOf(emptyNumber);
        numbers[i1] = emptyNumber;
        numbers[i2] = number;
        return numbers; 
    },
    isOver: _ => {
        let done = numbers.every((number, i) => number === i+1)
        return done; 
    }
  }
}

// interface
const initializeBoard = values => {
    let emptyTile = document.querySelector(".missing-tile");
    emptyTile.classList = ['tile'];
    let lastTile = document.querySelector('[id="15"]');
    lastTile.classList = ['missing-tile'];
    lastTile.innerHTML = '';
    lastTile.onclick = doNothing;
    [...document.getElementsByClassName('tile')]
        .forEach((tile,i) => {
            tile.innerHTML = values[i];
            tile.onclick = doNothing;
        });
}
const moveTile = (game15, emptyId) => {
    return e => {
       // console.log('click', e.target.innerHTML);
        let emptyTile = document.querySelector(".missing-tile");
        let number = e.target.innerHTML;
        emptyTile.classList = ['tile'];
        emptyTile.innerHTML = number;
        e.target.classList = ['missing-tile'];
        e.target.innerHTML = '';
        clicks(emptyId, doNothing);
        game15.turn(number * 1);
        if (!game15.isOver()) 
            clicks(e.target.id, moveTile(game15, e.target.id));
        else {    //winAction
            document.getElementsByTagName('p')[0].style.visibility = 'visible';
        }   
    }
}
const doNothing = _ => {}

const clicks = (emptyId, action) => {
    let i = Math.floor(emptyId / 4);
    let j = emptyId % 4;
    [{di:-1, dj:0, move: 'bottom'}, {di:0, dj:1, move: 'left'}, {di:1, dj:0, move: 'top'}, {di:0, dj:-1, move: 'right'}].forEach(({di,dj,move}) => {
        if (i+di >= 0 && i+di < 4 && j+dj >=0 && j+dj < 4) {
            const index = (i+di) * 4 + (j+dj);
            let tile = document.querySelector(`[id="${index}"]`);
            tile.onclick = action;
        }
    });
}
const newGame = _ => {
    document.getElementsByTagName('p')[0].style.visibility = 'hidden';
    let boardValues = goodShuffle();
    let game15 = game(boardValues);
    while (game15.isOver()) {
        boardValues = goodShuffle();
        game15 = game(boardValues);
    }
    initializeBoard(boardValues);
    const emptyId = emptyNumber-1;
    clicks(emptyId, moveTile(game15, emptyId));
}

newGame();

document.getElementsByTagName('button')[0].onclick = newGame;
