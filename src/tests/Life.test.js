import { ANIMAL, ROCK } from "../Globals";
import {
  findAllEmptyCells,
  findNeighbors,
  updateActors,
} from "../Life";

import { isArrayEqual } from "../Utils";

describe("findEmptyCells", () => {
  it("should should find empty coords", () => {
    const testActors = [
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      { row: 2, column: 2 },
      { row: 3, column: 3 },
    ];

    const result = findAllEmptyCells(4, 4, testActors);
    expect(result).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 0],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 1],
      [2, 3],
      [3, 0],
      [3, 1],
      [3, 2],
    ]);
  });
});

describe("findNeighbors", () => {
  it("should should find neighbors", () => {
    const testActors = [
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 2, column: 2 },
      { row: 3, column: 3 },
    ];

    const mainActor = {
      column: 1,
      row: 1,
    };

    const result = findNeighbors(mainActor, testActors);
    expect(result).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 2, column: 2 },
    ]);
  });
});

describe.skip("updateActors", () => {
  it("should move an animal to the only available open slot", () => {
    const actors = [
      {
        type: ANIMAL,
        row: 0,
        column: 0,
      },
      {
        type: ROCK,
        row: 0,
        column: 1,
      },
      {
        type: ROCK,
        row: 1,
        column: 0,
      },
    ];

    const expectedActors = [
      {
        type: ROCK,
        row: 0,
        column: 1,
      },
      {
        type: ANIMAL,
        row: 1,
        column: 1,
      },
      {
        type: ROCK,
        row: 1,
        column: 0,
      },
    ];

    const result = updateActors(actors, 2, 2);
    expect(isArrayEqual(result, expectedActors)).toEqual(true);
  });
});

// describe("getCellAtCoords", () => {
//   const board = [
//     [NEUT, NEUT, NEUT],
//     [NEUT, LIVE, NEUT],
//     [NEUT, DEAD, NEUT],
//   ];

//   it("should get the proper cell", () => {
//     const results = [
//       getCellAtCoords(0, 0, board),
//       getCellAtCoords(2, 2, board),
//       getCellAtCoords(1, 1, board),
//       getCellAtCoords(2, 1, board),
//     ];
//     expect(results).toEqual([NEUT, NEUT, LIVE, DEAD]);
//   });

//   it("should throw an error when row index is less than zero", () => {
//     expect(getCellAtCoords(-1, 2, board)).toBeNull();
//   });

//   it("should throw an error when row index is greater than count", () => {
//     expect(getCellAtCoords(5, 2, board)).toBeNull();
//   });

//   it("should throw an error when column index is less than zero", () => {
//     expect(getCellAtCoords(1, -1, board)).toBeNull();
//   });

//   it("should throw an error when column index is greater than count", () => {
//     expect(getCellAtCoords(1, 5, board)).toBeNull();
//   });
// });

// describe("getNeighborCoords", () => {
//   it("should work on the first cell", () => {
//     const result = getNeighborCoords(0, 0);
//     expect(result).toEqual([
//       [-1, -1],
//       [-1, 0],
//       [-1, 1],
//       [0, 1],
//       [1, 1],
//       [1, 0],
//       [1, -1],
//       [0, -1],
//     ]);
//   });

//   it("should work on any cell", () => {
//     const result = getNeighborCoords(45, 45);
//     expect(result).toEqual([
//       [44, 44],
//       [44, 45],
//       [44, 46],
//       [45, 46],
//       [46, 46],
//       [46, 45],
//       [46, 44],
//       [45, 44],
//     ]);
//   });
// });

// describe("getNeighbors", () => {
//   const boardOne = [
//     [1, 2, 3, 4, 5],
//     [6, 7, 8, 9, 10],
//     [11, 12, 13, 14, 15],
//     [16, 17, 18, 19, 20],
//     [21, 22, 23, 24, 25],
//   ];

//   it("should work on the first cell", () => {
//     const result = getNeighbors(0, 0, boardOne);
//     expect(result).toEqual([2, 7, 6]);
//   });

//   it("should work on an edge cell", () => {
//     const result = getNeighbors(2, 4, boardOne);
//     expect(result).toEqual([9, 10, 20, 19, 14]);
//   });

//   it("should work on a middle cell", () => {
//     const result = getNeighbors(2, 2, boardOne);
//     expect(result).toEqual([7, 8, 9, 14, 19, 18, 17, 12]);
//   });

