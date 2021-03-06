/* eslint-disable no-param-reassign */

// from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffle = (array) => {
  let currentIndex = array.length;
  let randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const sample = (inputArray) => {
  const randomElement =
    inputArray[Math.floor(Math.random() * inputArray.length)];
  return randomElement;
};

export const colors = [
  "#ED0A3F",
  "#C32148",
  "#FD0E35",
  "#C62D42",
  "#CC474B",
  "#CC3336",
  "#E12C2C",
  "#D92121",
  "#B94E48",
  "#FF5349",
  "#FE4C40",
  "#FE6F5E",
  "#B33B24",
  "#CC553D",
  "#E6735C",
  "#FF9980",
  "#E58E73",
  "#FF7F49",
  "#FF681F",
  "#FF8833",
  "#FFB97B",
  "#ECB176",
  "#E77200",
  "#FFAE42",
  "#F2BA49",
  "#FBE7B2",
  "#F2C649",
  "#F8D568",
  "#FCD667",
  "#FED85D",
  "#FBE870",
  "#F1E788",
  "#FFEB00",
  "#B5B35C",
  "#ECEBBD",
  "#FAFA37",
  "#FFFF99",
  "#FFFF9F",
  "#D9E650",
  "#ACBF60",
  "#AFE313",
  "#BEE64B",
  "#C5E17A",
  "#5E8C31",
  "#7BA05B",
  "#9DE093",
  "#63B76C",
  "#4D8C57",
  "#3AA655",
  "#6CA67C",
  "#5FA777",
  "#93DFB8",
  "#33CC99",
  "#1AB385",
  "#29AB87",
  "#00CC99",
  "#00755E",
  "#8DD9CC",
  "#01786F",
  "#30BFBF",
  "#00CCCC",
  "#008080",
  "#8FD8D8",
  "#95E0E8",
  "#6CDAE7",
  "#2D383A",
  "#76D7EA",
  "#7ED4E6",
  "#0095B7",
  "#009DC4",
  "#02A4D3",
  "#47ABCC",
  "#4997D0",
  "#339ACC",
  "#93CCEA",
  "#2887C8",
  "#00468C",
  "#0066CC",
  "#1560BD",
  "#0066FF",
  "#A9B2C3",
  "#C3CDE6",
  "#4570E6",
  "#7A89B8",
  "#4F69C6",
  "#8D90A1",
  "#8C90C8",
  "#7070CC",
  "#9999CC",
  "#ACACE6",
  "#766EC8",
  "#6456B7",
  "#3F26BF",
  "#8B72BE",
  "#652DC1",
  "#6B3FA0",
  "#8359A3",
  "#8F47B3",
  "#C9A0DC",
  "#BF8FCC",
  "#803790",
  "#733380",
  "#D6AEDD",
  "#C154C1",
  "#FC74FD",
  "#732E6C",
  "#E667CE",
  "#E29CD2",
  "#8E3179",
  "#D96CBE",
  "#EBB0D7",
  "#C8509B",
  "#BB3385",
  "#D982B5",
  "#A63A79",
  "#A50B5E",
  "#614051",
  "#F653A6",
  "#DA3287",
  "#FF3399",
  "#FBAED2",
  "#FFB7D5",
  "#FFA6C9",
  "#F7468A",
  "#E30B5C",
  "#FDD7E4",
  "#E62E6B",
  "#DB5079",
  "#FC80A5",
  "#F091A9",
  "#FF91A4",
  "#A55353",
  "#CA3435",
  "#FEBAAD",
  "#F7A38E",
  "#E97451",
  "#AF593E",
  "#9E5B40",
  "#87421F",
  "#926F5B",
  "#DEA681",
  "#D27D46",
  "#664228",
  "#D99A6C",
  "#EDC9AF",
  "#FFCBA4",
  "#805533",
  "#FDD5B1",
  "#EED9C4",
  "#665233",
  "#837050",
  "#E6BC5C",
  "#D9D6CF",
  "#92926E",
  "#E6BE8A",
  "#C9C0BB",
  "#DA8A67",
  "#C88A65",
  "#000000",
  "#736A62",
  "#8B8680",
  "#C8C8CD",
];

export const getRandomInt = (min, max) => {
  return (
    Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
    Math.ceil(min)
  );
};

export const filterArr = (totalArr, entryToRemove) => {
  const stringified = JSON.stringify(entryToRemove);
  return totalArr.filter((currentEntry) => {
    return JSON.stringify(currentEntry) !== stringified;
  });
};

export const isArrayEqual = (a1, a2) => {
  return JSON.stringify(a1) === JSON.stringify(a2);
};

// https://stackoverflow.com/questions/43566019/how-to-choose-a-weighted-random-array-element-in-javascript/55671924
// let testValues = [{
//   value : 'aaa',
//   probability: 0.1
// },
// {
//   value : 'bbb',
//   probability: 0.3
// },
// {
//   value : 'ccc',
//   probability: '*'
// }]

export const getActionByProbability = (values) => {
  let i;
  let pickedValue;
  const randomNr = Math.random();
  let threshold = 0;

  for (i = 0; i < values.length; i += 1) {
    if (values[i].probability === "*") {
      // eslint-disable-next-line no-continue
      continue;
    }

    threshold += values[i].probability;
    if (threshold > randomNr) {
      pickedValue = values[i].value;
      break;
    }

    if (!pickedValue) {
      // nothing found based on probability value, so pick element marked with wildcard
      pickedValue = values.filter((value) => {
        return value.probability === "*";
      });
    }
  }

  return pickedValue;
};

export const getActionThrottled = (actions, percentChanceOfFiring) => {
  const randomNumber = getRandomInt(0, 100); // 33
  if (randomNumber <= percentChanceOfFiring) {
    return getActionByProbability(actions);
  }

  // return empty function
  return () => {};
};

export const getEmptyCoordsForBlankBoard = (
  rowCount,
  columnCount,
  shouldShuffle = true
) => {
  const results = [];
  for (let currentRow = 0; currentRow < rowCount - 1; currentRow += 1) {
    for (
      let currentColumn = 0;
      currentColumn < columnCount - 1;
      currentColumn += 1
    ) {
      results.push([currentRow, currentColumn]);
    }
  }
  if (shouldShuffle) {
    return shuffle(results);
  }
  return results;
};
