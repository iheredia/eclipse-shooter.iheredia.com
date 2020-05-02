function bindEvents() {
  window.addEventListener('keydown', function (event) {
    var key = event.key;
    if (key === 'ArrowUp' || key === 'w') {
      game.player.speed.y = -5
    } else if (key === 'ArrowDown' || key === 's') {
      game.player.speed.y = 5
    } else if (key === 'ArrowLeft' || key === 'a') {
      game.player.speed.x = -5
    } else if (key === 'ArrowRight' || key === 'd') {
      game.player.speed.x = 5
    }
  });

  window.addEventListener('keyup', function (event) {
    var key = event.key;
    if ((key === 'ArrowUp' || key === 'w') && game.player.speed.y < 0) {
      game.player.speed.y = 0
    } else if ((key === 'ArrowDown' || key === 's') && game.player.speed.y > 0) {
      game.player.speed.y = 0
    } else if ((key === 'ArrowLeft' || key === 'a') && game.player.speed.x < 0) {
      game.player.speed.x = 0
    } else if ((key === 'ArrowRight' || key === 'd') && game.player.speed.x > 0) {
      game.player.speed.x = 0
    }
  });
}
