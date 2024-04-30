(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');
  var backgroundStars = [];

  for (var i=0; i<100; i++) {
    var initialSpeed = Math.random();
    backgroundStars.push({
      position: {
        x: -canvas.width/2 + Math.random() * canvas.width,
        y: -canvas.height/2 + 100 + Math.random() * (canvas.height - 200),
      },
      initialSpeed: { x: -initialSpeed },
      speed: { x: -initialSpeed },
      size: 1 + Math.random() * 3,
    });
  }

  function drawRoutine() {
    ctx.fillStyle = '#ff6347';
    ctx.globalCompositeOperation = 'xor';
    for (var i=0; i<backgroundStars.length; i++) {
      var star = backgroundStars[i];
      ctx.beginPath();
      ctx.arc(star.position.x, star.position.y, star.size, 0, 2 * Math.PI);
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

  var acceleration = 0.004;
  var increaseSpeedTimeout;
  var decreaseSpeedTimeout;

  window.addEventListener('game:start', function () {
    function increaseSpeed() {
      var someStarChangedItsSpeed = false;
      for (var i=0; i<backgroundStars.length; i++) {
        var star = backgroundStars[i]
        if (star.speed.x > star.initialSpeed.x - 4) {
          star.speed.x -= acceleration;
          someStarChangedItsSpeed = true;
        }
      }
      if (someStarChangedItsSpeed) {
        increaseSpeedTimeout = setTimeout(increaseSpeed, 10)
      }
    }
    clearTimeout(decreaseSpeedTimeout);
    increaseSpeed();
  });

  window.addEventListener('game:end', function () {
    function decreaseSpeed() {
      var someStarChangedItsSpeed = false;
      for (var i=0; i<backgroundStars.length; i++) {
        var star = backgroundStars[i]
        if (star.speed.x < star.initialSpeed.x) {
          star.speed.x += acceleration;
          someStarChangedItsSpeed = true;
        }
      }
      if (someStarChangedItsSpeed) {
        decreaseSpeedTimeout = setTimeout(decreaseSpeed, 10)
      }
    }
    clearTimeout(increaseSpeedTimeout);
    decreaseSpeed();
  });
})();
