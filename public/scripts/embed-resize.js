(function () {
  var isEmbedPath = window.location.pathname.indexOf('/p/embed/') !== -1;
  if (!isEmbedPath) return;

  var FALLBACK_PARENT_ORIGINS = [
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

  function isFullscreenActive() {
    return document.documentElement.hasAttribute('data-it-demo-fullscreen');
  }

  function isEmbeddedInParent() {
    try {
      return window.parent && window.parent !== window;
    } catch (e) {
      return true;
    }
  }

  function resolveParentOrigin() {
    if (!isEmbeddedInParent()) return null;
    try {
      return window.parent.location.origin;
    } catch (e) {
      if (document.referrer) {
        try {
          return new URL(document.referrer).origin;
        } catch (e2) {
          /* ignore */
        }
      }
    }
    return null;
  }

  function postToParent(message) {
    if (!isEmbeddedInParent()) return;
    var origin = resolveParentOrigin();
    if (origin) {
      try {
        window.parent.postMessage(message, origin);
      } catch (e) {
        /* ignore */
      }
      return;
    }
    FALLBACK_PARENT_ORIGINS.forEach(function (fallbackOrigin) {
      try {
        window.parent.postMessage(message, fallbackOrigin);
      } catch (e) {
        /* ignore */
      }
    });
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
    if (isFullscreenActive()) {
      return;
    }

    var height = Math.max(measureHeight(), 120);
    if (Math.abs(height - lastPosted) < 2) {
      return;
    }
    lastPosted = height;
    hideLoadingMask();
    postToParent({type: 'it-play-embed-height', height: height});
  }

  function schedulePostHeight() {
    if (isFullscreenActive()) {
      return;
    }
    if (rafId) return;
    rafId = requestAnimationFrame(postHeightNow);
  }

  function scheduleRemeasureAfterFullscreen() {
    [80, 250, 500].forEach(function (ms) {
      window.setTimeout(schedulePostHeight, ms);
    });
  }

  window.addEventListener('it-demo-fullscreen-change', function (event) {
    if (event.detail && event.detail.active) {
      return;
    }
    scheduleRemeasureAfterFullscreen();
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
