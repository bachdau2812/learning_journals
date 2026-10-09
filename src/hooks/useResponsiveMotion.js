import { useLayoutEffect, useRef } from 'react';

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

export function createInkRipple(event) {
  if (reducedMotion() || (event.pointerType === 'mouse' && event.button !== 0)) return;
  const ripple = document.createElement('span');
  ripple.className = 'motion-ink-ripple';
  ripple.style.left = `${event.clientX}px`;
  ripple.style.top = `${event.clientY}px`;
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  window.setTimeout(() => ripple.remove(), 650);
}

export default function useResponsiveMotion(selector, itemCount) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion()) return;
    const cards = [...root.querySelectorAll(selector)];
    root.dataset.motionReady = 'true';
    let scrollY = window.scrollY;
    let scrollTime = performance.now();
    let scrollSpeed = 0;
    let scrollDirection = 1;

    cards.forEach((card, index) => {
      card.classList.add('motion-card');
      card.style.setProperty('--reveal-delay', `${Math.min(index, 5) * 45}ms`);
    });

    const observer = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const isNavigation = entry.target.classList.contains('spatial-card');
        entry.target.style.setProperty('--reveal-distance', `${scrollDirection * (scrollSpeed > 1.4 ? 6 : isNavigation ? 14 : 8)}px`);
        entry.target.style.setProperty('--reveal-duration', scrollSpeed > 1.4 ? '190ms' : isNavigation ? '340ms' : '280ms');
        entry.target.classList.add('motion-card--visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px 40px 0px' }) : null;
    cards.forEach((card) => observer ? observer.observe(card) : card.classList.add('motion-card--visible'));

    const onScroll = () => {
      const now = performance.now();
      const delta = window.scrollY - scrollY;
      scrollSpeed = Math.abs(delta) / Math.max(now - scrollTime, 16);
      if (delta) scrollDirection = delta > 0 ? 1 : -1;
      scrollY = window.scrollY;
      scrollTime = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const canHover = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches ?? false;
    let activeCard = null;
    let frame = 0;
    const resetCard = (card) => {
      if (!card) return;
      card.style.removeProperty('--spot-x');
      card.style.removeProperty('--spot-y');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
      card.style.removeProperty('--parallax-x');
      card.style.removeProperty('--parallax-y');
    };
    const onPointerMove = (event) => {
      if (!canHover || event.pointerType !== 'mouse') return;
      const card = event.target instanceof Element ? event.target.closest(selector) : null;
      if (!card || !root.contains(card)) return;
      if (activeCard !== card) resetCard(activeCard);
      activeCard = card;
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        card.style.setProperty('--spot-x', `${x * 100}%`);
        card.style.setProperty('--spot-y', `${y * 100}%`);
        card.style.setProperty('--tilt-x', `${(0.5 - y) * 3}deg`);
        card.style.setProperty('--tilt-y', `${(x - 0.5) * 3}deg`);
        if (card.classList.contains('spatial-card')) {
          card.style.setProperty('--parallax-x', `${(x - 0.5) * 8}px`);
          card.style.setProperty('--parallax-y', `${(y - 0.5) * 8}px`);
          document.documentElement.style.setProperty('--ambient-x', `${(event.clientX / window.innerWidth - 0.5) * 10}px`);
          document.documentElement.style.setProperty('--ambient-y', `${(event.clientY / window.innerHeight - 0.5) * 10}px`);
        }
      });
    };
    const onPointerOut = (event) => {
      if (!activeCard || activeCard.contains(event.relatedTarget)) return;
      resetCard(activeCard);
      activeCard = null;
    };
    const onPointerDown = (event) => {
      const card = event.target instanceof Element ? event.target.closest(selector) : null;
      // Navigation cards already have a shared-plane transition. A separate
      // fixed ripple would sit on top of that snapshot and read as a second,
      // abrupt zoom. Keep the tactile ripple for ordinary controls only.
      if (card && root.contains(card) && !card.classList.contains('spatial-card') && (card.matches('a, button, label') || event.target.closest('a, button, input'))) createInkRipple(event);
    };
    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerout', onPointerOut);
    root.addEventListener('pointerdown', onPointerDown);

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', onScroll);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerout', onPointerOut);
      root.removeEventListener('pointerdown', onPointerDown);
      if (frame) cancelAnimationFrame(frame);
      resetCard(activeCard);
      delete root.dataset.motionReady;
      cards.forEach((card) => card.classList.remove('motion-card', 'motion-card--visible'));
    };
  }, [selector, itemCount]);

  return rootRef;
}
