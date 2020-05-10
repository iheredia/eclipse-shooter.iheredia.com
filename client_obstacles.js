// TODO: is the "alive" flag necessary for obstacles?
// TODO: smarter obstacles

(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  var activeObstacles;
  var currentLevel;
  function setInitialConditions() {
    currentLevel = { iteration: 0, randomObstaclesAmount: 0, randomGroupsAmount: 0 };
    activeObstacles = [
      {
        position: { x: canvas.width * 5, y: - 100 },
        speed: { x: -5 },
        size: 20,
        alive: true,
      },
      {
        position: { x: canvas.width * 5, y: 100 },
        speed: { x: -5 },
        size: 20,
        alive: true,
      },
      {
        position: { x: canvas.width * 7, y: 0 },
        speed: { x: -5 },
        size: 20,
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
      speed: { x: -1 - currentLevel.iteration/2 - 100/size },
      size: size,
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

  var updateStateTimeout;
  function updateState() {
    var allObstaclesWentBy = true;
    for (var i=0; i<activeObstacles.length; i++) {
      var obstacle = activeObstacles[i];
      if (-canvas.width <= obstacle.position.x) {
        obstacle.position.x += obstacle.speed.x;
        if (!obstacle.wentBy) {
          obstacle.wentBy = obstacle.position.x < -canvas.width;
        }
        allObstaclesWentBy = allObstaclesWentBy && obstacle.wentBy
      }
    }
    if (allObstaclesWentBy) {
      currentLevel.iteration += 1;
      currentLevel.randomObstaclesAmount += 20;
      currentLevel.randomGroupsAmount += 5
      setupRandomObstacles(currentLevel.randomObstaclesAmount, currentLevel.randomGroupsAmount)

      if (currentLevel.iteration === 4) {
        var eclipseEvent = new CustomEvent('game:start-eclipse');
        window.dispatchEvent(eclipseEvent);
      }
    }
    updateStateTimeout = setTimeout(updateState, 10);
  }

  function drawRoutine() {
    if (activeObstacles && activeObstacles.length) {
      ctx.fillStyle = '#509EB8';
      ctx.globalCompositeOperation = 'xor';
      for (var i=0; i<activeObstacles.length; i++) {
        var obstacle = activeObstacles[i];
        if (-canvas.width < obstacle.position.x && obstacle.position.x < canvas.width) {
          ctx.beginPath();
          ctx.arc(obstacle.position.x, obstacle.position.y, obstacle.size, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fill();
        }
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
