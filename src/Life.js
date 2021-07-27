import { shuffle, sample } from "lodash";

import { ANIMAL, PLANT, CAR } from "./Globals";
import { makeAnimal, makeRock, makePlant, makeCar } from "./Models";
import { getActionThrottled, getEmptyCoordsForBlankBoard } from "./Utils";

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

// export const getNeighborCoords = (row, col) => {
//   // ROW, COLUMN
//   const UP_LEFT = [-1, -1];
//   const UP = [-1, 0];
//   const UP_RIGHT = [-1, 1];
//   const RIGHT = [0, 1];
//   const DOWN_RIGHT = [1, 1];
//   const DOWN = [1, 0];
//   const DOWN_LEFT = [1, -1];
//   const LEFT = [0, -1];

//   const moves = [
//     UP_LEFT,
//     UP,
//     UP_RIGHT,
//     RIGHT,
//     DOWN_RIGHT,
//     DOWN,
//     DOWN_LEFT,
//     LEFT,
//   ];

//   return moves.map(([rowMove, columnMove]) => {
//     const newRow = row + rowMove;
//     const newCol = col + columnMove;
//     return [newRow, newCol];
//   });
// };

// export const findNeighbors = (thisActor, allActors) => {
//   const neighborCoords = getNeighborCoords(row, col);

//   const neighbors = neighborCoords.map(([newRow, newCol]) => {
//     return getCellAtCoords(newRow, newCol, board);
//   });

//   if (includeNull) {
//     return neighbors;
//   }

//   return neighbors.filter((currentNeighbor) => {
//     return currentNeighbor != null;
//   });
// };

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

export const updateActors = (actors, rowCount, colCount) => {
  const shuffledActors = shuffle([...actors]);
  let emptyCells = findAllEmptyCells(rowCount, colCount, shuffledActors);
  shuffledActors.forEach((currentActor) => {
    const { type, row, column, sprite, flipSprite } = currentActor;

    const surroundingEmpties = emptyCells.filter(([emptyX, emptyY]) => {
      if (emptyX === row - 1 || emptyX === row || emptyX === row + 1) {
        if (
          emptyY === column - 1 ||
          emptyY === column ||
          emptyY === column + 1
        ) {
          return true;
        }
      }
      return false;
    });

    const neighbors = findNeighbors(currentActor, shuffledActors);
    if (type === ANIMAL) {
      const moveAction = () => {
        if (surroundingEmpties.length === 0) {
          return;
        }
        const move = sample(surroundingEmpties);
        const [newRow, newColumn] = move;
        currentActor.row = newRow;
        currentActor.column = newColumn;
      };

      const dieAction = () => {};

      const doNothingAction = () => {};

      const killNeighbor = () => {
        // only kill rock
        if (neighbors.length > 0) {
          const rockNeighbor = neighbors.find((currentNeighbor) => {
            return currentNeighbor.type === PLANT;
          });
          if (rockNeighbor != null) {
            rockNeighbor.alive = false;
          }
        }
      };

      const actionsWithChance = [
        {
          value: killNeighbor,
          probability: 0.5,
        },
        {
          value: moveAction,
          probability: 0.01,
        },
        {
          value: dieAction,
          probability: 0.9,
        },
        {
          value: doNothingAction,
          probability: 0.99,
        },
      ];

      const chosenAction = getActionThrottled(actionsWithChance, 90);
      chosenAction();
    }

    if (type === CAR) {
      if (column <= 0 || column >= colCount - 1) {
        currentActor.alive = false;
      }

      const driveAction = () => {
        const drivingLeft = flipSprite === false;
        if (surroundingEmpties.length <= 0) {
          return;
        }

        const possibleCarMoves = [];
        const upMove = [-1, 0];
        const downMove = [1, 0];
        const leftMove = [0, -1];
        const rightMove = [0, 1];

        const shuffledVerticalMoves = shuffle([upMove, downMove]) 
        const leftMoves = [leftMove, ...shuffledVerticalMoves];
        const rightMoves = [rightMove, ...shuffledVerticalMoves];

        if (drivingLeft) {
          leftMoves.forEach((currentMove) => {
            const newRow = row + currentMove[0];
            const newColumn = column + currentMove[1];

            surroundingEmpties.forEach((currentEmpty) => {
              if (newRow === currentEmpty[0] && newColumn === currentEmpty[1]) {
                possibleCarMoves.push(currentEmpty);
              }
            });
          });
        } else {
          rightMoves.forEach((currentMove) => {
            const newRow = row + currentMove[0];
            const newColumn = column + currentMove[1];

            surroundingEmpties.forEach((currentEmpty) => {
              if (newRow === currentEmpty[0] && newColumn === currentEmpty[1]) {
                possibleCarMoves.push(currentEmpty);
              }
            });
          });
        }

        if (possibleCarMoves.length === 0) {
          return;
        }

        let move = possibleCarMoves[0];
        currentActor.row = move[0];
        currentActor.column = move[1];
      };

      const actionsWithChance = [
        {
          value: driveAction,
          probability: 0.1,
        },
        {
          value: () => {},
          probability: 0.9,
        },
      ];

      const chosenAction = getActionThrottled(actionsWithChance, 90);
      chosenAction();
    }

    if (type === PLANT) {
      const reproduceAction = () => {
        if (surroundingEmpties.length <= 0 || neighbors.length <= 0) {
          return;
        }

        const plantNeighborCount = neighbors.filter((currentNeighbor) => {
          return currentNeighbor.type === PLANT;
        }).length;

        // stop plants from overcrowding
        if (plantNeighborCount > 4) {
          return;
        }

        const plantingSpot = sample(surroundingEmpties);
        const [newRow, newColumn] = plantingSpot;
        emptyCells = removeEmptyCell(emptyCells, [newRow, newColumn]);
        const newPlant = makePlant(newRow, newColumn, sprite);
        shuffledActors.push(newPlant);
      };

      const doNothingAction = () => {};

      const actionsWithChance = [
        {
          value: reproduceAction,
          probability: 0.03,
        },
        {
          value: doNothingAction,
          probability: 0.99,
        },
      ];

      const chosenAction = getActionThrottled(actionsWithChance, 10);
      chosenAction();
    }
  });

  const withDeadRemoved = shuffledActors.filter((oneActor) => {
    return oneActor.alive === true;
  });
  return withDeadRemoved;
};

export const applyChanges = (board, changes) => {
  const newBoard = [...board];
  changes.forEach(([row, col, newState]) => {
    newBoard[row][col] = newState;
  });

  return newBoard;
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
