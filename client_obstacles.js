(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  var activeObstacles;
  var step;
  function setInitialConditions() {
    step = 'initial'
    activeObstacles = [
      {
        position: { x: canvas.width * 5, y: - 100 },
        speed: { x: -5 },
        size: 20,
        rotation: 0,
        alive: true,
      },
      {
        position: { x: canvas.width * 5, y: 100 },
        speed: { x: -5 },
        size: 20,
        rotation: 0,
        alive: true,
      },
      {
        position: { x: canvas.width * 8, y: 0 },
        speed: { x: -5 },
        size: 20,
        rotation: 0,
        alive: true,
      }
    ];
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupEasyObstacles() {
    for (var i=0; i<200; i++) {
      var size = 10 + Math.random() * 15;
      activeObstacles.push({
        position: {
          x: canvas.width + Math.random() * canvas.width * 10,
          y: (Math.random() - 0.5) * canvas.height,
        },
        speed: { x: - 5 - 100/size },
        size: size,
        rotation: 0,
        alive: true,
      })
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupMediumObstacles() {
    console.log('Medium obstacles');
  }

  function setupDifficultObstacles() {
    console.log('Difficult obstacles');
  }

  var nextStepFor = {
    initial: 'easy',
    easy: 'medium',
    medium: 'difficult',
    difficult: null
  }
  var setupStep = {
    'easy': setupEasyObstacles,
    'medium': setupMediumObstacles,
    'difficult': setupDifficultObstacles,
  };

  var updateStateTimeout;
  function updateState() {
    var allObstaclesWentBy = true;
    for (var i=0; i<activeObstacles.length; i++) {
      var obstacle = activeObstacles[i];
      obstacle.position.x += obstacle.speed.x;
      obstacle.rotation += 0.01;
      allObstaclesWentBy = allObstaclesWentBy && obstacle.position.x < -canvas.width;
    }
    if (allObstaclesWentBy) {
      step = nextStepFor[step];
      if (step) {
        setupStep[step]();
      }
    }
    if (step) {
      updateStateTimeout = setTimeout(updateState, 10);
    } else {
      // TODO: trigger boss
      var eclipseEvent = new CustomEvent('game:start-eclipse');
      window.dispatchEvent(eclipseEvent);
    }
  }

  function drawStar(obstacle) {
    var centerX = obstacle.position.x;
    var centerY = obstacle.position.y;
    var spikes = 16;
    var rotation = obstacle.rotation;
    var step = Math.PI / spikes;
    var innerRadius = obstacle.size * 2 / 3;
    var outerRadius = obstacle.size;

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    var x = centerX;
    var y = centerY;
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(rotation) * outerRadius, centerY + Math.sin(rotation) * outerRadius)
    for (var i = 0; i < spikes; i++) {
      x = centerX + Math.cos(rotation) * outerRadius;
      y = centerY + Math.sin(rotation) * outerRadius;
      ctx.lineTo(x, y)
      rotation += step

      x = centerX + Math.cos(rotation) * innerRadius;
      y = centerY + Math.sin(rotation) * innerRadius;
      ctx.lineTo(x, y)
      rotation += step
    }
    ctx.closePath();
    ctx.fill();
  }

  function drawRoutine() {
    if (activeObstacles && activeObstacles.length) {
      ctx.fillStyle = '#509EB8';
      ctx.globalCompositeOperation = 'xor';
      for (var i=0; i<activeObstacles.length; i++) {
        var obstacle = activeObstacles[i];
        drawStar(obstacle)
      }
    }
  }
  var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
  window.dispatchEvent(registerDrawRoutineEvent);

  window.addEventListener('game:start', function () {
    setInitialConditions();
    clearTimeout(updateStateTimeout);
    updateState();
  });

  window.addEventListener('game:end', function () {
    clearTimeout(updateStateTimeout);
  });
})();
