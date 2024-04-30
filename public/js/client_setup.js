// TODO: canvas resolution should be independent from the display resolution
// TODO: game units should be independent from canvas resolution. Time units should be based on timestamps. Spatial units should be based on ??
// TODO: add music

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
