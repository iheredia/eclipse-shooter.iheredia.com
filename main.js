var canvas = document.querySelector('#main-canvas');
var ctx = canvas.getContext('2d');
var game = {};

function setupCanvas() {
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  return canvas
}

function createObject (customValues) {
  return {
    position: {
      x: (customValues && customValues.position && customValues.position.x) || 0,
      y: (customValues && customValues.position && customValues.position.y) || 0
    },
    speed: {
      x: (customValues && customValues.speed && customValues.speed.x) || 0,
      y: (customValues && customValues.speed && customValues.speed.y) || 0
    },
    acceleration: {
      x: (customValues && customValues.acceleration && customValues.acceleration.x) || 0,
      y: (customValues && customValues.acceleration && customValues.acceleration.y) || 0
    },
    size: (customValues && customValues.size) || 0
  }
}

function initGameObjects() {
  game.player = createObject({
    position: {
      x: canvas.width/2,
      y: canvas.height/2
    },
    size: 40
  });

  game.backgroundStars = [];
  for (var i=0; i<100; i++) {
    game.backgroundStars.push(createObject({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      speed: {
        x: -2 + Math.random() * -5,
      },
      size: 1 + Math.random() * 3,
    }));
  }
}

function updateObjects (objects) {
  for (var i=0; i<objects.length; i++) {
    var obj = objects[i];
    obj.position.x += obj.speed.x;
    if (obj.position.x <= 0) {
      obj.position.x = canvas.width;
    } else if (obj.position.x >= canvas.width) {
      obj.position.x = 0;
    }
    obj.position.y += obj.speed.y;
    if (obj.position.y <= 0) {
      obj.position.y = canvas.height;
    } else if (obj.position.y >= canvas.height) {
      obj.position.y = 0;
    }
  }
}

function updateGameState() {
  updateObjects(game.backgroundStars);
  updateObjects([game.player]);

  setTimeout(updateGameState, 10);
}

function drawObjects(objects) {
  for (var i=0; i<objects.length; i++) {
    var obj = objects[i];
    ctx.beginPath();
    ctx.arc(
      obj.position.x,
      obj.position.y,
      obj.size,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}

function drawGame() {
  var mainColor = '#ff6347'

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle = mainColor;
  ctx.fillRect(canvas.width/3, 0, canvas.width/3, canvas.height);

  ctx.globalCompositeOperation='xor';
  drawObjects(game.backgroundStars);
  drawObjects([game.player]);

  requestAnimationFrame(drawGame);
}

function bindEvents() {
  window.addEventListener('keydown', function (event) {
    var key = event.key;
    if (key === 'ArrowUp' || key === 'w') {
      game.player.speed.y = -5
    } else if (key === 'ArrowDown' || key === 's') {
      game.player.speed.y = 5
    } else if (key === 'ArrowLeft' || key === 'a') {
      game.player.speed.x = -5
    } else if (key === 'ArrowRight' || key === 'd') {
      game.player.speed.x = 5
    }
  });

  window.addEventListener('keyup', function (event) {
    var key = event.key;
    if (key === 'ArrowUp' || key === 'w' || key === 'ArrowDown' || key === 's') {
      game.player.speed.y = 0
    } else if (key === 'ArrowLeft' || key === 'a' || key === 'ArrowRight' || key === 'd') {
      game.player.speed.x = 0
    }
  });
}

function initGame() {
  setupCanvas();
  initGameObjects();
  drawGame();
  updateGameState();
  bindEvents();
}

initGame();
