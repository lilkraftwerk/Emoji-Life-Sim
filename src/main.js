import { EMOJI_SIZE, loadingImage } from "./Globals";
import {
  convertRowColumnToCoords,
  setUpActors,
  getEmojiAtLocation,
  getEmojiAtLocationReversed,
} from "./Life";
import scaleCanvas from "./ScaleCanvas";

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

actorWorker.onmessage = (event) => {
  const { value } = event.data;
  actors = value;
};

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

  requestAnimationFrame(() => {
    draw(actors);
  });
};

const clearActorsInWorker = () => {
  actorWorker.postMessage({
    message: "CLEAR_ACTORS",
  });
};

const sendActorsForUpdate = (newActors) => {
  actorWorker.postMessage({
    message: "UPDATE_ACTORS",
    value: newActors,
    rowCount,
    columnCount,
  });
};

const setupSimulation = () => {
  clearActorsInWorker();

  columnCount = Math.ceil(canvas.width / EMOJI_SIZE);
  rowCount = Math.ceil(canvas.height / EMOJI_SIZE);

  const totalSquares = columnCount * rowCount;

  const getWeightedCount = (factor) => {
    return Math.ceil(totalSquares * factor);
  };

  actors = setUpActors({
    rowCount,
    columnCount,
    carCount: getWeightedCount(0.01),
    plantCount: getWeightedCount(0.05),
    animalCount: getWeightedCount(0.03),
    rockCount: getWeightedCount(0.03),
  });

  sendActorsForUpdate(actors);
  draw(actors);
};

const updateCanvas = () => {
  if (!canvas) {
    canvas = document.getElementById("myCanvas");
  }
  if (!context) {
    context = canvas.getContext("2d");
  }

  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  scaleCanvas(canvas, context, newWidth, newHeight);

  canvas.width = newWidth;
  canvas.height = newHeight;
};

const setLoadingScreen = () => {
  updateCanvas();

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
    loadSpritesheets(setupSimulation);
  };
  loadingText.src = loadingImage.data;
};

const setResizeHandler = (resizeCallback, timeout = 200) => {
  let timerId;
  window.addEventListener("resize", () => {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
    timerId = setTimeout(() => {
      timerId = undefined;
      resizeCallback();
    }, timeout);
  });
};

const resizeCallback = () => {
  updateCanvas();
  setupSimulation();
};

window.addEventListener("orientationchange", () => {
  resizeCallback();
});

setResizeHandler(resizeCallback, 250);
setLoadingScreen();
