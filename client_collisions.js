(function () {
  var ships = [];
  var obstacles = [];
  function resetObjects() {
    ships = [];
    obstacles = [];
  }

  window.addEventListener('game:register-collision-objects', function (e) {
    ships = ships.concat(e.detail.ships || []);
    obstacles = obstacles.concat(e.detail.obstacles || []);
  });

  function distance(obj1, obj2) {
    return Math.sqrt(Math.pow(obj1.position.x - obj2.position.x, 2) + Math.pow(obj1.position.y - obj2.position.y, 2))
  }

  function collisionCheck(ship, obstacle) {
    if (ship.numbed) {
      return false;
    }
    // TODO: improve this collision logic
    return distance(ship, obstacle) < Math.min(ship.size, obstacle.size)
  }

  var checkForCollisionsTimeout;
  function checkForCollisions() {
    for (var i=0; i<ships.length; i++) {
      for (var j=0; j<obstacles.length; j++) {
        var ship = ships[i];
        var obstacle = obstacles[j];
        if (collisionCheck(ship, obstacle) && ship.processCollision) {
          ship.processCollision();
        }
      }
    }
    checkForCollisionsTimeout = setTimeout(checkForCollisions, 10);
  }

  window.addEventListener('game:start', function () {
    clearTimeout(checkForCollisionsTimeout);
    checkForCollisions();
  });

  window.addEventListener('game:end', function () {
    clearTimeout(checkForCollisionsTimeout);
    resetObjects();
  });

})();
