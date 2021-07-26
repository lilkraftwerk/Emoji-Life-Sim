import _shuffle from "lodash.shuffle";
import _random from "lodash.random";

const updateAllLines = function (allLines) {
  allLines.forEach((currentLine) => {
    currentLine.update();
  });

  const filteredLines = allLines.filter((currentLine) => {
    return currentLine.alive == true;
  });

  const lineCountDifference = OVERALL_COUNT - filteredLines.length;
  const startingPositions = _shuffle(
    getPossibleStartingXPositions(EMOJI_WIDTH)
  );

  if (startingPositions.length === 0) {
    return filteredLines;
  }

  for (let i = 0; i < lineCountDifference; i += 1) {
    const newX = startingPositions.shift();
    const newLine = new MatrixLine(
      newX,
      -300,
      EMOJI_WIDTH,
      25,
      50,
      loadedEmojis
    );
    newLine.create();
    filteredLines.push(newLine);
  }

  return filteredLines;
};

onmessage = function (lines) {
  console.log("gay");
  // var canvas = evt.data.canvas;
  // var gl = canvas.getContext("webgl");
};
