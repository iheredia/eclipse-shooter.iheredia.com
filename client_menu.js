(function () {
  var startButton = document.querySelector('#start-button');
  var canvas = document.querySelector('#main-canvas');

  function startGame() {
    window.removeEventListener('keypress', startOnEnter);
    startButton.disabled = true;
    canvas.classList.add('game-active');
    var event = new CustomEvent('game:start');
    window.dispatchEvent(event);
  }
  startButton.addEventListener('click', startGame);

  function startOnEnter(e) {
    if (e.key === 'Enter') {
      startGame();
    }
  }
  window.addEventListener('keypress', startOnEnter);

})();
