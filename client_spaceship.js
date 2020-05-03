(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  var ship;
  function initShip() {
    ship = {
      position: { x: -canvas.width, y: 0 },
      speed: { x: 0, y: 0 },
      size: 40,
      life: 3,
      player: true,
      alive: true,
      controlsEnabled: false,
    };
  }

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

  var updateStateTimeout;
  function updateState() {
    ship.position.x += ship.speed.x;
    ship.position.y += ship.speed.y;
    if (ship.controlsEnabled) {
      ship.position.x = Math.min(ship.position.x , canvas.width/2);
      ship.position.x = Math.max(ship.position.x , -canvas.width/2);
      ship.position.y = Math.min(ship.position.y , canvas.height/2);
      ship.position.y = Math.max(ship.position.y , -canvas.height/2);
    }
    updateStateTimeout = setTimeout(updateState, 10);
  }

  var revealShipTimeout;
  function revealSpaceShip() {
    ship.speed.x = 0.2 + 5 * ship.position.x / -canvas.width;
    if (ship.position.x < 0) {
      revealShipTimeout = setTimeout(revealSpaceShip, 10);
    } else {
      ship.speed.x = 0;
    }
  }

  function drawRoutine() {
    if (ship) {
      // TODO: the following lines keeps flagging because are exactly the same as in the doomed ships
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
  var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
  window.dispatchEvent(registerDrawRoutineEvent);

  window.addEventListener('game:start', function () {
    initShip();

    var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
    window.dispatchEvent(registerDrawRoutineEvent);
    var registerLifeEvent = new CustomEvent('game:space-shooter:change-life', { detail: { life: ship.life } });
    window.dispatchEvent(registerLifeEvent);
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { ships: [ship] } });
    window.dispatchEvent(registerCollisionEvent);

    clearTimeout(updateStateTimeout);
    updateState();

    clearTimeout(revealShipTimeout);
    revealShipTimeout = setTimeout(revealSpaceShip, 2e3);
  });

  window.addEventListener('game:end', function () {
    var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:remove', { detail: { routine: drawRoutine } });
    window.dispatchEvent(registerDrawRoutineEvent);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    clearTimeout(updateStateTimeout);
    clearTimeout(revealShipTimeout);
    ship = null;
  });
})();
