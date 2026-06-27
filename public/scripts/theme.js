(function () {
  var STORAGE_KEY = 'theme';
  var html = document.documentElement;

  function resolveSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function readStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch (e) {}
    return null;
  }

  function readUrlTheme() {
    try {
      var params = new URLSearchParams(window.location.search);
      var theme = params.get('theme');
      if (theme === 'light' || theme === 'dark') {
        return theme;
      }
    } catch (e) {}
    return null;
  }

  function applyTheme(theme, persist) {
    var resolved = theme === 'light' || theme === 'dark' ? theme : resolveSystemTheme();
    html.setAttribute('data-theme', resolved);
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, resolved);
      } catch (e) {}
      notifyParentTheme(resolved);
    }
    syncToggle(resolved);
    return resolved;
  }

  function isEmbedContext() {
    return window.location.pathname.indexOf('/p/embed/') !== -1;
  }

  function notifyParentTheme(theme) {
    if (!isEmbedContext()) return;
    var post =
      window.ITUParentOrigin && window.ITUParentOrigin.postToParent
        ? window.ITUParentOrigin.postToParent
        : function (payload) {
            if (!window.parent || window.parent === window) return;
            try {
              window.parent.postMessage(payload, '*');
            } catch (e) {}
          };
    post({type: 'itu-theme-change', theme: theme, source: 'itu-play'});
  }

  function syncToggle(theme) {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      var target = btn.getAttribute('data-theme-toggle');
      var active = target === theme;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function init() {
    var initial = readUrlTheme() || readStoredTheme() || resolveSystemTheme();
    applyTheme(initial, false);

    document.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-theme-toggle]');
      if (!btn) return;
      var theme = btn.getAttribute('data-theme-toggle');
      if (theme !== 'light' && theme !== 'dark') return;
      applyTheme(theme, true);
    });

    window.addEventListener('message', function (event) {
      var data = event.data;
      if (!data || data.type !== 'it-play-theme') return;
      if (data.theme !== 'light' && data.theme !== 'dark') return;
      applyTheme(data.theme, false);
    });

    try {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (!readStoredTheme() && !readUrlTheme()) {
          applyTheme(resolveSystemTheme(), false);
        }
      });
    } catch (e) {}
  }

  init();
})();
