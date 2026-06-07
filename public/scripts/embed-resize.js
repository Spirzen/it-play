(function () {
  var isEmbedPath = window.location.pathname.indexOf('/p/embed/') !== -1;
  if (!isEmbedPath) return;

  var allowed = [
    'https://spirzen.ru',
    'https://www.spirzen.ru',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ];

  function measureHeight() {
    var root = document.querySelector('.embed-main');
    if (root) {
      return Math.ceil(root.getBoundingClientRect().height);
    }
    return Math.ceil(document.documentElement.offsetHeight);
  }

  function postHeight() {
    var height = Math.max(measureHeight(), 120);
    if (window.parent && window.parent !== window) {
      allowed.forEach(function (origin) {
        try {
          window.parent.postMessage({type: 'it-play-embed-height', height: height}, origin);
        } catch (e) {
          /* ignore */
        }
      });
    }
  }

  window.addEventListener('load', postHeight);
  window.addEventListener('resize', postHeight);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(postHeight).observe(document.body);
  }
  [0, 80, 160, 320, 600, 1200].forEach(function (ms) {
    setTimeout(postHeight, ms);
  });
})();
