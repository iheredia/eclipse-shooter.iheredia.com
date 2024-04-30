(function() {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  var ships = [];
  window.addEventListener('game:register-ships', function (e) {
    ships = ships.concat(e.detail.ships)
  })

  window.addEventListener('game:numb-ship', function (e) {
    var ship = e.detail.ship;

    ship.numbed = true;
    ship.visible = false;
    var blinkTimeout;
    function blinkShip() {
      ship.visible = !ship.visible;
      blinkTimeout = setTimeout(blinkShip, 100)
    }

    blinkShip();
    setTimeout(function () {
      clearTimeout(blinkTimeout);
      ship.visible = true;
      ship.numbed = false;
    }, 2500)
  })

  function drawRoutine() {
    for (var i=0; i<ships.length; i++) {
      var ship = ships[i];
      if (ship.visible) {
        ctx.fillStyle = '#ff6347';
        ctx.globalCompositeOperation = 'xor';
        ctx.beginPath();
        ctx.ellipse(ship.position.x, ship.position.y, ship.size, ship.size/3, 0, 0, 2 * Math.PI);
        ctx.ellipse(ship.position.x - 10, ship.position.y - 10, ship.size, ship.size/3, 0, 0, 2 * Math.PI);
        ctx.moveTo(ship.position.x, ship.position.y);
        ctx.ellipse(ship.position.x - 10, ship.position.y + 10, ship.size, ship.size/3, 0, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
  }
  var registerDrawRoutineEvent = new CustomEvent('game:draw-routine:add', { detail: { routine: drawRoutine } });
  window.dispatchEvent(registerDrawRoutineEvent);

  var updateStateTimeout;
  function updateState() {
    for (var i=0; i<ships.length; i++) {
      var ship = ships[i];
      ship.position.x += ship.speed.x;
      ship.position.y += ship.speed.y;
      if (ship.controlsEnabled) {
        ship.position.x = Math.min(ship.position.x , canvas.width/2);
        ship.position.x = Math.max(ship.position.x , -canvas.width/2);
        ship.position.y = Math.min(ship.position.y , canvas.height/2);
        ship.position.y = Math.max(ship.position.y , -canvas.height/2);
      }
    }
    updateStateTimeout = setTimeout(updateState, 10);
  }

  window.addEventListener('game:start', function () {
    ships = [];
    clearTimeout(updateStateTimeout);
    updateState();
  });

  window.addEventListener('game:end', function () {
    clearTimeout(updateStateTimeout);
  });
})();
