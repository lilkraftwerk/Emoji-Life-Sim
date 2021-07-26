import _shuffle from "lodash.shuffle";
import _random from "lodash.random";

const WINDOW_HEIGHT = 1000;
const WINDOW_WIDTH = 1200;
const OVERALL_COUNT = 100;

function getRandomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function createMatrixLine(
  startX,
  startY,
  emojiWidth,
  minHeight = 10,
  maxHeight = 40,
  availableEmojiList = []
) {
  const totalHeight = _random(maxHeight) + minHeight;
  const currentState = [];
  const shuffled = _shuffle(availableEmojiList);

  for (let i = 0; i < totalHeight; i += 1) {
    currentState.push(shuffled[i]);
  }

  const currentY = -(totalHeight * emojiWidth) - emojiWidth * 2;

  const matrixLine = {
    startX,
    startY,
    currentY,
    emojiWidth,
    ticker: 0,
    alive: true,
    randomInterval: _random(MAX_RANDOM_INTERVAL) + MIN_RANDOM_INTERVAL,
    totalHeight,
    availableEmojiList,
    speed: 5,
    currentState,
  };

  return matrixLine;
}

function updateMatrixLine(lineInput) {
  const {
    currentState,
    ticker,
    speed,
    currentY,
    emojiWidth,
    randomInterval,
    availableEmojiList,
  } = lineInput;

  let newState = [...currentState];

  const changes = {
    ticker: ticker + 1,
  };

  if (currentY > WINDOW_HEIGHT) {
    changes.alive = false;
  }

  if (ticker % randomInterval === 0) {
    // replace one in the middle
    const length = newState.length;
    const min = 5;
    const max = length - 5;
    const newIndex = getRandomInt(min, max);
    const shuffled = _shuffle(availableEmojiList);
    newState[newIndex] = shuffled[0];
  }

  if (ticker % speed === 0) {
    // add new to the end of the array, remove from the front
    newState = newState.slice(1);
    const shuffled = _shuffle(availableEmojiList);
    newState.push(shuffled[0]);
    // changes.currentY = currentY + emojiWidth;
    changes.currentY = currentY + speed;
  }

  return {
    ...lineInput,
    ...changes,
    currentState: newState,
  };
}

function updateAllLines(allLines) {
  const newLines = allLines.map((currentLine) => {
    return updateMatrixLine(currentLine);
  });

  const filteredLines = newLines.filter((currentLine) => {
    return currentLine.alive == true;
  });

  // const lineCountDifference = OVERALL_COUNT - filteredLines.length;
  // const startingPositions = _shuffle(getPossibleStartingXPositions(16));

  // if (startingPositions.length === 0) {
  //   return filteredLines;
  // }
  // for (let i = 0; i < lineCountDifference; i += 1) {
  //   const newX = startingPositions.shift();
  //   const newLine = createMatrixLine(newX, -300, EMOJI_WIDTH, 25, 50, loadedEmojis);
  //   newLine.create();
  //   filteredLines.push(newLine);
  // }

  return filteredLines;
}

onmessage = function (event) {
  const currentLines = event.data;
  const newLines = updateAllLines(currentLines);
  self.postMessage(newLines);
  // var canvas = evt.data.canvas;
  // var gl = canvas.getContext("webgl");
};
