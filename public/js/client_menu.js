(function () {
  var startButton = document.querySelector('#start-button');
  var restartButton = document.querySelector('#restart-button');
  var canvas = document.querySelector('#main-canvas');
  var submitDialog = document.querySelector('#submit-dialog');
  var highScores = document.querySelector('#high-scores');
  var submitButton = document.querySelector('#submit-button')
  var nameInput = document.querySelector('#score-name');

  window.addEventListener('game:start', function() {
    window.removeEventListener('keypress', startOnEnter);
    startButton.disabled = true;
    restartButton.disabled = true;
    canvas.classList.remove('game-inactive');
    canvas.classList.remove('game-over');
    canvas.classList.add('game-active');
  })

  function validateNameInput() {
    submitButton.disabled = nameInput.value.trim().length === 0;
  }
  nameInput.addEventListener('keydown', validateNameInput)
  nameInput.addEventListener('input', validateNameInput)
  nameInput.addEventListener('paste', validateNameInput)

  window.addEventListener('game:end', function() {
    submitDialog.classList.remove('hidden');
    highScores.classList.add('hidden');
    nameInput.value = '';
    nameInput.disabled = false;
    submitButton.disabled = true;
    restartButton.disabled = false;
    canvas.classList.remove('game-inactive');
    canvas.classList.remove('game-active');
    canvas.classList.add('game-over');
  })

  function dispatchStartGameEvent() {
    var event = new CustomEvent('game:start');
    window.dispatchEvent(event);
  }
  startButton.addEventListener('click', dispatchStartGameEvent);
  restartButton.addEventListener('click', dispatchStartGameEvent);

  function startOnEnter(e) {
    if (e.key === 'Enter') {
      dispatchStartGameEvent();
    }
  }
  window.addEventListener('keypress', startOnEnter);

})();
