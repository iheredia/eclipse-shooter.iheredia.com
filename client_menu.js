(function () {
  var startButton = document.querySelector('#start-button');
  var canvas = document.querySelector('#main-canvas');

  function startGame() {
    startButton.disabled = true;
    canvas.classList.add('game-active');
    var event = new CustomEvent('game:start');
    window.dispatchEvent(event);
  }
  startButton.addEventListener('click', startGame);

  function startOnEnter(e) {
    if (e.key === 'Enter') {
      startGame();
      window.removeEventListener('keypress', startOnEnter);
    }
  }
  window.addEventListener('keypress', startOnEnter);

})();
