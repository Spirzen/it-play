(function () {
  var root = document.querySelector('[data-catalog-search]');
  if (!root) return;

  var input = root.querySelector('[data-search-input]');
  var sections = root.querySelectorAll('[data-catalog-section]');
  var items = root.querySelectorAll('[data-catalog-item]');
  var empty = root.querySelector('[data-search-empty]');
  var count = root.querySelector('[data-search-count]');
  var langChips = root.querySelectorAll('[data-lang-filter]');
  var activeLang = 'all';

  if (!input) return;

  function normalize(value) {
    return (value || '').toLowerCase().trim();
  }

  function matchesQuery(item, query) {
    if (!query) return true;
    var haystack = [
      item.getAttribute('data-title'),
      item.getAttribute('data-description'),
      item.getAttribute('data-slug'),
      item.getAttribute('data-language'),
      item.getAttribute('data-tags'),
      item.getAttribute('data-series'),
    ]
      .map(normalize)
      .join(' ');
    return haystack.indexOf(query) !== -1;
  }

  function matchesLang(item) {
    if (activeLang === 'all') return true;
    return item.getAttribute('data-language') === activeLang;
  }

  function applyFilter() {
    var query = normalize(input.value);
    var visible = 0;

    items.forEach(function (item) {
      var ok = matchesQuery(item, query) && matchesLang(item);
      item.hidden = !ok;
      if (ok) visible++;
    });

    sections.forEach(function (section) {
      var lang = section.getAttribute('data-language');
      var langOk = activeLang === 'all' || lang === activeLang;
      var any = langOk &&
        Array.prototype.some.call(
          section.querySelectorAll('[data-catalog-item]'),
          function (item) {
            return !item.hidden;
          },
        );
      section.hidden = !any;
    });

    if (empty) {
      empty.hidden = visible !== 0;
    }
    if (count) {
      if (query || activeLang !== 'all') {
        count.textContent = 'Показано: ' + visible;
      } else {
        count.textContent = '';
      }
    }
  }

  input.addEventListener('input', applyFilter);

  langChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeLang = chip.getAttribute('data-lang-filter') || 'all';
      langChips.forEach(function (c) {
        c.classList.toggle('is-active', c === chip);
      });
      applyFilter();
    });
  });

  applyFilter();
})();
