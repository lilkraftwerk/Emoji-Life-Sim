import _shuffle from "lodash.shuffle";
import _random from "lodash.random";

const FILENAME = `src/sprites.png`;
const WIDTH = 20;
const HEIGHT = 20;
const MAX_DIMENSION = 600;

let spritesheet;

export const loadSpriteSheet = () => {
  const img = new Image();
  img.onload = () => {
    spritesheet = img;
    loadAllImages();
  };
  img.src = FILENAME;
};

const loadOneImage = (x, y) => {
  const tempCanvas = document.createElement("canvas");
  const tempContext = tempCanvas.getContext("2d");

  tempCanvas.width = 20;
  tempCanvas.height = 20;
  tempContext.drawImage(
    spritesheet,
    x,
    y,
    HEIGHT,
    WIDTH
    // 0,
    // 0,
    // tempCanvas.width,
    // tempCanvas.height
  );

  const emojiImg = new Image();
  emojiImg.onload = () => {};
  emojiImg.src = tempCanvas.toDataURL();
};

const loadAllImages = () => {
  for (let currentX = 0; currentX < MAX_DIMENSION; currentX += WIDTH) {
    for (let currentY = 0; currentY < MAX_DIMENSION; currentY += HEIGHT) {
      loadOneImage(currentX, currentY);
    }
  }
};
