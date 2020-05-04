(function () {
  var UIContainer = document.querySelector('#space-shooter-ui');
  var scoreContainer = document.querySelector('#space-shooter-score');
  var lifeContainer = document.querySelector('#space-shooter-life');
  var gameOverScoreContainer = document.querySelector('#game-over-score');

  var score = 0;
  var autoIncrementeScoreTimeout;
  function autoIncrementScore() {
    score += 1;
    scoreContainer.textContent = score.toString().split('').join(' ');
    autoIncrementeScoreTimeout = setTimeout(autoIncrementScore, 100);
  }

  window.addEventListener('game:space-shooter:change-life', function (e) {
    const value = e.detail.life
    var life = [];
    for (var i=0; i<value; i++) {
      life.push('♥');
    }
    lifeContainer.textContent = life.join(' ');
  });

  window.addEventListener('game:start', function () {
    clearTimeout(autoIncrementeScoreTimeout);
    score = 0;
  })

  window.addEventListener('game:end', function () {
    gameOverScoreContainer.textContent = score.toString();
    UIContainer.classList.add('hidden');
    clearTimeout(autoIncrementeScoreTimeout);
  })

  window.addEventListener('game:space-shooter:controls-enable', function () {
    clearTimeout(autoIncrementeScoreTimeout);
    UIContainer.classList.remove('hidden');
    autoIncrementScore()
  })

  var nameInput = document.querySelector('#score-name');
  var submitButton = document.querySelector('#submit-button');
  var highScoreList = document.querySelector('#high-score-list');
  var submitDialog = document.querySelector('#submit-dialog');
  var highScores = document.querySelector('#high-scores');
  submitButton.addEventListener('click', function () {
    nameInput.disabled = true;
    submitButton.disabled = true;
    var xhr = new XMLHttpRequest();
    var name = nameInput.value;
    var url = '/score?name=' + name + '&score=' + score.toString();
    xhr.open("POST", url, true);
    xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.response) {
        var scores = JSON.parse(xhr.response);
        highScoreList.innerHTML = '';
        for (var i=0; i<scores.length; i++) {
          var nameElement = document.createElement('div')
          nameElement.textContent = scores[i].key
          nameElement.classList.add('score-name');
          var scoreElement = document.createElement('div');
          scoreElement.textContent = scores[i].data;
          scoreElement.classList.add('score-value');
          var container = document.createElement('div')
          container.appendChild(nameElement);
          container.appendChild(scoreElement);
          highScoreList.appendChild(container);
        }
        submitDialog.classList.add('hidden');
        highScores.classList.remove('hidden');
      }
    };
    xhr.send();
  })
})();
