const BOARD_SIZE = 4;
const NUMBER_SEPARATOR = ",";
const STORAGE_ITEM = "board15";

const TILE_CLASS = 'tile';
const MISSING_TILE_CLASS = 'missing-tile';

// interface
const initializeBoard = values => {
    let emptyTile = document.querySelector("." + MISSING_TILE_CLASS);
    if (emptyTile) {
        emptyTile.classList = [TILE_CLASS];
    }
        
    [...document.getElementsByClassName(TILE_CLASS)]
        .forEach((tile, i) => {
            if (values[i] === EMPTY_NUMBER) {
                tile.classList = [MISSING_TILE_CLASS];
                tile.innerText = '';
            }
            else {
                tile.innerText = values[i];
            }
            tile.onclick = doNothing;
        });
}

const moveTile = (game15) => {
    return e => {
        let emptyTile = document.querySelector("." + MISSING_TILE_CLASS);
        const number = e.target.innerHTML;
        if (emptyTile) emptyTile.classList = [TILE_CLASS];
        
        const board = game15.turn(number * 1);
        [...document.getElementsByClassName(TILE_CLASS)].forEach((tile, i) => {
            if (board[i] === EMPTY_NUMBER) {
                tile.classList = [MISSING_TILE_CLASS];
                tile.innerText = '';
            }
            else {
                if (tile.innerText !== board[i].toString()) {
                    tile.innerText = board[i];
                }
            }
            tile.onclick = doNothing;
        });

        if (!game15.isOver()) {
            setClicks(e.target.id, moveTile(game15));
            try {
                localStorage.setItem(STORAGE_ITEM, board.join(NUMBER_SEPARATOR));
            } catch(e) {}
        }
        else {    //winAction
            document.getElementById('congrats').style.display = 'block';
            try {
                localStorage.removeItem(STORAGE_ITEM);
            } catch(e) {}
        }   
    }
}

const doNothing = () => {}

const setClicks = (emptyId, action) => {
    let i = Math.floor(emptyId / BOARD_SIZE);
    let j = emptyId % BOARD_SIZE;

    [{di: -1, dj: 0, move: 'bottom'}, {di: 0, dj: 1, move: 'left'}, 
     {di: 1, dj: 0, move: 'top'}, {di: 0, dj: -1, move: 'right'}]
        .forEach(({di, dj}) => {
            if (i+di >= 0 && i+di < BOARD_SIZE && j+dj >= 0 && j+dj < BOARD_SIZE) {
                const index = (i+di) * BOARD_SIZE + (j+dj);
                let tile = document.querySelector(`[id="${index}"]`);
                tile.onclick = action;
            }
    });
}

const newGame = (storageBoard) => {
    document.getElementById('congrats').style.display = 'none';
    
    let boardValues = storageBoard ? storageBoard : goodShuffle();

    let game15 = game(boardValues);
    while (game15.isOver()) {
        boardValues = goodShuffle();
        game15 = game(boardValues);
    }
    initializeBoard(boardValues);
    const emptyId = boardValues.indexOf(EMPTY_NUMBER);
    setClicks(emptyId, moveTile(game15));
}

let storageBoard = undefined;

try {
    const boardString = localStorage.getItem(STORAGE_ITEM);
    if (boardString) {
        const board = boardString.split(NUMBER_SEPARATOR).map(value => parseInt(value));
        let isValidBoard = 
            board.length === EMPTY_NUMBER &&
            board.every(number => !isNaN(number) && number > 0 && number <= EMPTY_NUMBER) &&
            [...new Set(board)].length === EMPTY_NUMBER &&
            isGoodShuffle(board);
        if (isValidBoard) {
            storageBoard = board;
        }
    }
} catch(e) {};

newGame(storageBoard);

document.getElementById('btn-newgame').onclick = e => newGame();
