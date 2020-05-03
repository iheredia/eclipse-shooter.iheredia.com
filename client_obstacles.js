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

  function setupRandomObstacles(randomObstaclesAmount, randomGroupsAmount) {
    activeObstacles = []
    for (var i=0; i<randomObstaclesAmount; i++) {
      activeObstacles.push(randomObstacle())
    }
    for (var j=0; j<randomGroupsAmount; j++) {
      activeObstacles = activeObstacles.concat(randomGroup());
    }
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: activeObstacles } });
    window.dispatchEvent(registerCollisionEvent);
  }

  var currentLevel = { iteration: 0, randomObstaclesAmount: 60, randomGroupsAmount: 0 };
  var totalLevels = 8;

  var updateStateTimeout;
  function updateState() {
    var allObstaclesWentBy = true;
    for (var i=0; i<activeObstacles.length; i++) {
      var obstacle = activeObstacles[i];
      obstacle.position.x += obstacle.speed.x;
      obstacle.rotation += 0.01;
      allObstaclesWentBy = allObstaclesWentBy && obstacle.position.x < -canvas.width;
    }
    if (allObstaclesWentBy && currentLevel.iteration < totalLevels) {
      currentLevel.iteration += 1;
      currentLevel.randomObstaclesAmount += 40;
      currentLevel.randomGroupsAmount += 10
      console.log(currentLevel);
      setupRandomObstacles(currentLevel.randomObstaclesAmount, currentLevel.randomGroupsAmount)

      if (currentLevel.iteration === 4) {
        var eclipseEvent = new CustomEvent('game:start-eclipse');
        window.dispatchEvent(eclipseEvent);
      }
    }

    if (currentLevel.iteration === totalLevels) {
      // TODO: trigger game won event
    } else {
      updateStateTimeout = setTimeout(updateState, 10);
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
