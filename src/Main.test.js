import { getEmojiAtLocation, getEmojiAtLocationReversed } from "./main";

describe("getEmojiAtLocation", () => {
  it("should work for a non-reversed sprite sheet", () => {
    const inputRow = 0;
    const inputColumn = 0;
    const expectedCoords = [0, 0];
    const result = getEmojiAtLocation(inputRow, inputColumn);
    expect(result).toEqual(expectedCoords);
  });

  it("should work further for a non-reversed sprite sheet", () => {
    const inputRow = 1;
    const inputColumn = 1;
    const expectedCoords = [20, 20];
    const result = getEmojiAtLocation(inputRow, inputColumn);
    expect(result).toEqual(expectedCoords);
  });

  it("should work for a reversed sprite sheet", () => {
    const inputRow = 0;
    const inputColumn = 0;
    const expectedCoords = [580, 0];
    const result = getEmojiAtLocationReversed(inputRow, inputColumn);
    expect(result).toEqual(expectedCoords);
  });

  it("should work further for a reversed sprite sheet", () => {
    const inputRow = 1;
    const inputColumn = 1;
    const expectedCoords = [560, 20];
    const result = getEmojiAtLocationReversed(inputRow, inputColumn);
    expect(result).toEqual(expectedCoords);
  });

  it("should work even further for a reversed sprite sheet", () => {
    const inputRow = 3;
    const inputColumn = 3;
    const expectedCoords = [520, 60];
    const result = getEmojiAtLocationReversed(inputRow, inputColumn);
    expect(result).toEqual(expectedCoords);
  });
});