//   it("should work on the last cell", () => {
//     const result = getNeighbors(4, 4, boardOne);
//     expect(result).toEqual([19, 20, 24]);
//   });
// });

// describe("getBoardChanges", () => {
//   it("should do nothing if no changes are to be made", () => {
//     const board = [
//       [NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT],
//     ];

//     const result = getBoardChanges(board);
//     expect(result).toEqual([]);
//   });

//   it("should kill live cells with too many live neighbors", () => {
//     const board = [
//       [LIVE, LIVE, NEUT],
//       [LIVE, LIVE, LIVE],
//       [NEUT, NEUT, NEUT],
//     ];

//     const result = getBoardChanges(board);
//     expect(result).toEqual([
//       [0, 1, DEAD],
//       [1, 1, DEAD],
//     ]);
//   });

//   it("should bring a dead cell back to life", () => {
//     const board = [
//       [LIVE, LIVE, NEUT],
//       [DEAD, LIVE, NEUT],
//       [NEUT, NEUT, NEUT],
//     ];

//     const result = getBoardChanges(board);
//     expect(result).toEqual([[1, 0, LIVE]]);
//   });

//   it("should bring multiple dead cells back to life", () => {
//     const board = [
//       [NEUT, NEUT, NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT, NEUT, LIVE],
//       [DEAD, LIVE, NEUT, LIVE, DEAD],
//       [LIVE, LIVE, NEUT, NEUT, LIVE],
//     ];

//     const result = getBoardChanges(board);
//     expect(result).toEqual([
//       [2, 4, DEAD],
//       [3, 0, LIVE],
//       [3, 4, LIVE],
//       [4, 4, DEAD],
//     ]);
//   });

//   it("should work on a complex board", () => {
//     const board = [
//       [LIVE, NEUT, LIVE, NEUT, NEUT],
//       [NEUT, DEAD, NEUT, LIVE, NEUT],
//       [NEUT, NEUT, LIVE, LIVE, LIVE],
//       [DEAD, LIVE, DEAD, LIVE, DEAD],
//       [LIVE, LIVE, NEUT, NEUT, LIVE],
//     ];

//     const result = getBoardChanges(board);
//     expect(result).toEqual([
//       [0, 0, DEAD],
//       [0, 2, DEAD],
//       [1, 1, LIVE],
//       [1, 3, DEAD],
//       [2, 2, DEAD],
//       [2, 3, DEAD],
//       [3, 0, LIVE],
//       [3, 3, DEAD],
//       [4, 4, DEAD],
//     ]);
//   });
// });

// describe("applyChanges", () => {
//   it("should do nothing if no changes are to be made", () => {
//     const board = [
//       [NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT],
//     ];
//     const changes = [];
//     const result = applyChanges(board, changes);
//     expect(result).toEqual(board);
//   });

//   it("should apply changes properly", () => {
//     const board = [
//       [NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT],
//       [NEUT, NEUT, NEUT],
//     ];
//     const changes = [
//       [0, 0, LIVE],
//       [2, 2, DEAD],
//     ];
//     const result = applyChanges(board, changes);
//     expect(result).toEqual([
//       [LIVE, NEUT, NEUT],
//       [NEUT, NEUT, NEUT],
//       [NEUT, NEUT, DEAD],
//     ]);
//   });

//   it("should apply changes properly two", () => {
//     const board = [
//       [NEUT, NEUT, NEUT, LIVE, DEAD],
//       [NEUT, NEUT, NEUT, LIVE, DEAD],
//       [NEUT, NEUT, NEUT, LIVE, DEAD],
//       [NEUT, NEUT, NEUT, LIVE, DEAD],
//       [NEUT, NEUT, NEUT, LIVE, DEAD],
//     ];
//     const changes = [
//       [0, 0, LIVE],
//       [2, 2, DEAD],
//       [4, 4, LIVE],
//       [4, 3, DEAD],
//     ];
//     const result = applyChanges(board, changes);
//     expect(result).toEqual([
//       [LIVE, NEUT, NEUT, LIVE, DEAD],
//       [NEUT, NEUT, NEUT, LIVE, DEAD],
//       [NEUT, NEUT, DEAD, LIVE, DEAD],
//       [NEUT, NEUT, NEUT, LIVE, DEAD],
//       [NEUT, NEUT, NEUT, DEAD, LIVE],
//     ]);
//   });
// });
