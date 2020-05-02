(function () {
  window.addEventListener('game:start', function () {
    var canvas = document.querySelector('#main-canvas');
    var ctx = canvas.getContext('2d');

    var ship = {
      position: { x: -canvas.width, y: 0 },
      speed: { x: 0, y: 0 },
      size: 40,
    };

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

    function updateShipState() {
      ship.position.x += ship.speed.x;
      ship.position.y += ship.speed.y;
      if (ship.controlsEnabled) {
        ship.position.x = Math.min(ship.position.x , canvas.width/2);
        ship.position.x = Math.max(ship.position.x , -canvas.width/2);
        ship.position.y = Math.min(ship.position.y , canvas.height/2);
        ship.position.y = Math.max(ship.position.y , -canvas.height/2);
      }
      setTimeout(updateShipState, 10);
    }
    updateShipState();

    function drawRoutine() {
      ctx.fillStyle = '#ff6347';
      ctx.globalCompositeOperation='xor';
      ctx.beginPath();
      ctx.ellipse(
        ship.position.x,
        ship.position.y,
        ship.size,
        ship.size/3,
        0,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }
    var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
    window.dispatchEvent(registerDrawRoutineEvent);

    function revealSpaceShip() {
      ship.speed.x = 0.2 + 5 * ship.position.x / -canvas.width;
      if (ship.position.x < 0) {
        setTimeout(revealSpaceShip, 10);
      } else {
        ship.speed.x = 0;
        var controlsEnableEvent = new CustomEvent('game:space-shooter:controls-enable');
        window.dispatchEvent(controlsEnableEvent);
      }
    }
    setTimeout(revealSpaceShip, 2e3);
  });
})();
