(function () {
  var scoreContainer = document.querySelector('#space-shooter-score');
  var lifeContainer = document.querySelector('#space-shooter-life');

  var score = 0;
  function autoIncrementScore() {
    score += 1;
    scoreContainer.textContent = score.toString(16).split('').join(' ');
    setTimeout(autoIncrementScore, 100);
  }
  window.addEventListener('game:space-shooter:change-score', function (e) {
    score += e.detail.increase
  });

  window.addEventListener('game:space-shooter:change-life', function (e) {
    const value = e.detail.life
    var life = [];
    for (var i=0; i<value; i++) {
      life.push('♥');
    }
    lifeContainer.textContent = life.join(' ');
  });

  window.addEventListener('game:space-shooter:controls-enable', function () {
    document.querySelector('#space-shooter-ui').classList.remove('hidden');
    autoIncrementScore()
  })
})();
