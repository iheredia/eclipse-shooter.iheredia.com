(function () {
  var startButton = document.querySelector('#start-button');
  var restartButton = document.querySelector('#restart-button');
  var canvas = document.querySelector('#main-canvas');

  window.addEventListener('game:start', function() {
    window.removeEventListener('keypress', startOnEnter);
    startButton.disabled = true;
    restartButton.disabled = true;
    canvas.classList.remove('game-inactive');
    canvas.classList.remove('game-over');
    canvas.classList.add('game-active');
  })

  window.addEventListener('game:end', function() {
    window.addEventListener('keypress', startOnEnter);
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
