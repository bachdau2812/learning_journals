import { afterEach, describe, expect, it } from 'vitest';
import {
  cancelSpatialTransition,
  captureSpatialAnchor,
  normalizeRect,
  prepareSpatialTransition,
} from './spatialTransitionManager';

afterEach(() => {
  cancelSpatialTransition();
  document.body.innerHTML = '';
});

describe('spatial transition geometry', () => {
  it('normalizes only usable rectangles', () => {
    expect(normalizeRect({ left: 12, top: 8, width: 240, height: 120 })).toEqual({ left: 12, top: 8, width: 240, height: 120 });
    expect(normalizeRect({ left: 0, top: 0, width: 0, height: 80 })).toBeNull();
    expect(normalizeRect({ left: Number.NaN, top: 0, width: 20, height: 20 })).toBeNull();
  });

  it('captures a serializable anchor from the card plane', () => {
    const card = document.createElement('a');
    card.dataset.spatialId = 'browse/dsa';
    const plane = document.createElement('span');
    plane.className = 'spatial-card__plane';
    plane.getBoundingClientRect = () => ({ left: 32, top: 48, width: 280, height: 190 });
    card.append(plane);
    document.body.append(card);
    const anchor = captureSpatialAnchor(card, 'browse/dsa');
    expect(anchor).toMatchObject({ id: 'browse/dsa', rect: { left: 32, top: 48, width: 280, height: 190 }, sourcePath: '/' });
    expect(anchor.viewport.width).toBe(window.innerWidth);
  });

  it('owns one shell and removes it on cancellation', () => {
    prepareSpatialTransition({ direction: 'forward', focusId: 'browse/dsa', sourceRect: { left: 20, top: 30, width: 260, height: 170 } });
    expect(document.querySelectorAll('[data-spatial-shell]')).toHaveLength(1);
    prepareSpatialTransition({ direction: 'forward', focusId: 'browse/system-design', sourceRect: { left: 80, top: 60, width: 280, height: 180 } });
    expect(document.querySelectorAll('[data-spatial-shell]')).toHaveLength(1);
    cancelSpatialTransition();
    expect(document.querySelector('[data-spatial-shell]')).toBeNull();
  });
});
