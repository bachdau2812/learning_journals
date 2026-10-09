import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createDefaultAppData } from '../domain/persistence/schema';
import { readAppDataResult, writeAppData } from '../domain/persistence/storage';

export const AppDataContext = createContext(null);
const DEBOUNCE_MS = 600;

export function AppDataProvider({ children, storage }) {
  const initialRef = useRef(null);
  if (initialRef.current === null) {
    initialRef.current = readAppDataResult(storage);
  }
  const [data, setData] = useState(initialRef.current.data ?? createDefaultAppData);
  const [saveStatus, setSaveStatus] = useState(initialRef.current.error ? 'error' : 'saved');
  const [saveError, setSaveError] = useState(initialRef.current.error ?? null);
  const dataRef = useRef(data);
  const pendingRef = useRef(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(false);

  const flush = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const pending = pendingRef.current;
    if (!pending) return { ok: true };
    pendingRef.current = null;
    const result = writeAppData(storage, pending);
    if (mountedRef.current) {
      if (result.ok) {
        setSaveStatus('saved');
        setSaveError(null);
      } else {
        setSaveStatus('error');
        setSaveError(result.error);
      }
    }
    return result;
  }, [storage]);

  const scheduleFlush = useCallback(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, DEBOUNCE_MS);
  }, [flush]);

  const updateData = useCallback((change, { immediate = false } = {}) => {
    const current = dataRef.current;
    const next = typeof change === 'function'
      ? change(current)
      : { ...current, ...change };
    if (!next || typeof next !== 'object') return;
    if (immediate) {
      const result = writeAppData(storage, next);
      if (!result.ok) {
        setSaveStatus('error');
        setSaveError(result.error);
        return result;
      }
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = null;
      pendingRef.current = null;
      dataRef.current = next;
      setData(next);
      setSaveStatus('saved');
      setSaveError(null);
      return result;
    }
    dataRef.current = next;
    pendingRef.current = next;
    setData(next);
    setSaveStatus('saving');
    setSaveError(null);
    scheduleFlush();
    return { ok: true };
  }, [scheduleFlush, storage]);

  const updateProgress = useCallback((topicId, update) => {
    if (!topicId) return;
    updateData((current) => {
      const previous = current.topicProgress?.[topicId] ?? {};
      return {
        ...current,
        topicProgress: {
          ...current.topicProgress,
          [topicId]: {
            ...previous,
            ...update,
            concepts: { ...(previous.concepts ?? {}), ...(update?.concepts ?? {}) },
            questions: { ...(previous.questions ?? {}), ...(update?.questions ?? {}) },
          },
        },
      };
    });
  }, [updateData]);

  useEffect(() => {
    mountedRef.current = true;
    const onVisibilityChange = () => { if (document.visibilityState === 'hidden') flush(); };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      mountedRef.current = false;
      flush();
    };
  }, [flush]);

  const value = useMemo(() => ({
    data,
    updateData,
    updateProgress,
    saveStatus,
    saveError,
    // Kept as a compatibility alias for the topic page seam from Task 4.
    progress: data.topicProgress,
  }), [data, updateData, updateProgress, saveStatus, saveError]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  return useContext(AppDataContext);
}
