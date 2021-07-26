let offscreenCanvas;
let offscreenContext;
let stuffToDraw = [];
let currentX = 0;
let currentY = 0;
const COUNT = 5000;

import { colors } from "./Utils.js";

onmessage = function (evt) {
  if (evt.data.canvas) {
    offscreenCanvas = evt.data.canvas;
    offscreenContext = offscreenCanvas.getContext("2d");
    generateDots();
    testDraw();
  }
};

function updateStuff() {
  for (let i = 0; i < stuffToDraw.length - 1; i += 1) {
    const currentDot = stuffToDraw[i];
    const { x, y } = currentDot;
    const randoX = _random(2);
    const randoY = _random(2);
    const switcher = _random(10);
    if (switcher < 5) {
      currentDot.x = x + randoX;
      currentDot.y = y + randoY;
    } else {
      currentDot.x = x - randoX;
      currentDot.y = y - randoY;
    }
  }
}

function generateDots() {
  const { width, height } = offscreenCanvas;
  for (let i = 0; i < COUNT; i += 1) {
    const color = colors[_random(colors.length)];
    const x = _random(width);
    const y = _random(height);
    const size = _random(10);
    const thisDot = {
      x,
      y,
      color,
      size,
    };
    stuffToDraw.push(thisDot);
  }
}

function testDraw() {
  const { width, height } = offscreenCanvas;
  offscreenContext.clearRect(0, 0, width, height);

  for (let i = 0; i < stuffToDraw.length - 1; i++) {
    const thingToDraw = stuffToDraw[i];
    const { x, y, color, size } = thingToDraw;
    offscreenContext.fillStyle = color;
    offscreenContext.fillRect(x, y, size, size);
  }
  updateStuff();
  requestAnimationFrame(testDraw);
}
