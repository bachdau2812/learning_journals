const TRANSITION_DURATION = 560;
const TRANSITION_EASING = 'cubic-bezier(.22, .82, .32, 1)';
const VIEWPORT_EXPANSION = 1.08;

let shellElement;
let activeAnimation;
let pendingTransition;
let cleanupTimer;

function canUseDOM() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function reducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

function isFiniteRect(rect) {
  return rect && [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) && rect.width > 0 && rect.height > 0;
}

export function normalizeRect(rect) {
  if (!isFiniteRect(rect)) return null;
  return {
    left: Number(rect.left),
    top: Number(rect.top),
    width: Number(rect.width),
    height: Number(rect.height),
  };
}

function planeFor(element) {
  if (!element) return null;
  if (element.matches?.('.spatial-card__plane')) return element;
  return element.querySelector?.(':scope > .spatial-card__plane') ?? element;
}

export function rectForElement(element) {
  const plane = planeFor(element);
  return normalizeRect(plane?.getBoundingClientRect?.());
}

export function captureSpatialAnchor(element, focusId = '') {
  const rect = rectForElement(element);
  if (!rect || !canUseDOM()) return null;
  return {
    id: focusId || element?.dataset?.spatialId || '',
    rect,
    scrollY: window.scrollY,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    sourcePath: window.location.pathname,
  };
}

function ensureShell() {
  if (!canUseDOM()) return null;
  if (shellElement?.isConnected) return shellElement;
  shellElement = document.createElement('div');
  shellElement.className = 'spatial-transition-shell';
  shellElement.setAttribute('aria-hidden', 'true');
  shellElement.setAttribute('data-spatial-shell', 'true');
  shellElement.style.viewTransitionName = 'none';
  document.body.appendChild(shellElement);
  return shellElement;
}

function copyVisualTokens(sourceElement, shell) {
  const plane = planeFor(sourceElement);
  const style = plane ? getComputedStyle(plane) : null;
  shell.style.setProperty('--spatial-shell-border', style?.borderColor || 'color-mix(in srgb, var(--color-accent) 30%, transparent)');
  shell.style.setProperty('--spatial-shell-radius', style?.borderRadius || 'var(--space-radius)');
  shell.style.setProperty('--spatial-shell-shadow', style?.boxShadow || '0 18px 48px color-mix(in srgb, var(--color-accent) 10%, transparent)');
}

function viewportRect() {
  return {
    left: -window.innerWidth * ((VIEWPORT_EXPANSION - 1) / 2),
    top: -window.innerHeight * ((VIEWPORT_EXPANSION - 1) / 2),
    width: window.innerWidth * VIEWPORT_EXPANSION,
    height: window.innerHeight * VIEWPORT_EXPANSION,
  };
}

function currentShellRect() {
  return normalizeRect(shellElement?.getBoundingClientRect?.());
}

function transformFor(rect, base) {
  const scaleX = rect.width / base.width;
  const scaleY = rect.height / base.height;
  return `translate3d(${rect.left}px, ${rect.top}px, 0) scale(${scaleX}, ${scaleY})`;
}

function setShellFrame(shell, rect) {
  shell.style.width = `${rect.width}px`;
  shell.style.height = `${rect.height}px`;
  shell.style.transform = transformFor(rect, rect);
}

function setMotionAttributes(direction, phase = 'prepared') {
  const root = document.documentElement;
  root.dataset.spatialDirection = direction;
  root.dataset.spatialPhase = phase;
  root.dataset.spatialShellActive = 'true';
}

function clearMotionAttributes() {
  const root = document.documentElement;
  delete root.dataset.spatialPhase;
  delete root.dataset.spatialShellActive;
  if (root.dataset.spatialDirection === 'forward' || root.dataset.spatialDirection === 'back') {
    delete root.dataset.spatialDirection;
  }
}

function emit(name, detail) {
  if (!canUseDOM()) return;
  document.dispatchEvent(new CustomEvent(name, { detail }));
}

function cancelAnimation({ keepShell = false } = {}) {
  if (activeAnimation) {
    activeAnimation.cancel();
    activeAnimation = null;
  }
  window.clearTimeout(cleanupTimer);
  shellElement?.classList.remove('spatial-transition-shell--expanded');
  if (!keepShell && shellElement) {
    shellElement.remove();
    shellElement = null;
  }
}

export function cancelSpatialTransition({ keepShell = false } = {}) {
  if (!canUseDOM()) return;
  cancelAnimation({ keepShell });
  pendingTransition = null;
  if (!keepShell) clearMotionAttributes();
  emit('spatialtransitioncancel', {});
}

