import { sample } from "lodash";

import { ANIMAL, PLANT, GROUND, ROCK } from "./Globals";

const coinFlipBoolean = () => {
  return Math.random() < 0.5;
};

const getdefaultValues = () => {
  return {
    alive: true,
    action: null,
    flipSprite: coinFlipBoolean(),
  };
};

const animalSprites = [
  [10, 0],
  [10, 1],
  [10, 2],
  [10, 3],
  [10, 4],
  [10, 6],
  [10, 8],
  [10, 9],
  [9, 9],
  [9, 8],
  [9, 7],
  [9, 6],
  [9, 5],
  [9, 4],
  [9, 3],
  [8, 9],
  [7, 9],
  [0, 9],
  [0, 10],
  [2, 9],
  [1, 9],
  [3, 9],
  [1, 10],
  [4, 9],
  [21, 17],
  [12, 28],
  [16, 28],
  [18, 28],
  [19, 28],
  [23, 28],
  [27, 26],
];
const plantSprites = [
  [1, 5],
  [2, 5],
  [3, 5],
  [6, 0],
  [25, 19],
  [25, 20],
];

const rockSprites = [[28, 10]];

// change this to accept row and column
export const makeRock = (row, column) => {
  const sprite = sample(rockSprites);

  return {
    type: ROCK,
    sprite,
    row,
    column,
    ...getdefaultValues(),
  };
};

export const makeGround = (row, column) => {
  const sprite = sample(rockSprites);

  return {
    type: GROUND,
    sprite,
    row,
    column,
    ...getdefaultValues(),
  };
};

export const makeAnimal = (row, column) => {
  const sprite = sample(animalSprites);

  return {
    type: ANIMAL,
    sprite,
    row,
    column,
    ...getdefaultValues(),
  };
};

export const makePlant = (row, column, inputSprite = null) => {
  let sprite;
  if (inputSprite) {
    sprite = inputSprite;
  } else {
    sprite = sample(plantSprites);
  }

  return {
    type: PLANT,
    sprite,
    row,
    column,
    ...getdefaultValues(),
  };
};
