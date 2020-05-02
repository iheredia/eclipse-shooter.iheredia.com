(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');
  var backgroundStars = [];

  for (var i=0; i<100; i++) {
    backgroundStars.push({
      position: {
        x: -canvas.width/2 + Math.random() * canvas.width,
        y: -canvas.height/2 + Math.random() * canvas.height,
      },
      speed: {
        x: -1 + Math.random() * -2,
      },
      size: 1 + Math.random() * 3,
    });
  }

  function drawRoutine() {
    ctx.fillStyle = '#ff6347';
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(canvas.width/2, canvas.height/2), 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalCompositeOperation='xor';
    for (var i=0; i<backgroundStars.length; i++) {
      var star = backgroundStars[i];
      ctx.beginPath();
      ctx.arc(
        star.position.x,
        star.position.y,
        star.size,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
  }
  var event = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
  window.dispatchEvent(event);

  function updateBackgroundState() {
    for (var i=0; i<backgroundStars.length; i++) {
      var star = backgroundStars[i];
      star.position.x += star.speed.x;
      if (star.position.x <= -canvas.width/2) {
        star.position.x = canvas.width/2;
      }
    }
    setTimeout(updateBackgroundState, 10);
  }
  updateBackgroundState();
})();
