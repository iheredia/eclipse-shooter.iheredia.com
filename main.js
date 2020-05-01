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

function initGameObjects() {
  game.backgroundStars = [];
  for (var i=0; i<100; i++) {
    game.backgroundStars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 1 + Math.random() * 3,
      speed: 1 + Math.random() * 5,
    });
  }
}

function updateGameState() {
  for (var i=0; i<game.backgroundStars.length; i++) {
    var star = game.backgroundStars[i];
    star.x -= star.speed;
    if (star.x <= 0) {
      star.x = canvas.width;
    }
  }

  setTimeout(updateGameState, 10);
}

function drawGame() {
  var mainColor = '#ff6347'

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle = mainColor;
  ctx.fillRect(canvas.width/3, 0, canvas.width/3, canvas.height);


  ctx.globalCompositeOperation='xor';
  for (var i=0; i<game.backgroundStars.length; i++) {
    var star = game.backgroundStars[i];
    ctx.beginPath();
    ctx.arc(
      star.x,
      star.y,
      star.size,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }


  requestAnimationFrame(drawGame);
}

function initGame() {
  setupCanvas();
  initGameObjects();
  drawGame();
  updateGameState();
}

initGame();
