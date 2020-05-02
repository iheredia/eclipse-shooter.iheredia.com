function updateGameState() {
  updateObjects(game.backgroundStars);
  updateObjects([game.player]);

  game.context.rotation += 0.001;
  setTimeout(updateGameState, 10);
}

function drawObjects(objects) {
  for (var i=0; i<objects.length; i++) {
    var obj = objects[i];
    ctx.beginPath();
    ctx.arc(
      obj.position.x,
      obj.position.y,
      obj.size,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}

function drawGame() {
  var mainColor = '#ff6347';
  ctx.clearRect(-canvas.width/2, -canvas.height/2, canvas.width, canvas.height);

  // ctx.rotate(game.context.rotation);
  ctx.globalCompositeOperation='source-over';
  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.arc(0, 0, Math.min(canvas.width/2, canvas.height/2), 0, 2 * Math.PI);
  ctx.fill();

  ctx.globalCompositeOperation='xor';
  drawObjects(game.backgroundStars);
  drawObjects([game.player]);

  // ctx.rotate(-game.context.rotation);

  requestAnimationFrame(drawGame);
}
