(function () {
  var canvas = document.querySelector('#main-canvas');

  var ship;
  function processCollision() {
    ship.life -= 1;
    ship.alive = ship.life > 0;
    if (ship.alive) {
      var lifeChangeEvent = new CustomEvent('game:space-shooter:change-life', { detail: { life: ship.life } });
      window.dispatchEvent(lifeChangeEvent);

      var numbShipEvent = new CustomEvent('game:numb-ship', { detail: { ship: ship } });
      window.dispatchEvent(numbShipEvent);
    } else {
      var gameEndEvent = new CustomEvent('game:end');
      window.dispatchEvent(gameEndEvent);
    }
  }
  function initShip() {
    ship = {
      position: { x: -canvas.width, y: 0 },
      speed: { x: 0, y: 0 },
      size: 40,
      life: 3,
      player: true,
      alive: true,
      visible: true,
      controlsEnabled: false,
      processCollision: processCollision
    };
    var registerCollisionEvent = new CustomEvent('game:register-ships', { detail: { ships: [ship] } });
    window.dispatchEvent(registerCollisionEvent);
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

  var revealShipTimeout;
  function revealSpaceShip() {
    ship.speed.x = 0.2 + 5 * ship.position.x / -canvas.width;
    if (ship.position.x < 0) {
      revealShipTimeout = setTimeout(revealSpaceShip, 10);
    } else {
      ship.speed.x = 0;
    }
  }

  window.addEventListener('game:start', function () {
    initShip();
    var registerLifeEvent = new CustomEvent('game:space-shooter:change-life', { detail: { life: ship.life } });
    window.dispatchEvent(registerLifeEvent);
    var registerCollisionEvent = new CustomEvent('game:register-collision-objects', { detail: { ships: [ship] } });
    window.dispatchEvent(registerCollisionEvent);

    clearTimeout(revealShipTimeout);
    revealShipTimeout = setTimeout(revealSpaceShip, 2e3);
  });

  window.addEventListener('game:end', function () {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    clearTimeout(revealShipTimeout);
    ship = null;
  });
})();
