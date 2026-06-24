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
  var settleTimer = 0;
  var settling = false;

  function hideLoadingMask() {
    var mask = document.getElementById('embed-loading');
    if (mask) mask.hidden = true;
  }

  function isFullscreenActive() {
    return document.documentElement.hasAttribute('data-it-demo-fullscreen');
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

  function postHeightNow(force) {
    rafId = 0;
    if (!force && isFullscreenActive()) {
      return;
    }

    var height = Math.max(measureHeight(), 120);
    if (!force && Math.abs(height - lastPosted) < 2) {
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
    if (isFullscreenActive()) {
      return;
    }
    if (settling) {
      return;
    }
    if (rafId) return;
    rafId = requestAnimationFrame(function () {
      postHeightNow(false);
    });
  }

  function clearEmbedMainMinHeight() {
    var main = document.querySelector('.embed-main');
    if (main) {
      main.style.minHeight = '';
    }
  }

  function settleHeightAfterFullscreen() {
    settling = true;
    if (settleTimer) {
      clearTimeout(settleTimer);
    }

    var attempts = 0;
    var lastMeasure = 0;
    var stableCount = 0;

    function tick() {
      if (isFullscreenActive()) {
        settling = false;
        return;
      }

      var height = measureHeight();
      attempts += 1;

      if (Math.abs(height - lastMeasure) < 2) {
        stableCount += 1;
      } else {
        stableCount = 0;
        lastMeasure = height;
      }

      if (stableCount >= 2 || attempts >= 16) {
        settling = false;
        postHeightNow(true);
        settleTimer = window.setTimeout(function () {
          clearEmbedMainMinHeight();
          schedulePostHeight();
        }, 120);
        return;
      }

      settleTimer = window.setTimeout(tick, 60);
    }

    settleTimer = window.setTimeout(tick, 80);
  }

  window.addEventListener('it-demo-fullscreen-change', function (event) {
    var active = event.detail && event.detail.active;
    if (active) {
      if (settleTimer) {
        clearTimeout(settleTimer);
        settleTimer = 0;
      }
      settling = false;
      return;
    }
    settleHeightAfterFullscreen();
  });

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
