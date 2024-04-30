// TODO: mutate form and color of the background

(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');
  var circleRadius = Math.min(canvas.width/2, canvas.height/2);
  var moon = { active: false };
  var eclipseTimeout;

  window.addEventListener('game:start-eclipse', function () {
    var endYPosition = circleRadius * 2 * Math.sin(Math.PI/4);
    moon = {
      x: circleRadius * 2 * Math.cos(Math.PI/4),
      y: -circleRadius * 2 * Math.sin(Math.PI/4),
      active: true,
    }
    function moveMoon() {
      moon.x -= 0.05;
      moon.y += 0.05;
      if (moon.y < endYPosition) {
        eclipseTimeout = setTimeout(moveMoon, 10);
      } else {
        moon.active = false;
      }
    }
    moveMoon();
  });

  window.addEventListener('game:start', function() {
    moon.active = false;
  });


  window.addEventListener('game:end', function() {
    clearTimeout(eclipseTimeout);
  });

  function drawRoutine() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ff6347';
    ctx.beginPath();
    ctx.arc(0, 0, circleRadius, 0, 2 * Math.PI);
    ctx.fill();

    if (moon.active) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(moon.x, moon.y, circleRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  var event = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
  window.dispatchEvent(event);
})();
