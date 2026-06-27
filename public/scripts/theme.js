(function () {
  var STORAGE_KEY = 'itu-portal-theme';
  var LEGACY_KEY = 'theme';
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
      var legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy === 'light' || legacy === 'dark') {
        localStorage.setItem(STORAGE_KEY, legacy);
        return legacy;
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
    html.classList.toggle('dark', resolved === 'dark');
    html.style.colorScheme = resolved;
    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, resolved);
      } catch (e) {}
      notifyParentTheme(resolved);
    }
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

  function init() {
    var initial = readUrlTheme() || readStoredTheme() || resolveSystemTheme();
    applyTheme(initial, false);

    document.addEventListener('click', function (event) {
      var ituBtn = event.target.closest('[data-itu-theme-toggle]');
      if (ituBtn) {
        var current = readStoredTheme() || resolveSystemTheme();
        applyTheme(current === 'dark' ? 'light' : 'dark', true);
        return;
      }
    });

    window.addEventListener('message', function (event) {
      var data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'itu-theme-change' && (data.theme === 'light' || data.theme === 'dark')) {
        applyTheme(data.theme, false);
        try {
          localStorage.setItem(STORAGE_KEY, data.theme);
        } catch (e) {}
        return;
      }
      if (data.type === 'it-play-theme' && (data.theme === 'light' || data.theme === 'dark')) {
        applyTheme(data.theme, false);
      }
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
