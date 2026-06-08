import React, {useCallback, useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import styles from './ZoomPanViewport.module.css';

/**
 * Ограниченная область просмотра с прокруткой и перетаскиванием.
 * Для демо, где контент масштабируется и может не помещаться на экран.
 */
export default function ZoomPanViewport({
  children,
  contentWidth,
  contentHeight,
  className,
  scrollerClassName,
  scrollerRef: scrollerRefProp,
  syncRef,
  showHint = true,
  ariaLabel,
}) {
  const scrollerRef = useRef(null);

  const setScrollerRef = useCallback(
    (node) => {
      scrollerRef.current = node;
      if (scrollerRefProp) {
        scrollerRefProp.current = node;
      }
    },
    [scrollerRefProp],
  );
  const panRef = useRef(null);
  const syncLockRef = useRef(false);
  const [overflows, setOverflows] = useState(false);

  const updateOverflow = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const next =
      el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2;
    setOverflows(next);
  }, []);

  const syncPeer = useCallback((left, top) => {
    const peer = syncRef?.current;
    if (!peer || peer === scrollerRef.current) return;
    if (Math.abs(peer.scrollLeft - left) < 1 && Math.abs(peer.scrollTop - top) < 1) {
      return;
    }
    syncLockRef.current = true;
    peer.scrollLeft = left;
    peer.scrollTop = top;
    requestAnimationFrame(() => {
      syncLockRef.current = false;
    });
  }, [syncRef]);

  const centerScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const left = Math.max(0, (el.scrollWidth - el.clientWidth) / 2);
    const top = Math.max(0, (el.scrollHeight - el.clientHeight) / 2);
    el.scrollLeft = left;
    el.scrollTop = top;
    syncPeer(left, top);
  }, [syncPeer]);

  useEffect(() => {
    updateOverflow();
    centerScroll();
  }, [contentWidth, contentHeight, updateOverflow, centerScroll]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(updateOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateOverflow]);

  const onScroll = useCallback(() => {
    if (syncLockRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    syncPeer(el.scrollLeft, el.scrollTop);
  }, [syncPeer]);

  const onPointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;
    const canPan =
      el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2;
    if (!canPan) return;

    panRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      const pan = panRef.current;
      const el = scrollerRef.current;
      if (!pan || !el || pan.pointerId !== e.pointerId) return;

      const dx = e.clientX - pan.startX;
      const dy = e.clientY - pan.startY;
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return;

      el.scrollLeft = pan.scrollLeft - dx;
      el.scrollTop = pan.scrollTop - dy;
      syncPeer(el.scrollLeft, el.scrollTop);
    },
    [syncPeer],
  );

  const endPan = useCallback((e) => {
    const pan = panRef.current;
    const el = scrollerRef.current;
    if (!pan || !el || pan.pointerId !== e.pointerId) return;
    if (el.hasPointerCapture(e.pointerId)) {
      el.releasePointerCapture(e.pointerId);
    }
    panRef.current = null;
  }, []);

  return (
    <div className={clsx(styles.wrap, className)}>
      <div
        ref={setScrollerRef}
        className={clsx(
          styles.scroller,
          overflows && styles.scrollerPannable,
          scrollerClassName,
        )}
        tabIndex={overflows ? 0 : undefined}
        role={overflows ? 'region' : undefined}
        aria-label={ariaLabel}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div
          className={styles.stage}
          style={{
            width: contentWidth,
            height: contentHeight,
            minWidth: contentWidth,
            minHeight: contentHeight,
          }}
        >
          {children}
        </div>
      </div>
      {showHint && overflows && (
        <p className={styles.hint}>Прокрутите или перетащите сцену, чтобы увидеть всё изображение</p>
      )}
    </div>
  );
}
