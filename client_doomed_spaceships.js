(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  var doomedShips;
  function initDoomedShips() {
    doomedShips = [
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
    ];
  }

  var updateStateTimeout;
  function updateState() {
    doomedShips[0].position.x += doomedShips[0].speed.x;
    doomedShips[1].position.x += doomedShips[1].speed.x;
    updateStateTimeout = setTimeout(updateState, 10);
  }

  var revealShipsTimeout;
  function revealShips() {
    var speed = 0.2 + 5 * (doomedShips[0].position.x + 50) / -canvas.width
    doomedShips[0].speed.x = speed;
    doomedShips[1].speed.x = speed;
    if (doomedShips[0].position.x < -50) {
      revealShipsTimeout = setTimeout(revealShips, 10);
    } else {
      doomedShips[0].speed.x = 0;
      doomedShips[1].speed.x = 0;
    }
  }

  function drawRoutine() {
    for (var j=0; j<doomedShips.length; j++) {
      var ship = doomedShips[j];
      // TODO: the following lines keeps flagging because are exactly the same as in the main ship
      ctx.fillStyle = (ship.blinkCounter > 0 && ship.blinkCounter % 10 < 5) || (!ship.alive && ship.blinkCounter <= 0) ? 'transparent' : '#ff6347';
      ship.blinkCounter = ship.blinkCounter > 0 ? ship.blinkCounter - 1 : ship.blinkCounter;
      ctx.globalCompositeOperation='xor';
      ctx.beginPath();
      ctx.ellipse(ship.position.x, ship.position.y, ship.size, ship.size/3, 0, 0, 2 * Math.PI);
      ctx.ellipse(ship.position.x - 10, ship.position.y - 10, ship.size, ship.size/3, 0, 0, 2 * Math.PI);
      ctx.moveTo(ship.position.x, ship.position.y);
      ctx.ellipse(ship.position.x - 10, ship.position.y + 10, ship.size, ship.size/3, 0, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  window.addEventListener('game:start', function () {
    initDoomedShips();

    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { ships: doomedShips } });
    window.dispatchEvent(registerCollisionEvent);

    clearTimeout(updateStateTimeout);
    updateState();

    clearTimeout(revealShipsTimeout);
    revealShipsTimeout = setTimeout(revealShips, 2e3);

    var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
    window.dispatchEvent(registerDrawRoutineEvent);
  });

  window.addEventListener('game:end', function () {
    clearTimeout(updateStateTimeout);
    clearTimeout(revealShipsTimeout);
    var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:remove', { detail: { routine: drawRoutine } });
    window.dispatchEvent(registerDrawRoutineEvent);
  });
})();
