import { EMOJI_SIZE, loadingImage } from "./Globals";

import { convertRowColumnToCoords, setUpActors } from "./Life";

let rowCount;
let columnCount;

let context;
let canvas;

let spriteCanvas;
let spriteContext;

let spriteCanvasReversed;
let spriteContextReversed;

const FILENAME = "src/sprites.png";

let actors = [];

const actorWorker = new Worker(new URL("./Actor.worker.js", import.meta.url));

const loadSpritesheets = (callback = () => {}) => {
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
    callback();
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

const draw = () => {
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
};

const setupCanvas = () => {
  columnCount = Math.ceil(canvas.width / EMOJI_SIZE);
  rowCount = Math.ceil(canvas.height / EMOJI_SIZE);
  actors = setUpActors({
    rowCount,
    columnCount,
    carCount: 5,
    plantCount: 100,
    animalCount: 50,
    rockCount: 10,
  });

  actorWorker.onmessage = (event) => {
    const { value } = event.data;
    actors = value;
    draw(actors);

    actorWorker.postMessage({
      message: "UPDATE_ACTORS",
      value: actors,
      rowCount,
      columnCount,
    });
  };

  actorWorker.postMessage({
    message: "UPDATE_ACTORS",
    value: actors,
    rowCount,
    columnCount,
  });
};

const setLoadingScreen = () => {
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const loadingText = new Image();
  loadingText.onload = () => {
    for (
      let currentX = -loadingImage.width;
      currentX < canvas.width + loadingImage.width;
      currentX += loadingImage.width
    ) {
      for (
        let currentY = -loadingImage.height;
        currentY < canvas.height + loadingImage.width;
        currentY += loadingImage.height
      ) {
        context.drawImage(loadingText, currentX, currentY);
      }
    }
    loadSpritesheets(setupCanvas);
  };
  loadingText.src = loadingImage.data;
};

setLoadingScreen();
