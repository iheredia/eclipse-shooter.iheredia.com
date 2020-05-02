(function () {
  window.addEventListener('game:start', function () {
    var canvas = document.querySelector('#main-canvas');
    var ctx = canvas.getContext('2d');

    var ship = {
      position: { x: -canvas.width, y: 0 },
      speed: { x: 0, y: 0 },
      size: 40,
      life: 3,
      player: true,
      alive: true,
    };
    var doomedShips = [
      {
        position: { x: -canvas.width - 50, y: -100 },
        speed: { x: 0, y: 0 },
        size: 40,
        life: 1,
        player: false,
        alive: true,
      },
      {
        position: { x: -canvas.width - 50, y: 100 },
        speed: { x: 0, y: 0 },
        size: 40,
        life: 1,
        player: false,
        alive: true,
      }
    ]

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

    var obstacles = obstaclesTemplates.shift()

    function onKeyDown (event) {
      var key = event.key;
      if (key === 'ArrowUp' || key === 'w') {
        ship.speed.y = -5
      } else if (key === 'ArrowDown' || key === 's') {
        ship.speed.y = 5
      } else if (key === 'ArrowLeft' || key === 'a') {
        ship.speed.x = -5
      } else if (key === 'ArrowRight' || key === 'd') {
        ship.speed.x = 5
      }
    }
    function onKeyUp (event) {
      var key = event.key;
      if ((key === 'ArrowUp' || key === 'w') && ship.speed.y < 0) {
        ship.speed.y = 0
      } else if ((key === 'ArrowDown' || key === 's') && ship.speed.y > 0) {
        ship.speed.y = 0
      } else if ((key === 'ArrowLeft' || key === 'a') && ship.speed.x < 0) {
        ship.speed.x = 0
      } else if ((key === 'ArrowRight' || key === 'd') && ship.speed.x > 0) {
        ship.speed.x = 0
      }
    }

    window.addEventListener('game:space-shooter:controls-enable', function () {
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      ship.controlsEnabled = true;
    })

    window.addEventListener('game:space-shooter:controls-disable', function () {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      ship.controlsEnabled = false;
    })

    function moveObjects() {
      if (doomedShips.length) {
        doomedShips[0].position.x += doomedShips[0].speed.x;
        doomedShips[1].position.x += doomedShips[1].speed.x;
      }

      ship.position.x += ship.speed.x;
      ship.position.y += ship.speed.y;
      if (ship.controlsEnabled) {
        ship.position.x = Math.min(ship.position.x , canvas.width/2);
        ship.position.x = Math.max(ship.position.x , -canvas.width/2);
        ship.position.y = Math.min(ship.position.y , canvas.height/2);
        ship.position.y = Math.max(ship.position.y , -canvas.height/2);
      }

      var allObstaclesWentBy = true;
      for (var i=0; i<obstacles.length; i++) {
        var obstacle = obstacles[i];
        obstacle.position.x += obstacle.speed.x;
        obstacle.rotation += 0.1;
        allObstaclesWentBy = allObstaclesWentBy && obstacle.position.x < -canvas.width;
      }
      if (allObstaclesWentBy && obstaclesTemplates.length) {
        obstacles = obstaclesTemplates.shift();
      } else if (allObstaclesWentBy && obstaclesTemplates.length === 0) {
        console.log('All obstacles went by');
      }
      setTimeout(updateState, 10);
    }

    function checkForCollisions() {
      function distance(obj1, obj2) {
        return Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2))
      }
      const ships = [ship].concat(doomedShips);
      for (var i=0; i<ships.length; i++) {
        for (var j=0; j<obstacles.length; j++) {
          var distanceBetween = distance(ships[i], obstacles[j]);
          if (obstacles[j].alive && distanceBetween < Math.min(ships[i].size, obstacles[j].size)) {
            obstacles[j].alive = false;
            ships[i].life -= 1;
            ships[i].alive = ships[i].life > 0;
            ships[i].blinkCounter = 100;
            console.log('collision');
            if (ships[i].player) {
              var lifeChangeEvent = new CustomEvent('game:space-shooter:change-life', { detail: { life: ships[i].life } });
              window.dispatchEvent(lifeChangeEvent);
            } else {
              ships[i].alive = false;
              ships[i].speed.x = -0.5;
              setTimeout(function () {
                var controlsEnableEvent = new CustomEvent('game:space-shooter:controls-enable');
                window.dispatchEvent(controlsEnableEvent);
              }, 3e3)
            }
          }
        }
      }

    }

    function updateState() {
      moveObjects();
      checkForCollisions();
    }
    updateState();

    function revealSpaceShip() {
      ship.speed.x = 0.2 + 5 * ship.position.x / -canvas.width;
      if (doomedShips.length) {
        doomedShips[0].speed.x = ship.speed.x;
        doomedShips[1].speed.x = ship.speed.x;
      }
      if (ship.position.x < 0) {
        setTimeout(revealSpaceShip, 10);
      } else {
        ship.speed.x = 0;
        if (doomedShips.length) {
          doomedShips[0].speed.x = 0;
          doomedShips[1].speed.x = 0;
        }
      }
    }
    setTimeout(revealSpaceShip, 2e3);

    function drawRoutine() {
      const ships = [ship].concat(doomedShips);
      for (var j=0; j<ships.length; j++) {
        ctx.fillStyle = (ships[j].blinkCounter > 0 && ships[j].blinkCounter % 10 < 5) || (!ships[j].alive && ships[j].blinkCounter <= 0) ? 'transparent' : '#ff6347';
        ships[j].blinkCounter = ships[j].blinkCounter > 0 ? ships[j].blinkCounter - 1 : ships[j].blinkCounter;
        ctx.globalCompositeOperation='xor';
        ctx.beginPath();
        ctx.ellipse(ships[j].position.x, ships[j].position.y, ships[j].size, ships[j].size/3, 0, 0, 2 * Math.PI);
        ctx.ellipse(ships[j].position.x - 10, ships[j].position.y - 10, ships[j].size, ships[j].size/3, 0, 0, 2 * Math.PI);
        ctx.moveTo(ships[j].position.x, ships[j].position.y);
        ctx.ellipse(ships[j].position.x - 10, ships[j].position.y + 10, ships[j].size, ships[j].size/3, 0, 0, 2 * Math.PI);
        ctx.fill();
      }

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
