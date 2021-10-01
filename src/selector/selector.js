const EMOJI_SIZE = 20;

let rowCount;
let columnCount;

let context;
let canvas;

let spriteCanvas;
let spriteContext;

let spriteCanvasReversed;
let spriteContextReversed;

let selectedEmojis = [];

const FILENAME = `src/sprites.png`;

const loadSpritesheets = () => {
  spriteCanvas = document.createElement("canvas");
  spriteContext = spriteCanvas.getContext("2d");
  spriteCanvas.width = 600;
  spriteCanvas.height = 600;

  const spritesheet = new Image();

  spritesheet.onload = () => {
    spriteContext.drawImage(spritesheet, 0, 0, 600, 600);
    setupCanvas();
  };
  spritesheet.src = FILENAME;
};

const setupCanvas = () => {
  canvas = document.getElementById("myCanvas");
  context = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = 600;

  context.drawImage(spriteCanvas, 0, 0, 600, 600);

  columnCount = Math.ceil(canvas.width / EMOJI_SIZE);
  rowCount = Math.ceil(canvas.height / EMOJI_SIZE);

  function roundToNearestEmojiSlot(value, interval = 20) {
    return Math.floor(value / interval) * interval;
  }

  function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const xRounded = roundToNearestEmojiSlot(x);
    const yRounded = roundToNearestEmojiSlot(y);
    const row = yRounded / 20;
    const column = xRounded / 20;

    document.getElementById("textOne").value = JSON.stringify([column, row]);
    selectedEmojis.push([column, row]);
    document.getElementById("textTwo").value = JSON.stringify(selectedEmojis);
  }

  canvas.addEventListener("mousedown", function (e) {
    getCursorPosition(canvas, e);
  });
};

loadSpritesheets();
