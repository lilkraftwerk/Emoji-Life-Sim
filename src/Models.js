import { sample } from "./Utils";

import { ANIMAL, PLANT, GROUND, ROCK, CAR } from "./Globals";
import {
  rockSprites,
  carSprites,
  animalSprites,
  plantSprites,
} from "./ModelSprites";

const coinFlipBoolean = () => {
  return Math.random() < 0.5;
};

const getdefaultValues = (overRides = {}) => {
  const flipSprite = coinFlipBoolean();
  return {
    alive: true,
    action: null,
    flipSprite,
    ...overRides,
  };
};

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

export const makeCar = (row, column) => {
  const sprite = sample(carSprites);

  return {
    type: CAR,
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
