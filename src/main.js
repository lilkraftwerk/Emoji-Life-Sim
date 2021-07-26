import { shuffle } from "lodash";
import { NEUT, DEAD, LIVE, EMOJI_SIZE } from "./Globals";
import { getRandomInt } from "./Utils.js";
import {
  applyChanges,
  convertRowColumnToCoords,
  getBoardChanges,
  setUpBoard,
  setUpActors,
  updateActors,
} from "./Life";
import { makeAnimal, makeRock } from "./Models";

let rowCount;
let columnCount;

let context;
let canvas;

let spriteCanvas;
let spriteContext;

let spriteCanvasReversed;
let spriteContextReversed;

const FILENAME = `src/sprites.png`;

const loadSpritesheets = () => {
  spriteCanvas = document.createElement("canvas");
  spriteContext = spriteCanvas.getContext("2d");
  spriteCanvas.width = 600;
  spriteCanvas.height = 600;

  spriteCanvasReversed = document.createElement("canvas");
  spriteContextReversed = spriteCanvasReversed.getContext("2d");
  spriteCanvasReversed.width = 600;
  spriteCanvasReversed.height = 600;

  const spritesheet = new Image();

  spritesheet.onload = () => {
    spriteContext.drawImage(spritesheet, 0, 0, 600, 600);
    spriteContextReversed.scale(-1, 1);
    spriteContextReversed.drawImage(spritesheet, -600, 0, 600, 600);
    setupCanvas();
  };
  spritesheet.src = FILENAME;
};

export const getEmojiAtLocation = (emojiRow, emojiColumn) => {
  const xInd = emojiRow * 20;
  const yInd = emojiColumn * 20;
  return [xInd, yInd];
};

export const getEmojiAtLocationReversed = (emojiRow, emojiColumn) => {
  const xInd = Math.abs(29 - emojiRow) * 20;
  const yInd = emojiColumn * 20;
  return [xInd, yInd];
};

const generateTestActors = () => {
  const tests = [];
  for (let i = 0; i < 100; i += 1) {
    const row = getRandomInt(0, 50);
    const column = getRandomInt(0, 50);
    const spriteX = getRandomInt(1, 20);
    const spriteY = getRandomInt(1, 20);
    tests.push({
      row,
      column,
      sprite: [spriteX, spriteY],
    });
  }
  return tests;
};

const draw = (actors) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  actors.forEach((currentActor) => {
    const { sprite, row, column, flipSprite } = currentActor;
    const [emojiRow, emojiColumn] = sprite;

    const [xCoord, yCoord] = convertRowColumnToCoords(row, column, EMOJI_SIZE);

    if (flipSprite) {
      const [emojiSpriteCoordX, emojiSpriteCoordY] = getEmojiAtLocationReversed(
        emojiRow,
        emojiColumn
      );

      context.drawImage(
        spriteCanvasReversed,
        emojiSpriteCoordX,
        emojiSpriteCoordY,
        EMOJI_SIZE,
        EMOJI_SIZE,
        xCoord,
        yCoord,
        EMOJI_SIZE,
        EMOJI_SIZE
      );
    } else {
      const [emojiSpriteCoordX, emojiSpriteCoordY] = getEmojiAtLocation(
        emojiRow,
        emojiColumn
      );

      context.drawImage(
        spriteCanvas,
        emojiSpriteCoordX,
        emojiSpriteCoordY,
        EMOJI_SIZE,
        EMOJI_SIZE,
        xCoord,
        yCoord,
        EMOJI_SIZE,
        EMOJI_SIZE
      );
    }
  });

  requestAnimationFrame(() => {
    const newActors = updateActors(actors, rowCount, columnCount);
    draw(newActors);
  });
};

const setupCanvas = () => {
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  columnCount = Math.ceil(canvas.width / EMOJI_SIZE);
  rowCount = Math.ceil(canvas.height / EMOJI_SIZE);
  const actors = setUpActors(rowCount, columnCount, 200, 200, 200);

  draw(actors);
};

loadSpritesheets();
