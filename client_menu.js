(function () {
  var startButton = document.querySelector('#start-button');
  var canvas = document.querySelector('#main-canvas');
  startButton.addEventListener('click', function () {
    startButton.disabled = true;
    canvas.classList.add('game-active');

    var event = new CustomEvent('game:start');
    window.dispatchEvent(event);
  });
})();
