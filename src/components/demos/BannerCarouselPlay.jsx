import React, {useEffect, useRef, useState} from 'react';

import clsx from 'clsx';
import DemoShell, {DemoCard} from '@/components/shared/DemoShell';


import {
  CAROUSEL_EXPLAIN,
  DEFAULT_AUTOPLAY_MS,
  PromoCarousel,
} from '@/components/shared/kb/bannerCarouselEngine';
import styles from '@/components/demos/BannerCarouselPlay.module.css';

const SLIDES = [
  {
    title: 'Первый слайд',
    text: 'Короткий заголовок и пояснение — типичная структура промо-блока.',
    gradient: 'linear-gradient(135deg, #5b6ee1 0%, #7b4bb7 100%)',
    shapes: [
      {w: 80, h: 80, top: '12%', left: '68%', color: '#fff'},
      {w: 48, h: 48, top: '55%', left: '78%', color: '#ffe082'},
    ],
  },
  {
    title: 'Второй слайд',
    text: 'Тот же каркас, другой фон и текст. Переключение — через класс is-active.',
    gradient: 'linear-gradient(135deg, #0d9488 0%, #0369a1 100%)',
    shapes: [
      {w: 64, h: 64, top: '20%', left: '72%', color: '#a7f3d0'},
      {w: 56, h: 56, top: '48%', left: '62%', color: '#fff'},
    ],
  },
  {
    title: 'Третий слайд',
    text: 'Автопрокрутка останавливается при наведении и при prefers-reduced-motion.',
    gradient: 'linear-gradient(135deg, #ea580c 0%, #be123c 100%)',
    shapes: [
      {w: 72, h: 72, top: '15%', left: '70%', color: '#fecdd3'},
      {w: 40, h: 40, top: '60%', left: '80%', color: '#fff'},
    ],
  },
];

function buildCarouselHtml() {
  const slidesHtml = SLIDES.map(
    (s, i) => `
  <article class="${styles.promoCarouselSlide}" data-carousel-slide data-active="${i === 0 ? 'true' : 'false'}" aria-hidden="${i === 0 ? 'false' : 'true'}">
    <div class="${styles.slideBg}" style="background:${s.gradient}"></div>
    ${s.shapes
      .map(
        (sh) =>
          `<span class="${styles.floatShape}" style="width:${sh.w}px;height:${sh.h}px;top:${sh.top};left:${sh.left};background:${sh.color}"></span>`,
      )
      .join('')}
    <div class="${styles.slideContent}">
      <h3 class="${styles.slideTitle}">${s.title}</h3>
      <p class="${styles.slideText}">${s.text}</p>
      <button type="button" class="${styles.slideCta}">Подробнее</button>
    </div>
  </article>`,
  ).join('');

  return `
<section class="${styles.promoCarousel}" data-promo-carousel role="region" aria-roledescription="carousel" aria-label="Промо-баннер">
  <div class="${styles.promoCarouselTrack}" data-carousel-track>
    ${slidesHtml}
  </div>
  <button type="button" class="${clsx(styles.navBtn, styles.navPrev)}" data-carousel-prev aria-label="Предыдущий слайд">‹</button>
  <button type="button" class="${clsx(styles.navBtn, styles.navNext)}" data-carousel-next aria-label="Следующий слайд">›</button>
  <div class="${styles.dots}" data-carousel-indicators></div>
</section>`;
}

function BannerCarouselPlayInner() {
  const hostRef = useRef(null);
  const carouselRef = useRef(null);
  const [maxWidth, setMaxWidth] = useState(560);
  const [slideIndex, setSlideIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return undefined;
    }

    host.innerHTML = buildCarouselHtml();
    const root = host.querySelector('[data-promo-carousel]');
    if (!root) {
      return undefined;
    }

    carouselRef.current = new PromoCarousel({
      root,
      autoplayDelay: DEFAULT_AUTOPLAY_MS,
      onSlideChange: setSlideIndex,
    });

    return () => {
      carouselRef.current?.destroy();
      carouselRef.current = null;
      host.innerHTML = '';
    };
  }, [maxWidth]);

  return (
    <DemoShell className={styles.root}>
      <DemoCard
        title="Промо-карусель"
        subtitle="Смена слайдов, точки навигации и автопрокрутка — разберите поведение на живом примере"
      >
        <div className={styles.controls}>
          <label className={styles.controlRow}>
            <span className="it-demo__label">Ширина баннера: {maxWidth}px</span>
            <input
              type="range"
              min={280}
              max={680}
              step={20}
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
            />
          </label>
          <ul className={styles.hintList}>
            <li>{CAROUSEL_EXPLAIN.container}</li>
            <li>{CAROUSEL_EXPLAIN.stack}</li>
            <li>{CAROUSEL_EXPLAIN.float}</li>
            <li>{CAROUSEL_EXPLAIN.autoplay}</li>
          </ul>
        </div>

        <div className={styles.stage} style={{maxWidth: `${maxWidth}px`}}>
          <div ref={hostRef} />
        </div>

        <p className={styles.status}>
          Слайд {slideIndex + 1} из {SLIDES.length}
          {reducedMotion ? ' · автопрокрутка отключена (prefers-reduced-motion)' : ` · автопрокрутка каждые ${DEFAULT_AUTOPLAY_MS / 1000} с`}
        </p>

        <pre className={styles.code}>{`.banner-container {
  max-width: ${maxWidth}px;
  margin: 0 auto;
}`}</pre>
      </DemoCard>
    </DemoShell>
  );
}

export default BannerCarouselPlayInner;
