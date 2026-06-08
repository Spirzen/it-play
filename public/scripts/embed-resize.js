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

  var lastPosted = 0;
  var rafId = 0;

  function hideLoadingMask() {
    var mask = document.getElementById('embed-loading');
    if (mask) mask.hidden = true;
  }

  function measureHeight() {
    var root = document.querySelector('.embed-main');
    if (root) {
      var rect = root.getBoundingClientRect();
      return Math.ceil(
        Math.max(root.scrollHeight, root.offsetHeight, rect.height, root.clientHeight),
      );
    }
    return Math.ceil(
      Math.max(
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.scrollHeight,
      ),
    );
  }

  function postHeightNow() {
    rafId = 0;
    var height = Math.max(measureHeight(), 120);
    if (Math.abs(height - lastPosted) < 2) {
      return;
    }
    lastPosted = height;
    hideLoadingMask();
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

  function schedulePostHeight() {
    if (rafId) return;
    rafId = requestAnimationFrame(postHeightNow);
  }

  window.addEventListener('load', schedulePostHeight);
  window.addEventListener('resize', schedulePostHeight);
  if (typeof ResizeObserver !== 'undefined') {
    var root = document.querySelector('.embed-main');
    var observeTarget = root || document.body;
    new ResizeObserver(schedulePostHeight).observe(observeTarget);
  }
  [0, 120, 400, 1000].forEach(function (ms) {
    setTimeout(schedulePostHeight, ms);
  });
})();
