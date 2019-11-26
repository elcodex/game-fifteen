const EMPTY_NUMBER = 16;
const BOARD_SIZE = 4;

const inversionsCount = numbers => {
    let count = 0;
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (numbers[i] > numbers[j] && i < j) count++;
        }  
    }
    return count;    
}
const shuffle = () => {
    let numbers = [...new Array(EMPTY_NUMBER-1)].map((_, i) => i+1);
    for (let i = 0; i < numbers.length; i++) {
        const j = i + Math.floor(Math.random() * (numbers.length - i));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    numbers.push(EMPTY_NUMBER);
    return numbers; 
}
const goodShuffle = _ => {
    let numbers = shuffle();
    while (inversionsCount(numbers) % 2 !== 0) {
        numbers = shuffle();
    }
    return numbers;
}

const game = values => {
  let numbers = [...values];
  return {
    turn: number => {
        const i1 = numbers.indexOf(number);
        const i2 = numbers.indexOf(EMPTY_NUMBER);
        numbers[i1] = EMPTY_NUMBER;
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
    let lastTile = document.querySelector(`[id="${EMPTY_NUMBER-1}"]`);
    lastTile.classList = ['missing-tile'];
    lastTile.innerText = '';
    lastTile.onclick = doNothing;
    [...document.getElementsByClassName('tile')]
        .forEach((tile,i) => {
            tile.innerText = values[i];
            tile.onclick = doNothing;
        });
}
const moveTile = (game15, emptyId) => {
    return e => {
        let emptyTile = document.querySelector(".missing-tile");
        let number = e.target.innerHTML;
        emptyTile.classList = ['tile'];
        emptyTile.innerText = number;
        e.target.classList = ['missing-tile'];
        e.target.innerText = '';
        setClicks(emptyId, doNothing);
        game15.turn(number * 1);
        if (!game15.isOver()) 
            setClicks(e.target.id, moveTile(game15, e.target.id));
        else {    //winAction
            document.getElementById('congrats').style.display = 'block';
        }   
    }
}
const doNothing = () => {}

const setClicks = (emptyId, action) => {
    let i = Math.floor(emptyId / BOARD_SIZE);
    let j = emptyId % BOARD_SIZE;
    [{di:-1, dj:0, move: 'bottom'}, {di:0, dj:1, move: 'left'}, 
     {di:1, dj:0, move: 'top'}, {di:0, dj:-1, move: 'right'}]
        .forEach(({di, dj}) => {
            if (i+di >= 0 && i+di < BOARD_SIZE && j+dj >= 0 && j+dj < BOARD_SIZE) {
                const index = (i+di) * BOARD_SIZE + (j+dj);
                let tile = document.querySelector(`[id="${index}"]`);
                tile.onclick = action;
            }
    });
}
const newGame = () => {
    document.getElementById('congrats').style.display = 'none';
    let boardValues = goodShuffle();
    let game15 = game(boardValues);
    while (game15.isOver()) {
        boardValues = goodShuffle();
        game15 = game(boardValues);
    }
    initializeBoard(boardValues);
    const emptyId = EMPTY_NUMBER-1;
    setClicks(emptyId, moveTile(game15, emptyId));
}

newGame();

document.getElementById('btn-newgame').onclick = newGame;
