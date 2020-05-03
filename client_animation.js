// TODO: pause the game when it loses focus

(function () {
  var canvas = document.querySelector('#main-canvas');
  var ctx = canvas.getContext('2d');

  var drawRoutines = []
  window.addEventListener('game:draw-routine:add', function (e) {
    var routine = e.detail.routine;
    if (drawRoutines.indexOf(routine) === -1) {
      drawRoutines.push(e.detail.routine);
    }
  })

  window.addEventListener('game:draw-routine:remove', function (e) {
    var routine = e.detail.routine;
    var index = drawRoutines.indexOf(routine);
    if (index !== -1) {
      drawRoutines.splice(index, 1);
    }
  })

  function drawGame () {
    ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);
    for (var i=0; i<drawRoutines.length; i++) {
      drawRoutines[i]();
    }
    requestAnimationFrame(drawGame);
  }
  drawGame();
})();
