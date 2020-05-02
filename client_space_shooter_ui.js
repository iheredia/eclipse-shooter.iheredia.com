(function () {
  var scoreContainer = document.querySelector('#space-shooter-score');
  var lifeContainer = document.querySelector('#space-shooter-life');
  window.addEventListener('game:space-shooter:controls-enable', function () {
    document.querySelector('#space-shooter-ui').classList.remove('hidden');

    var score = 0;
    function autoIncrementScore() {
      score += 1;
      scoreContainer.textContent = score.toString(16).split('').join(' ');
      setTimeout(autoIncrementScore, 100);
    }
    autoIncrementScore()

    window.addEventListener('game:space-shooter:change-score', function (e) {
      score += e.detail.increase
    });

    var life = ['●', '●', '●'];
    window.addEventListener('game:space-shooter:change-life', function (e) {
      const value = e.detail.increase
      for (var i=0; i<Math.abs(value); i++) {
        if (value > 0) {
          life.push('●');
        } else if (value < 0) {
          life.pop();
        }
      }
      lifeContainer.textContent = life.join(' ');
    });
  })
})();
