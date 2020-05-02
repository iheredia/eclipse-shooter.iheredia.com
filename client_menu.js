(function () {
  const startButton = document.querySelector('#start-button');
  const canvas = document.querySelector('#main-canvas');
  startButton.addEventListener('click', function () {
    startButton.disabled = true;
    canvas.classList.add('game-active');

    var event = new Event('game:start');
    window.dispatchEvent(event);
  });
})();
