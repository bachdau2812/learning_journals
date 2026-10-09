import React, { useLayoutEffect } from 'react';
import { createBrowserRouter, Outlet, RouterProvider, ScrollRestoration, useLocation } from 'react-router-dom';
import { routes } from './routes';
import AppShell from '../components/AppShell';
import { SpatialMotionContext } from '../components/SpatialLink';
import {
  getPendingSpatialTransition,
  hasPendingSpatialTransition,
  cancelSpatialTransition,
  prepareSpatialTransition,
  resolveSpatialTransition,
} from '../components/spatialTransitionManager';
import { AppDataProvider } from './AppDataProvider';

export { AppDataProvider, useAppData } from './AppDataProvider';

let currentRouteFocusId = window.history.state?.usr?.spatialFocusId ?? '';
let currentRouteAnchor = window.history.state?.usr?.spatialAnchor ?? null;
let currentHistoryIndex = window.history.state?.idx ?? 0;
let resolveFrame = 0;

function escapeAttribute(value) {
  if (window.CSS?.escape) return window.CSS.escape(value);
  return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function cardForFocusId(focusId) {
  if (!focusId) return null;
  return document.querySelector(`.spatial-card[data-spatial-id="${escapeAttribute(focusId)}"]`);
}

function restoreScrollForTransition(pending) {
  if (!pending) return;
  const y = pending.direction === 'back' && Number.isFinite(pending.anchor?.scrollY)
    ? Math.max(0, pending.anchor.scrollY)
    : 0;
  window.scrollTo(0, y);
}

function resolveMountedSpatialTransition() {
  if (!hasPendingSpatialTransition()) return;
  const pending = getPendingSpatialTransition();
  if (!pending) return;
  document.querySelectorAll('.route-stage .motion-card').forEach((card) => {
    card.classList.add('motion-card--visible');
    card.style.setProperty('--reveal-delay', '0ms');
    card.style.setProperty('--reveal-distance', '0px');
  });
  restoreScrollForTransition(pending);
  const targetElement = pending.direction === 'back' ? cardForFocusId(pending.focusId) : null;
  resolveSpatialTransition({
    direction: pending.direction,
    targetElement,
    anchor: pending.anchor,
  });
}

function RoutedApp() {
  const location = useLocation();

  useLayoutEffect(() => {
    currentHistoryIndex = window.history.state?.idx ?? currentHistoryIndex;
    currentRouteFocusId = location.state?.spatialFocusId ?? '';
    currentRouteAnchor = location.state?.spatialAnchor ?? null;

    // Cards must be stable before the shell measures the destination. This
    // avoids a second reveal animation and prevents text from flashing over
    // the persistent shell.
    document.querySelectorAll('.route-stage .motion-card').forEach((card) => {
      card.classList.add('motion-card--visible');
      card.style.setProperty('--reveal-delay', '0ms');
      card.style.setProperty('--reveal-distance', '0px');
    });

    if (!hasPendingSpatialTransition()) return undefined;
    const pending = getPendingSpatialTransition();
    if (!pending) return undefined;
    if (resolveFrame) cancelAnimationFrame(resolveFrame);
    // One frame lets React finish layout and lets ScrollRestoration settle;
    // geometry is measured only after that frame, so nested Back lands on the
    // actual card rather than a stale pre-restore position.
    resolveFrame = requestAnimationFrame(() => {
      resolveFrame = 0;
      resolveMountedSpatialTransition();
    });
    return () => {
      if (resolveFrame) {
        cancelAnimationFrame(resolveFrame);
        resolveFrame = 0;
      }
    };
  }, [location.key]);

  return (
    <SpatialMotionContext.Provider value>
      <AppShell>
        <div className="route-stage" key={location.key}>
          <Outlet />
        </div>
        <ScrollRestoration getKey={(entry) => `${entry.pathname}${entry.search}`} />
      </AppShell>
    </SpatialMotionContext.Provider>
  );
}

// Capture POP direction and the history entry's anchor before React Router
// replaces the current route. PUSH links are prepared directly by SpatialLink.
const onHistoryPop = () => {
  const nextIndex = window.history.state?.idx;
  const direction = typeof nextIndex === 'number' && nextIndex > currentHistoryIndex ? 'forward' : 'back';
  const nextState = window.history.state?.usr ?? {};
  const focusId = direction === 'back' ? currentRouteFocusId : (nextState.spatialFocusId ?? '');
  const anchor = direction === 'back' ? currentRouteAnchor : (nextState.spatialAnchor ?? null);
  const sourceElement = direction === 'forward' ? cardForFocusId(focusId) : null;

  if (focusId || anchor) {
    prepareSpatialTransition({ direction, sourceElement, focusId, anchor });
    document.documentElement.dataset.spatialDirection = direction;
    if (focusId) document.documentElement.dataset.spatialFocus = focusId;
  } else {
    // A POP can interrupt a PUSH before its destination effect runs. Drop the
    // stale shell instead of letting that old route resolve a frame later.
    cancelSpatialTransition();
  }
  currentHistoryIndex = nextIndex ?? currentHistoryIndex;
};
window.addEventListener('popstate', onHistoryPop, { capture: true });
if (import.meta.hot) import.meta.hot.dispose(() => window.removeEventListener('popstate', onHistoryPop, { capture: true }));

const router = createBrowserRouter([{ element: <RoutedApp />, children: routes }]);

export default function App() {
  return (
    <AppDataProvider>
      <RouterProvider router={router} />
    </AppDataProvider>
  );
}
