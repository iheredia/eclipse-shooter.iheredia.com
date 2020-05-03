(function () {
  window.addEventListener('game:start', function () {
    var canvas = document.querySelector('#main-canvas');
    var ctx = canvas.getContext('2d');

    var obstaclesTemplates = [
      [
        {
          position: { x: canvas.width * 5, y: - 100 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        },
        {
          position: { x: canvas.width * 5, y: 100 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        }
      ],
      [
        {
          position: { x: canvas.width * 3, y: 0 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        }
      ],
      [
        {
          position: { x: canvas.width * 2, y: - 100 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        },
        {
          position: { x: canvas.width * 2, y: 0 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        },
        {
          position: { x: canvas.width * 2, y: 100 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        }
      ],
      [
        {
          position: { x: canvas.width * 2 - 25, y: - 150 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        },
        {
          position: { x: canvas.width * 2, y: - 50 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        },
        {
          position: { x: canvas.width * 2 + 25, y: 50 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        },
        {
          position: { x: canvas.width * 2 + 50, y: 150 },
          speed: { x: -5 },
          size: 30,
          rotation: 0,
          alive: true,
        },
      ],
    ]

    var obstacles = [];
    function updateState() {
      var allObstaclesWentBy = true;
      for (var i=0; i<obstacles.length; i++) {
        var obstacle = obstacles[i];
        obstacle.position.x += obstacle.speed.x;
        obstacle.rotation += 0.1;
        allObstaclesWentBy = allObstaclesWentBy && obstacle.position.x < -canvas.width;
      }
      if (allObstaclesWentBy && obstaclesTemplates.length) {
        obstacles = obstaclesTemplates.shift();
        var lifeChangeEvent = new CustomEvent('game:register-collision-objects', { detail: { obstacles: obstacles } });
        window.dispatchEvent(lifeChangeEvent);
      } else if (allObstaclesWentBy && obstaclesTemplates.length === 0) {
        console.log('All obstacles went by');
      }
      setTimeout(updateState, 10);
    }
    updateState();

    function drawRoutine() {
      ctx.fillStyle = '#509EB8';
      for (var i=0; i<obstacles.length; i++) {
        var obstacle = obstacles[i];
        ctx.translate(obstacle.position.x, obstacle.position.y);
        ctx.rotate(Math.PI/4 + obstacle.rotation);
        ctx.fillRect(-obstacle.size/2, -obstacle.size/2, obstacle.size, obstacle.size);
        ctx.rotate(-Math.PI/4);
        ctx.fillRect(-obstacle.size/2, -obstacle.size/2, obstacle.size, obstacle.size);
        ctx.rotate(-obstacle.rotation);
        ctx.translate(-obstacle.position.x, -obstacle.position.y);
      }
    }
    var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
    window.dispatchEvent(registerDrawRoutineEvent);
  });
})();
