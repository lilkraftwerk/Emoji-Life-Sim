/* eslint-disable no-param-reassign */
import { shuffle, sample } from "lodash";
import { ANIMAL, PLANT, CAR } from "./Globals";
import { makePlant } from "./Models";
import { getActionThrottled } from "./Utils";

let localActors = [];

const removeEmptyCell = (allEmptyCells, coordsToRemove) => {
  return allEmptyCells.filter((currentCell) => {
    return (
      currentCell[0] !== coordsToRemove[0] &&
      currentCell[1] !== coordsToRemove[1]
    );
  });
};

function findAllEmptyCells(rowCount, columnCount, actors) {
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
}

const findNeighbors = (actor, allActors) => {
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

const updateActors = (actors, rowCount, colCount) => {
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

        const shuffledVerticalMoves = shuffle([upMove, downMove]);
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

        const move = possibleCarMoves[0];
        const [newRow, newMove] = move;
        currentActor.row = newRow;
        currentActor.column = newMove;
      };

      const actionsWithChance = [
        {
          value: driveAction,
          probability: 1,
        },
      ];

      const chosenAction = getActionThrottled(actionsWithChance, 25);
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

const actorUpdateLoop = (rowCount, columnCount) => {
  localActors = updateActors(localActors, rowCount, columnCount);
  postMessage({ message: "UPDATE_ACTORS", value: localActors });
  setTimeout(() => {
    actorUpdateLoop(rowCount, columnCount);
  }, 1000 / 30);
};

// eslint-disable-next-line func-names
onmessage = function (event) {
  const { message, value, rowCount, columnCount } = event.data;
  if (message === "UPDATE_ACTORS") {
    localActors = value;
    actorUpdateLoop(rowCount, columnCount);
    // postMessage({ message: "UPDATE_ACTORS", value: newActors });
  }
};
