(function () {
  function distance(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2))
  }

  var ships = [];
  var obstacles = [];
  window.addEventListener('game:register-collision-objects', function (e) {
    if (e.detail.ships) {
      ships = ships.concat(e.detail.ships);
    }
    if (e.detail.obstacles) {
      obstacles = obstacles.concat(e.detail.obstacles);
    }
  });

  function checkForCollisions() {
    for (var i=0; i<ships.length; i++) {
      for (var j=0; j<obstacles.length; j++) {
        var ship = ships[i];
        var obstacle = obstacles[j];
        var distanceBetween = distance(ship, obstacle);
        if (obstacle.alive && distanceBetween < Math.min(ship.size, obstacle.size)) {
          obstacle.alive = false; // TODO: avoid flagging obstacles as alive. Instead use a numbed attr in the ships
          ship.life -= 1;
          ship.alive = ship.life > 0;
          ship.blinkCounter = 100;
          if (ship.player) {
            var lifeChangeEvent = new CustomEvent('game:space-shooter:change-life', { detail: { life: ship.life } });
            window.dispatchEvent(lifeChangeEvent);
          } else {
            ship.alive = false;
            ship.speed.x = -0.5;
            setTimeout(function () {
              var controlsEnableEvent = new CustomEvent('game:space-shooter:controls-enable');
              window.dispatchEvent(controlsEnableEvent);
            }, 3e3)
          }
        }
      }
    }
    setTimeout(checkForCollisions, 10);
  }
  checkForCollisions();
})();
