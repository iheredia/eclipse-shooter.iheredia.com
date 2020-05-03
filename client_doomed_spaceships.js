(function () {
  window.addEventListener('game:start', function () {
    var canvas = document.querySelector('#main-canvas');
    var ctx = canvas.getContext('2d');

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
    ];
    var lifeChangeEvent = new CustomEvent('game:register-collision-objects', { detail: { ships: doomedShips } });
    window.dispatchEvent(lifeChangeEvent);

    function updateState() {
      doomedShips[0].position.x += doomedShips[0].speed.x;
      doomedShips[1].position.x += doomedShips[1].speed.x;
      setTimeout(updateState, 10);
    }
    updateState();

    function revealShips() {
      var speed = 0.2 + 5 * (doomedShips[0].position.x + 50) / -canvas.width
      doomedShips[0].speed.x = speed;
      doomedShips[1].speed.x = speed;
      if (doomedShips[0].position.x < -50) {
        setTimeout(revealShips, 10);
      } else {
        doomedShips[0].speed.x = 0;
        doomedShips[1].speed.x = 0;
      }
    }
    setTimeout(revealShips, 2e3);

    function drawRoutine() {
      for (var j=0; j<doomedShips.length; j++) {
        var ship = doomedShips[j];
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
  });
})();
