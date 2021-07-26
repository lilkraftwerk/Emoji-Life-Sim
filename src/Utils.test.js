import { getRandomInt, filterArr, isArrayEqual } from "./Utils";
import { NEUT, DEAD, LIVE, ANIMAL, PLANT, GROUND, ROCK } from "./Globals";

describe("getRandomInt", () => {
  it("should get a random int inclusive of both numbers", () => {
    for (let i = 0; i < 100; i += 1) {
      const result = getRandomInt(1, 10);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(11);
    }
  });
});

describe("isArrayEqual", () => {
  it("return true when they are equal", () => {
    const input = [
      {
        a: 1,
        b: 1,
        c: "catto",
      },
      {
        a: 2,
        b: 2,
        c: "cdtto",
      },
      {
        a: 3,
        b: 3,
        c: "zatto",
      },
    ];

    const output = [
      {
        a: 3,
        b: 3,
        c: "zatwhateverto",
      },
      {
        a: 2,
        b: 2,
        c: "cdffffftto",
      },
      {
        a: 1,
        b: 1,
        c: "catto",
      },
    ];
    expect(isArrayEqual(input, output)).toEqual(false);
  });

  it("should return true when they are equal", () => {
    const input = [
      {
        a: 1,
        b: 1,
        c: "catto",
      },
      {
        a: 2,
        b: 2,
        c: "cdtto",
      },
      {
        a: 3,
        b: 3,
        c: "zatto",
      },
    ];

    const output = [
      {
        a: 3,
        b: 3,
        c: "zatto",
      },
      {
        a: 2,
        b: 2,
        c: "cdtto",
      },
      {
        a: 1,
        b: 1,
        c: "catto",
      },
    ];
    expect(isArrayEqual(input, output)).toEqual(true);
  });
});

describe.only("filterArr", () => {
  it("should remove a 2d array from an array", () => {
    const input = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];

    const expected = [
      [1, 1],
      [3, 3],
    ];
    const result = filterArr(input, [2, 2]);
    expect(result).toEqual(expected);
  });

  it("should remove any object from an array", () => {
    const input = [[1, 1], [2, 2], "catto", [3, 3]];

    const expected = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];
    const result = filterArr(input, "catto");
    expect(result).toEqual(expected);
  });

  it("should work with objects", () => {
    const input = [
      {
        row: 0,
        column: 0,
        type: ANIMAL,
      },
      {
        row: 2,
        column: 2,
        type: ANIMAL,
      },
      {
        row: 1,
        column: 0,
        type: ROCK,
      },
    ];

    const expected = [
      {
        row: 0,
        column: 0,
        type: ANIMAL,
      },

      {
        row: 1,
        column: 0,
        type: ROCK,
      },
    ];

    const result = filterArr(input, {
      row: 2,
      column: 2,
      type: ANIMAL,
    });
    expect(result).toEqual(expected);
  });
});
