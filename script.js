console.log('foi-1');
const MAX_JUMP = 3;
let frame = 0;
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const height = window.innerHeight > 600 ? 600 : window.innerHeight;
const width = window.innerWidth > 600 ? 600 : window.innerWidth;
const velocity = 6;

let currentState;
const states = {
  play: 0,
  inProgress: 1,
  loss: 2,
};

const floor = {
  y: 550,
  height: 50,
  color: '#ffdf70',

  draw: () => {
    ctx.fillStyle = floor.color;
    ctx.fillRect(0, floor.y, width, floor.height);
  },
};

const player = {
  x: 50,
  y: 0,
  height: 50,
  width: 50,
  color: '#ff4e4e',
  gravity: 1.6,
  velocity: 0,
  jumpForce: 23.6,
  qtdJump: 0,
  score: 0,

  fall: () => {
    const floorTouch = floor.y - player.height;
    player.velocity += player.gravity;
    player.y += player.velocity;
    if (player.y >= floorTouch && currentState !== states.loss) {
      player.y = floorTouch;
      player.qtdJump = 0;
      player.velocity = 0;
      const newX = player.x - 10;
      player.x = newX > 50 ? newX : 50;
    }
  },

  jump: () => {
    if (player.qtdJump + 1 > MAX_JUMP) return;
    player.velocity = -player.jumpForce;
    player.qtdJump += 1;
    player.x += (player.qtdJump - 1) * 10;
  },

  reset: () => {
    player.y = 0;
    player.velocity = 0;
    player.score = 0;
  },

  draw: () => {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  },
};

const trs = {
  towers: [],
  colors: ['#ffbc1c', '#ff1c1c', '#ff85e1', '#52a7ff', '#78ff5d'],
  timeInsert: 0,
  insert: () => {
    trs.towers.push({
      x: width,
      width: 50,
      height: 30 + Math.floor(Math.random() * 120),
      color: trs.colors[Math.floor(Math.random() * trs.colors.length)],
    });

    trs.timeInsert = 60;
  },
  update: () => {
    if (trs.timeInsert > 0) {
      trs.timeInsert -= 1;
    } else {
      trs.insert();
    }
    for (let i = 0, tam = trs.towers.length; i < tam; i += 1) {
      const el = trs.towers[i];
      el.x -= velocity;

      if (
        player.x < el.x + el.width &&
        player.x + el.width >= el.x &&
        player.y + player.height > floor.y - el.height
      ) {
        currentState = states.loss;
      } else if (el.x <= -el.width) {
        player.score += 1;
        trs.towers.splice(i, 1);
        tam--;
        i--;
      }
    }
  },
  clear: () => {
    trs.towers = [];
  },
  draw: () => {
    trs.towers.forEach((el) => {
      ctx.fillStyle = el.color;
      ctx.fillRect(el.x, floor.y - el.height, el.width, el.height);
    });
  },
};

const handleClick = (e) => {
  if (currentState === states.inProgress) return player.jump();
  if (currentState === states.play) {
    currentState = states.inProgress;
    return;
  }
  if (currentState === states.loss) {
    currentState = states.play;
    player.reset();
    trs.clear();
    return;
  }
};

const main = () => {
  floor.draw();
  canvas.width = width;
  canvas.height = height;
  canvas.classList.add('canvas');

  document.body.appendChild(canvas);
  document.addEventListener('click', handleClick);
  currentState = states.play;
  runner();
};

const update = () => {
  frame += 1;
  player.fall();
  if (currentState === states.inProgress) {
    trs.update();
    return;
  }
};

const draw = () => {
  ctx.fillStyle = '#50beff';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = '#fff';
  ctx.font = '50px Arial';
  ctx.fillText(player.score, 30, 68);

  if (currentState === states.play) {
    ctx.fillStyle = 'green';
    ctx.fillRect(width / 2 - 50, height / 2 - 50, 100, 100);
  } else if (currentState === states.loss) {
    ctx.fillStyle = 'red';
    ctx.fillRect(width / 2 - 50, height / 2 - 50, 100, 100);
  } else if (currentState === states.inProgress) {
    trs.draw();
  }
  floor.draw();
  player.draw();
};

const runner = () => {
  update();
  draw();

  window.requestAnimationFrame(runner);
};

window.onload = main;
