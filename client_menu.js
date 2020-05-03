(function () {
  var startButton = document.querySelector('#start-button');
  var canvas = document.querySelector('#main-canvas');

  window.addEventListener('game:start', function() {
    window.removeEventListener('keypress', startOnEnter);
    startButton.disabled = true;
    canvas.classList.add('game-active');
  })

  window.addEventListener('game:end', function() {
    // TODO: improve. Show a game over menu or game won depending on event data
    window.addEventListener('keypress', startOnEnter);
    startButton.disabled = false;
    canvas.classList.remove('game-active');
  })

  function dispatchStartGameEvent() {
    var event = new CustomEvent('game:start');
    window.dispatchEvent(event);
  }
  startButton.addEventListener('click', dispatchStartGameEvent);

  function startOnEnter(e) {
    if (e.key === 'Enter') {
      dispatchStartGameEvent();
    }
  }
  window.addEventListener('keypress', startOnEnter);

})();
