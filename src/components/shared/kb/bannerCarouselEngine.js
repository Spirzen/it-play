/**
 * Логика промо-карусели для учебного демо (ванильный JS, без фреймворков).
 * Используется в BannerCarouselPlay и описана в главе про виджеты.
 */

export const DEFAULT_AUTOPLAY_MS = 5000;

/**
 * @param {Object} options
 * @param {HTMLElement} options.root — корень виджета (.promo-carousel)
 * @param {number} [options.autoplayDelay]
 * @param {(index: number) => void} [options.onSlideChange]
 */
export class PromoCarousel {
  constructor({root, autoplayDelay = DEFAULT_AUTOPLAY_MS, onSlideChange} = {}) {
    if (!root) {
      throw new Error('PromoCarousel: root element is required');
    }

    this.root = root;
    this.track = root.querySelector('[data-carousel-track]');
    this.slides = [...root.querySelectorAll('[data-carousel-slide]')];
    this.prevBtn = root.querySelector('[data-carousel-prev]');
    this.nextBtn = root.querySelector('[data-carousel-next]');
    this.indicatorsHost = root.querySelector('[data-carousel-indicators]');

    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.autoplayDelay = autoplayDelay;
    this.autoplayInterval = null;
    this.onSlideChange = onSlideChange;
    this.indicators = [];
    this._hoverPauseBound = false;

    if (this.slideCount === 0) {
      return;
    }

    this.init();
  }

  init() {
    this.createIndicators();
    this.showSlide(this.currentIndex);
    this.startAutoplay();
    this.bindControls();
    this.bindHoverPause();
  }

  createIndicators() {
    if (!this.indicatorsHost) {
      return;
    }

    this.indicatorsHost.innerHTML = '';
    this.indicators = [];

    for (let i = 0; i < this.slideCount; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('data-carousel-dot', '');
      dot.setAttribute('aria-label', `Слайд ${i + 1}`);
      if (i === 0) {
        dot.dataset.active = 'true';
        dot.setAttribute('aria-current', 'true');
      }

      dot.addEventListener('click', () => {
        this.goToSlide(i);
        this.resetAutoplay();
      });

      this.indicatorsHost.appendChild(dot);
      this.indicators.push(dot);
    }
  }

  bindControls() {
    this.prevBtn?.addEventListener('click', () => {
      this.prev();
      this.resetAutoplay();
    });

    this.nextBtn?.addEventListener('click', () => {
      this.next();
      this.resetAutoplay();
    });
  }

  bindHoverPause() {
    if (this._hoverPauseBound) {
      return;
    }

    this.root.addEventListener('mouseenter', () => this.stopAutoplay());
    this.root.addEventListener('mouseleave', () => this.startAutoplay());
    this.root.addEventListener('focusin', () => this.stopAutoplay());
    this.root.addEventListener('focusout', (e) => {
      if (!this.root.contains(e.relatedTarget)) {
        this.startAutoplay();
      }
    });
    this._hoverPauseBound = true;
  }

  showSlide(index) {
    this.slides.forEach((slide, i) => {
      const active = i === index;
      slide.dataset.active = active ? 'true' : 'false';
      slide.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    this.indicators.forEach((dot, i) => {
      const active = i === index;
      dot.dataset.active = active ? 'true' : 'false';
      if (active) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    this.onSlideChange?.(index);
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slideCount;
    this.showSlide(this.currentIndex);
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.showSlide(this.currentIndex);
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.showSlide(this.currentIndex);
  }

  startAutoplay() {
    if (this.slideCount <= 1) {
      return;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) {
      return;
    }
    this.stopAutoplay();
    this.autoplayInterval = window.setInterval(() => this.next(), this.autoplayDelay);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      window.clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  destroy() {
    this.stopAutoplay();
    this.prevBtn?.replaceWith(this.prevBtn.cloneNode(true));
    this.nextBtn?.replaceWith(this.nextBtn.cloneNode(true));
    if (this.indicatorsHost) {
      this.indicatorsHost.innerHTML = '';
    }
    this.indicators = [];
  }
}

export const CAROUSEL_EXPLAIN = {
  container:
    'Контейнер с max-width и margin: 0 auto ограничивает ширину баннера и центрирует его на странице.',
  stack:
    'Слайды лежат в одной области (position: absolute). Виден только слайд с классом is-active — у него opacity: 1.',
  float:
    'Декоративные фигуры анимируются через @keyframes отдельно от смены слайдов — так проще поддерживать код.',
  autoplay:
    'setInterval вызывает next() каждые N мс. После клика пользователя таймер сбрасывают, чтобы не было "двойного" переключения.',
};
