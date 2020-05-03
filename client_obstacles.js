// TODO: so far all obstacles rotate at the same rate. Simplify logic
// TODO: is the "alive" flag necessary for obstacles?

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
        position: { x: canvas.width * 7, y: 0 },
        speed: { x: -5 },
        size: 20,
        rotation: 0,
        alive: true,
      }
    ];
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function randomObstacle() {
    var size = 10 + Math.random() * 15;
    return {
      position: {
        x: canvas.width + Math.random() * canvas.width * 10,
        y: (Math.random() - 0.5) * canvas.height,
      },
      speed: { x: - 5 - 100/size },
      size: size,
      rotation: 0,
      alive: true,
    }
  }

  function distance(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2))
  }

  function randomGroup() {
    var group = [];
    var size = 3 + Math.floor(Math.random() * 5);
    var centerObstacle = randomObstacle();
    group.push(centerObstacle);
    while (group.length < size) {
      var newObstacle = {
        position: {
          x: centerObstacle.position.x + Math.round(Math.random() * 10) * centerObstacle.size,
          y: centerObstacle.position.y + Math.round((Math.random() - 0.5) * 10) * centerObstacle.size,
        },
        speed: centerObstacle.speed,
        size: centerObstacle.size,
        rotation: 0,
        alive: true,
      };
      var separateFromTheRest = true;
      for (var i=0; i<group.length; i++) {
        var savedObstacle = group[i];
        separateFromTheRest = separateFromTheRest && distance(newObstacle, savedObstacle) > 2 * centerObstacle.size;
      }
      if (separateFromTheRest) {
        group.push(newObstacle);
      }
    }
    return group;
  }

  function setupSuperEasyObstacles() {
    console.log('Super easy');
    for (var i=0; i<100; i++) {
      activeObstacles.push(randomObstacle())
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupEasyObstacles() {
    console.log('Easy');
    activeObstacles = []
    for (var i=0; i<50; i++) {
      activeObstacles = activeObstacles.concat(randomGroup());
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupNormalObstacles() {
    console.log('Normal');
    activeObstacles = []
    for (var i=0; i<200; i++) {
      activeObstacles.push(randomObstacle())
    }
    for (var j=0; j<10; j++) {
      activeObstacles = activeObstacles.concat(randomGroup());
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupMediumObstacles() {
    console.log('Medium');
    activeObstacles = []
    for (var i=0; i<250; i++) {
      activeObstacles.push(randomObstacle())
    }
    for (var j=0; j<20; j++) {
      activeObstacles = activeObstacles.concat(randomGroup());
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupDifficultObstacles() {
    console.log('Difficult');
    activeObstacles = []
    for (var i=0; i<300; i++) {
      activeObstacles.push(randomObstacle())
    }
    for (var j=0; j<30; j++) {
      activeObstacles = activeObstacles.concat(randomGroup());
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupSuperDifficultObstacles() {
    console.log('Super difficult');
    activeObstacles = []
    for (var i=0; i<350; i++) {
      activeObstacles.push(randomObstacle())
    }
    for (var j=0; j<40; j++) {
      activeObstacles = activeObstacles.concat(randomGroup());
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  function setupExtremeObstacles() {
    console.log('Extreme');
    activeObstacles = []
    for (var i=0; i<400; i++) {
      activeObstacles.push(randomObstacle())
    }
    for (var j=0; j<50; j++) {
      activeObstacles = activeObstacles.concat(randomGroup());
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  var nextStepFor = {
    'initial': 'super-easy',
    'super-easy': 'easy',
    'easy': 'normal',
    'normal': 'medium',
    'medium': 'difficult',
    'difficult': 'super-difficult',
    'super-difficult': 'extreme',
    'extreme': null
  }
  var setupStep = {
    'super-easy': setupSuperEasyObstacles,
    'easy': setupEasyObstacles,
    'normal': setupNormalObstacles,
    'medium': setupMediumObstacles,
    'difficult': setupDifficultObstacles,
    'super-difficult': setupSuperDifficultObstacles,
    'extreme': setupExtremeObstacles,
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
