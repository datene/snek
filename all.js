const colors = [
  "#375DDB",
  "#33B566",
  "#DD3263",
  "#1FAFF5",
  "#78CC7D",
  "#F56E4B",
  "#42CEE0",
  "#FFAE4A",
];

const snakesAmount = 50;
const snakesLength = 15;
const snakesSize = 10;
const snakesSpeed = 0.0015;

const ctx = document.querySelector("#canvas").getContext("2d");

const init = () => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  const snakes = []
  for(let i = 0; i < snakesAmount; i++) {
    const snake = generateSnake();
    snakes.push(snake)
  }
  window.requestAnimationFrame(() => draw(ctx, snakes));
};

const draw = (ctx, snakes) => {
  ctx.clearRect(0, 0, ctx.canvas.offsetWidth, ctx.canvas.offsetHeight);
  
  snakes.forEach((snake, index) => {
    if (withinBounds(snake)) {
      const oval = generateOval(snakesSize, snakesSize, snake[snake.length - 1])
      snake.push(oval)
      if (snake.length >= snakesLength) {
        snake.shift()
      }
      snake.forEach(oval => {
        ctx.beginPath();
        ctx.globalAlpha = oval.opacity
        ctx.ellipse(oval.position.x, oval.position.y, oval.width, oval.height, Math.PI, 0, 2 * Math.PI);
        ctx.fillStyle = oval.color;
        ctx.fill()
        ctx.globalAlpha = 1
      })
    } else { 
      console.log('out of bounds')
      snakes.splice(index, 1, generateSnake());
    }
  })


    window.requestAnimationFrame(() => draw(ctx, snakes));
};

const generateSnake = () => {
  return [generateOval(snakesSize, snakesSize)];
}

const generateOval = (width, height, last) => {
  const start = {
    x: Math.floor(Math.random() * ctx.canvas.width),
    y: Math.floor(Math.random() * ctx.canvas.height),
  }
  const control1 = {
    x: ctx.canvas.width / (Math.floor(Math.random() * (5 - 1 + 1)) + 1),
    y: ctx.canvas.height / (Math.floor(Math.random() * (5 - 1 + 1)) + 1),
  }
  const control2 = {
    x: ctx.canvas.width / (Math.floor(Math.random() * (5 - 1 + 1)) + 1),
    y: ctx.canvas.height / (Math.floor(Math.random() * (5 - 1 + 1)) + 1),
  }
  const end = {
    x: Math.floor(Math.random() * ctx.canvas.width),
    y: Math.floor(Math.random() * ctx.canvas.height),
  }
  const percentage = last ? (last.percentage += snakesSpeed) : 0.00
  let position;
  const type = last ? last.type : (Math.random() > 0.5 ? 'cubic' : 'quadratic');
  if (type == 'quadratic') {
    position = getQuadraticBezierXYatPercent((last ? last.start : start), (last ? last.control1 : control1), (last ? last.end : end), percentage)
  } else {
    position = getCubicBezierXYatPercent((last ? last.start : start), (last ? last.control1 : control1), (last ? last.control2 : control2), (last ? last.end : end), percentage)
  }
  return {
    width: width,
    height: height,
    color: last ? last.color : colors[Math.floor(Math.random() * colors.length)],
    opacity: last ? (last.opacity < 1 ? (last.opacity += 0.1) : last.opacity) : 0.1,
    percentage: percentage,
    position: position,
    control1: last ? last.control1 : control1,
    control2: last ? last.control2 : control2,
    start: last ? last.start : start,
    end: last ? last.end : end,
    type: type
  }
}

const withinBounds = (snake) => {
  const lastOval = snake[0]
  const margin = 50
  const horizontal = lastOval.position.x <= (ctx.canvas.width + margin) && lastOval.position.x >= (0 - margin)
  const vertical = lastOval.position.y <= (ctx.canvas.height + margin) && lastOval.position.y >= (0 - margin)
  return (horizontal && vertical)
}

const getQuadraticBezierXYatPercent = (start, control, end, percentage) => {
  const x = Math.pow(1 - percentage, 2) * start.x + 2 * (1 - percentage) * percentage * control.x + Math.pow(percentage, 2) * end.x
  const y = Math.pow(1 - percentage, 2) * start.y + 2 * (1 - percentage) * percentage * control.y + Math.pow(percentage, 2) * end.y 

  return {
    x: x,
    y: y
  }
}

const getCubicBezierXYatPercent = (start, control1, control2, end, percentage) => {
  const x = CubicN(percentage, start.x, control1.x, control2.x, end.x)
  const y = CubicN(percentage, start.y, control1.y, control2.y, end.y)

  return {
    x:x,
    y:y
  }
}

function CubicN(pct, a,b,c,d) {
  var t2 = pct * pct;
  var t3 = t2 * pct;
  return a + (-a * 3 + pct * (3 * a - a * pct)) * pct
  + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct
  + (c * 3 - c * 3 * pct) * t2
  + d * t3;
}

init();

window.addEventListener('resize', event => {
  init();
})