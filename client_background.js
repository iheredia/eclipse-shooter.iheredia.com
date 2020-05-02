(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  function drawRoutine() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ff6347';
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(canvas.width/2, canvas.height/2), 0, 2 * Math.PI);
    ctx.fill();
  }
  var event = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
  window.dispatchEvent(event);
})();
