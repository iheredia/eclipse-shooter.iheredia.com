// TODO: don't show the animation after game restarts or give the option of skipping it

(function () {
  var canvas = document.querySelector('#main-canvas');

  var doomedShips;
  function processCollision() {
    if (doomedShips[0].alive) {
      for (var i=0; i<doomedShips.length; i++) {
        var ship = doomedShips[i];
        ship.alive = false;
        ship.speed.x = -0.5;
        var numbShipEvent = new CustomEvent('game:numb-ship', { detail: { ship: ship } });
        window.dispatchEvent(numbShipEvent);
      }
      setTimeout(function () {
        doomedShips[0].visible = false;
        doomedShips[1].visible = false;
        var controlsEnableEvent = new CustomEvent('game:space-shooter:controls-enable');
        window.dispatchEvent(controlsEnableEvent);
      }, 2600)
    }
  }
  function initDoomedShips() {
    doomedShips = [
      {
        position: { x: -canvas.width - 50, y: -100 },
        speed: { x: 0, y: 0 },
        size: 40,
        life: 1,
        player: false,
        alive: true,
        visible: true,
        processCollision: processCollision,
      },
      {
        position: { x: -canvas.width - 50, y: 100 },
        speed: { x: 0, y: 0 },
        size: 40,
        life: 1,
        player: false,
        alive: true,
        visible: true,
      }
    ];
    var registerCollisionEvent = new CustomEvent('game:register-ships', { detail: { ships: doomedShips } });
    window.dispatchEvent(registerCollisionEvent);
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

  window.addEventListener('game:start', function () {
    initDoomedShips();

    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { ships: doomedShips } });
    window.dispatchEvent(registerCollisionEvent);

    clearTimeout(revealShipsTimeout);
    revealShipsTimeout = setTimeout(revealShips, 2e3);
  });

  window.addEventListener('game:end', function () {
    clearTimeout(revealShipsTimeout);
  });
})();
