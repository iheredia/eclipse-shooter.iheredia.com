var canvas = document.querySelector('#main-canvas');
var ctx = canvas.getContext('2d');

function setupCanvas() {
  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  return canvas
}

function drawGame() {
  var mainColor = '#ff6347'
  ctx.fillStyle = mainColor;
  ctx.fillRect(canvas.width/3, 0, canvas.width/3, canvas.height);

  requestAnimationFrame(drawGame);
}

function initGame() {
  setupCanvas();
  drawGame();
}

initGame();