export function hasPendingSpatialTransition() {
  return Boolean(pendingTransition);
}

export function getPendingSpatialTransition() {
  return pendingTransition;
}

export function prepareSpatialTransition({ direction = 'forward', sourceElement, sourceRect, focusId = '', anchor = null } = {}) {
  if (!canUseDOM()) return null;
  const existing = currentShellRect();
  cancelAnimation({ keepShell: Boolean(existing) });
  const shell = ensureShell();
  if (!shell) return null;
  const measured = normalizeRect(sourceRect) || rectForElement(sourceElement) || existing || viewportRect();
  const fromRect = direction === 'back' && !sourceElement && !sourceRect ? viewportRect() : measured;
  copyVisualTokens(sourceElement, shell);
  setShellFrame(shell, fromRect);
  shell.style.opacity = direction === 'back' ? '0.16' : '0.94';
  shell.style.display = 'block';
  shell.classList.remove('spatial-transition-shell--expanded');
  shell.dataset.spatialDirection = direction;
  setMotionAttributes(direction, 'prepared');
  pendingTransition = {
    direction,
    focusId,
    anchor: anchor || null,
    fromRect,
    sourcePath: window.location.pathname,
    startedAt: performance.now(),
  };
  emit('spatialtransitionprepare', { ...pendingTransition });
  return pendingTransition;
}

function fallbackTarget(anchor) {
  return normalizeRect(anchor?.rect) || {
    left: (window.innerWidth - Math.min(420, window.innerWidth - 32)) / 2,
    top: Math.max(96, (window.innerHeight - 230) / 2),
    width: Math.min(420, window.innerWidth - 32),
    height: 230,
  };
}

export function resolveSpatialTransition({ direction, targetElement, anchor } = {}) {
  if (!canUseDOM() || !pendingTransition) return Promise.resolve(false);
  const pending = pendingTransition;
  const actualDirection = direction || pending.direction;
  const shell = ensureShell();
  if (!shell) return Promise.resolve(false);
  const target = actualDirection === 'back' ? (rectForElement(targetElement) || fallbackTarget(anchor || pending.anchor)) : viewportRect();
  const from = currentShellRect() || pending.fromRect || target;
  const base = { width: from.width, height: from.height };
  const fromTransform = transformFor(from, base);
  const toTransform = transformFor(target, base);
  const canAnimate = typeof shell.animate === 'function';
  const motionReduced = reducedMotion() || !canAnimate;
  setMotionAttributes(actualDirection, 'destination');
  shell.style.width = `${base.width}px`;
  shell.style.height = `${base.height}px`;
  shell.style.transform = fromTransform;
  shell.style.opacity = actualDirection === 'back' ? '0.16' : '0.94';
  const keyframes = actualDirection === 'back'
    ? [{ transform: fromTransform, opacity: 0.16 }, { transform: toTransform, opacity: 1 }]
    : [{ transform: fromTransform, opacity: 0.94 }, { transform: toTransform, opacity: 0.12 }];
  const duration = motionReduced ? 1 : TRANSITION_DURATION;
  cancelAnimation({ keepShell: true });
  shell.style.display = 'block';
  if (!canAnimate) {
    shell.style.transform = toTransform;
    shell.style.opacity = actualDirection === 'back' ? '1' : '0.12';
    shell.remove();
    shellElement = null;
    pendingTransition = null;
    clearMotionAttributes();
    emit('spatialtransitionfinish', { direction: actualDirection, focusId: pending.focusId });
    return Promise.resolve(true);
  }
  const animation = shell.animate(keyframes, { duration, easing: TRANSITION_EASING, fill: 'forwards' });
  activeAnimation = animation;
  // The feathered mask is useful while the shell is close to its source card.
  // Once a forward shell covers most of the viewport, removing that mask
  // avoids an unnecessary large-area paint for the rest of the flight.
  if (actualDirection === 'forward' && !motionReduced) {
    cleanupTimer = window.setTimeout(() => {
      if (activeAnimation === animation) shell.classList.add('spatial-transition-shell--expanded');
    }, Math.round(duration * 0.46));
  }
  emit('spatialtransitionstart', {
    direction: actualDirection,
    focusId: pending.focusId,
    from,
    to: target,
    duration,
  });
  const finished = animation.finished.then(() => {
    if (activeAnimation !== animation) return false;
    activeAnimation = null;
    shell.remove();
    shellElement = null;
    pendingTransition = null;
    clearMotionAttributes();
    emit('spatialtransitionfinish', { direction: actualDirection, focusId: pending.focusId });
    return true;
  }).catch(() => false);
  return finished;
}

export function finishSpatialTransition() {
  return resolveSpatialTransition({});
}
