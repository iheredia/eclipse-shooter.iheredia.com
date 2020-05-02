// TODO: debug weird flashy score counter
// TODO: avoid having life characters in the index.html file

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

    var life = ['♥', '♥', '♥'];
    window.addEventListener('game:space-shooter:change-life', function (e) {
      const value = e.detail.life
      console.log('changed life', value)
      life = [];
      for (var i=0; i<value; i++) {
        life.push('♥');
      }
      lifeContainer.textContent = life.join(' ');
    });
  })
})();
