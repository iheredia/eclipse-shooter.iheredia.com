// TODO: always maintain a 16:9 aspect ratio for the main area of the game
// TODO: canvas resolution should be independent from the display resolution

(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.translate(canvas.width/2, canvas.height/2);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
})();
