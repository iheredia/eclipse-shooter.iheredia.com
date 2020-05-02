(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');
  var backgroundStars = [];

  for (var i=0; i<100; i++) {
    backgroundStars.push({
      position: {
        x: -canvas.width/2 + Math.random() * canvas.width,
        y: -canvas.height/2 + 100 + Math.random() * (canvas.height - 200),
      },
      speed: {
        x: - Math.random(),
      },
      size: 1 + Math.random() * 3,
    });
  }

  function drawRoutine() {
    ctx.fillStyle = '#ff6347';
    ctx.globalCompositeOperation = 'xor';
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

  function updateStarsSpeed (increment) {
    for (var i=0; i<100; i++) {
      backgroundStars[i].speed.x += increment
    }
  }

  window.addEventListener('game:start', function () {
    var counter = 1000;
    function increaseSpeed() {
      updateStarsSpeed(-0.004);
      counter--;
      if (counter > 0) {
        setTimeout(increaseSpeed, 10)
      }
    }
    increaseSpeed();
  });
})();
