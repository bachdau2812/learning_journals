import React, { createContext, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  cancelSpatialTransition,
  captureSpatialAnchor,
  getPendingSpatialTransition,
  prepareSpatialTransition,
} from './spatialTransitionManager';

export const SpatialMotionContext = createContext(false);

/**
 * Direction metadata is still used by ordinary React Router view transitions
 * (journals/settings). Spatial cards use the persistent shell manager instead.
 */
export function setSpatialDirection(direction, focusId = '', { preserveSpatial = false } = {}) {
  if (typeof document === 'undefined') return;
  if (!preserveSpatial) cancelSpatialTransition();
  document.documentElement.dataset.spatialDirection = direction;
  if (focusId) document.documentElement.dataset.spatialFocus = focusId;
  else delete document.documentElement.dataset.spatialFocus;
}

export function scheduleSpatialCleanup() {
  // Kept as a compatibility no-op for older page imports. The transition
  // manager owns shell cleanup and never leaves named elements behind.
}

export function setSpatialFocusGeometry() {
  // Geometry is captured by captureSpatialAnchor from the actual card plane.
}

export function isPlainNavigationClick(event) {
  return !event.defaultPrevented
    && event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

function routeFocusForBack(pathname, to) {
  const match = pathname.match(/^\/(?:browse|topics)\/([^/?]+)/);
  if (!match) return '';
  return to === '/' ? `browse/${match[1]}` : match[1];
}

function SpatialDataLink({ to, direction = 'forward', onClick, children, style, state, ...props }) {
  const location = useLocation();
  const navigate = useNavigate();
  const focusId = props['data-spatial-id'] || '';
  const returnFocusId = direction === 'back'
    ? routeFocusForBack(location.pathname, typeof to === 'string' ? to.split('?')[0] : '')
      || location.state?.spatialFocusId
      || document.documentElement.dataset.spatialFocus
    : '';
  const navigationFocusId = focusId || (direction === 'back' ? returnFocusId : '');
  const inheritedAnchor = location.state?.spatialAnchor ?? state?.spatialAnchor ?? null;
  const navigationState = navigationFocusId
    ? { ...(state ?? {}), spatialFocusId: navigationFocusId, ...(inheritedAnchor ? { spatialAnchor: inheritedAnchor } : {}) }
    : state;

  const handleClick = (event) => {
    onClick?.(event);
    if (!isPlainNavigationClick(event)) return;

    const target = event.currentTarget;
    const id = target.dataset.spatialId || '';
    const isBack = direction === 'back';
    const anchor = id
      ? captureSpatialAnchor(target, id)
      : inheritedAnchor;
    const pending = getPendingSpatialTransition();

    // Keep the navigation stack stable while the shell is in flight. A second
    // pointer event can land on a newly mounted card at the same screen point;
    // accepting it would create a nested history entry before the first
    // geometry has settled.
    if (pending && (!isBack || pending.direction === 'back')) {
      event.preventDefault();
      return;
    }

    prepareSpatialTransition({
      direction: isBack ? 'back' : 'forward',
      sourceElement: id ? target : null,
      focusId: id || returnFocusId,
      anchor,
    });
    setSpatialDirection(isBack ? 'back' : 'forward', id || returnFocusId, { preserveSpatial: true });

    // The source rectangle is only available at click time. Navigate
    // imperatively so that the measured anchor is committed to this history
    // entry before the destination route mounts.
    event.preventDefault();
    navigate(to, {
      state: {
        ...(state ?? {}),
        ...(id || returnFocusId ? { spatialFocusId: id || returnFocusId } : {}),
        ...(anchor ? { spatialAnchor: anchor } : {}),
      },
      preventScrollReset: true,
      replace: Boolean(props.replace),
      relative: props.relative,
    });
  };

  return (
    <Link
      to={to}
      viewTransition={false}
      preventScrollReset
      onClick={handleClick}
      style={style}
      state={navigationState}
      {...props}
    >
      {children}
    </Link>
  );
}

export default function SpatialLink({ direction, ...props }) {
  if (!useContext(SpatialMotionContext)) return <Link {...props} />;
  return <SpatialDataLink direction={direction} {...props} />;
}

export function SpatialEntryPlane() {
  return <span className="spatial-entry-plane" aria-hidden="true" />;
}
