import _shuffle from "lodash.shuffle";
import _random from "lodash.random";
import { colors } from "./Utils.js";
const FILENAME = `src/sprites.png`;

let context;
let canvas;
let lines = [];
let matrixLines = [];

const spriteCanvas = document.createElement("canvas");
const spriteContext = spriteCanvas.getContext("2d");
spriteCanvas.width = 600;
spriteCanvas.height = 600;

const EMOJI_COUNT = 50;
const EMOJI_SIZE = 20;

const spritesheet = new Image();
spritesheet.onload = () => {
  spriteContext.drawImage(spritesheet, 0, 0, 600, 600);
  setupCanvas();
};
spritesheet.src = FILENAME;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getEmojiCoordsOnSpritesheet = () => {
  const xInd = _random(30) * 20;
  const yInd = _random(29) * 20;
  return [xInd, yInd];
};

const EMOJI_WIDTH = 20;

const getPossibleStartingXPositions = () => {
  const usedStartXCoords = matrixLines.map((currentLine) => {
    return currentLine.startX;
  });

  const possibilities = [];
  for (let i = 0; i < window.innerWidth; i += EMOJI_WIDTH) {
    if (usedStartXCoords.indexOf(i) == -1) {
      possibilities.push(i);
    }
  }
  return possibilities;
};

function createMatrixLine(startX) {
  const totalHeight = getRandomInt(15, 50);
  const currentState = [];

  for (let i = 0; i < totalHeight; i += 1) {
    const emojiCoords = getEmojiCoordsOnSpritesheet();
    currentState.push(emojiCoords);
  }

  const currentY = -(totalHeight * EMOJI_WIDTH) - EMOJI_WIDTH * 2;
  const startY = currentY;
  // const startY = 30;
  // const currentY = 30;

  const matrixLine = {
    startX,
    startY,
    currentY,
    ticker: 0,
    alive: true,
    randomInterval: getRandomInt(1, 1000),
    totalHeight,
    speed: getRandomInt(2, 5),
    currentState,
  };

  return matrixLine;
}

const updateMatrixLines = () => {
  const availX = [];
  const filteredLines = matrixLines.filter((currentLine) => {
    if (currentLine.alive == false) {
      availX.push(currentLine.startX);
    }
    return currentLine.alive == true;
  });

  for (let i = 0; i < filteredLines.length - 1; i += 1) {
    const currentLine = filteredLines[i];
    updateMatrixLine(currentLine);
  }

  const shuffledX = _shuffle(availX);
  for (let i = 0; i < availX.length; i += 1) {
    const newX = shuffledX.shift();
    const newLine = createMatrixLine(newX);
    filteredLines.push(newLine);
  }

  matrixLines = filteredLines;
  console.log(matrixLines.length);
};

function updateMatrixLine(lineInput) {
  lineInput.currentY = lineInput.currentY + lineInput.speed;

  if (lineInput.currentY > canvas.height) {
    lineInput.alive = false;
  }

  return;
}

function drawMatrixLine(line) {
  const { startX, currentY, currentState, emojiWidth, color } = line;
  currentState.forEach((emojiCoords, index) => {
    const [emojiX, emojiY] = emojiCoords;
    context.globalAlpha = 1;

    context.fillStyle = color;
    if (index === 0) {
      context.globalAlpha = 0.1;
    }
    if (index === 1) {
      context.globalAlpha = 0.2;
    }
    if (index === 2) {
      context.globalAlpha = 0.3;
    }
    if (index === 3) {
      context.globalAlpha = 0.4;
    }
    if (index === 4) {
      context.globalAlpha = 0.5;
    }
    if (index === 5) {
      context.globalAlpha = 0.6;
    }
    if (index === 6) {
      context.globalAlpha = 0.6;
    }
    if (index === 7) {
      context.globalAlpha = 0.7;
    }
    if (index === 8) {
      context.globalAlpha = 0.8;
    }
    if (index === 9) {
      context.globalAlpha = 0.9;
    }

    const newY = currentY + emojiWidth * index;
    context.drawImage(
      spriteCanvas,
      emojiX,
      emojiY,
      EMOJI_SIZE,
      EMOJI_SIZE,
      startX,
      currentY + EMOJI_SIZE * index,
      EMOJI_SIZE,
      EMOJI_SIZE
    );

    if (index === currentState.length - 1) {
      context.globalAlpha = 0.5;
      context.fillRect(startX, newY, emojiWidth, emojiWidth);
      context.globalAlpha = 1;
    }
  });
}

const generateMatrixLines = () => {
  const possibilities = _shuffle(getPossibleStartingXPositions());

  for (let i = 0; i < EMOJI_COUNT; i += 1) {
    const startingX = possibilities.shift();
    matrixLines.push(createMatrixLine(startingX));
  }
  console.log(matrixLines);
};

const setupCanvas = () => {
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  generateMatrixLines();
  drawMatrixLines();
};

const drawMatrixLines = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < matrixLines.length - 1; i += 1) {
    const currentLine = matrixLines[i];
    drawMatrixLine(currentLine);
  }
  updateMatrixLines();
  requestAnimationFrame(drawMatrixLines);
};
