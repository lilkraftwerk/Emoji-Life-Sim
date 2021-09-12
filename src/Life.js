import { makeAnimal, makeRock, makePlant, makeCar } from "./Models";
import { getEmptyCoordsForBlankBoard } from "./Utils";

export const convertRowColumnToCoords = (row, col, emojiSize) => {
  return [col * emojiSize, row * emojiSize];
};

export const findAllEmptyCells = (rowCount, columnCount, actors) => {
  const usedCoords = actors.map((thisActor) => {
    return `${thisActor.row}-${thisActor.column}`;
  });

  const empties = [];

  for (let currentRow = 0; currentRow < rowCount; currentRow += 1) {
    for (
      let currentColumn = 0;
      currentColumn < columnCount;
      currentColumn += 1
    ) {
      const stringified = `${currentRow}-${currentColumn}`;

      if (usedCoords.includes(stringified) === false) {
        empties.push([currentRow, currentColumn]);
      }
    }
  }

  return empties;
};

export const findNeighbors = (actor, allActors) => {
  const { row, column } = actor;

  const neighbors = allActors.filter((currentActor) => {
    const rowMatches =
      currentActor.row === row - 1 ||
      currentActor.row === row ||
      currentActor.row === row + 1;

    const columnMatches =
      currentActor.column === column - 1 ||
      currentActor.column === column ||
      currentActor.column === column + 1;

    return rowMatches && columnMatches;
  });

  return neighbors;
};

const removeEmptyCell = (allEmptyCells, coordsToRemove) => {
  return allEmptyCells.filter((currentCell) => {
    return (
      currentCell[0] !== coordsToRemove[0] &&
      currentCell[1] !== coordsToRemove[1]
    );
  });
};

const addEmptyCell = (allEmptyCells, coordsToAdd) => {
  return [...allEmptyCells, coordsToAdd];
};

export const setUpActors = ({
  rowCount,
  columnCount,
  animalCount,
  rockCount,
  plantCount,
  carCount,
}) => {
  const emptyCoordsShuffled = getEmptyCoordsForBlankBoard(
    rowCount,
    columnCount
  );

  const actors = [];

  for (let i = 0; i < animalCount; i += 1) {
    const [row, col] = emptyCoordsShuffled.shift();
    actors.push(makeAnimal(row, col));
  }

  for (let i = 0; i < rockCount; i += 1) {
    const [row, col] = emptyCoordsShuffled.shift();
    actors.push(makeRock(row, col));
  }

  for (let i = 0; i < plantCount; i += 1) {
    const [row, col] = emptyCoordsShuffled.shift();
    actors.push(makePlant(row, col));
  }

  for (let i = 0; i < carCount; i += 1) {
    const [row, col] = emptyCoordsShuffled.shift();
    actors.push(makeCar(row, col));
  }

  return actors;
};
