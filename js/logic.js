const EMPTY_NUMBER = 16;

const inversionsCount = numbers => {
    let count = 0;
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < numbers.length; j++) {
            if (numbers[i] !== EMPTY_NUMBER &&
                numbers[j] !== EMPTY_NUMBER &&
                numbers[i] > numbers[j] && i < j) count++;
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

const isGoodShuffle = numbers => {
    return inversionsCount(numbers) % 2 === 0;
}

const goodShuffle = _ => {
    let numbers = shuffle();
    while (!isGoodShuffle(numbers)) {
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