function initGameObjects() {
  game.player = createObject({
    size: 40
  });

  game.backgroundStars = [];
  for (var i=0; i<100; i++) {
    game.backgroundStars.push(createObject({
      position: {
        x: -canvas.width/2 + Math.random() * canvas.width,
        y: -canvas.height/2 + Math.random() * canvas.height,
      },
      speed: {
        x: -2 + Math.random() * -5,
      },
      size: 1 + Math.random() * 3,
    }));
  }

  game.context = {
    rotation: 0
  };
}

(function () {
  window.addEventListener('game:start', function () {
    console.log('game start');
  });
})();
