import { AppDataSchema, createDefaultAppData, parseAppData } from './schema';

export const STORAGE_KEY = 'engineering-learning-journal:v1';

function resolveStorage(storage) {
  if (storage) return { target: storage, error: null };
  try {
    const target = typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
    return { target, error: null };
  } catch (error) {
    return {
      target: null,
      error: error?.name === 'SecurityError'
        ? 'The browser blocked journal storage. Allow site storage or keep this page open and export a backup.'
        : 'The browser could not read this journal. Keep this page open and export a backup.',
    };
  }
}

export function readAppDataResult(storage) {
  const resolved = resolveStorage(storage);
  if (resolved.error) return { data: createDefaultAppData(), error: resolved.error };
  const target = resolved.target;
  if (!target) return { data: createDefaultAppData(), error: null };
  let raw;
  try {
    raw = target.getItem(STORAGE_KEY);
  } catch {
    return {
      data: createDefaultAppData(),
      error: 'The browser could not read this journal. Keep this page open and export a backup.',
    };
  }
  if (raw == null) return { data: createDefaultAppData(), error: null };
  let decoded;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return {
      data: createDefaultAppData(),
      error: 'Saved journal data was unreadable. A fresh journal has been opened; export a backup if needed.',
    };
  }
  const parsed = parseAppData(decoded);
  if (!parsed) {
    return {
      data: createDefaultAppData(),
      error: 'Saved journal data did not match the supported format. A fresh journal has been opened.',
    };
  }
  return { data: parsed, error: null };
}

export function readAppData(storage) {
  return readAppDataResult(storage).data;
}

export function writeAppData(storage, data) {
  const parsed = AppDataSchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: 'Data did not match the supported format.' };
  const resolved = resolveStorage(storage);
  if (resolved.error) {
    return {
      ok: false,
      error: 'The browser could not save this journal. Keep this page open and export a backup.',
    };
  }
  const target = resolved.target;
  if (!target) {
    return { ok: false, error: 'The browser could not save this journal. Keep this page open and export a backup.' };
  }
  try {
    target.setItem(STORAGE_KEY, JSON.stringify(parsed.data));
    return { ok: true };
  } catch (error) {
    const message = error?.name === 'QuotaExceededError'
      ? 'Browser storage is full. Export a backup and remove unused data.'
      : 'The browser could not save this journal. Keep this page open and export a backup.';
    return { ok: false, error: message };
  }
}
