import { AppDataSchema, createDefaultAppData, parseAppData } from './schema';

const arrays = ['customProblems', 'customTopics', 'attempts', 'journalEntries'];

export function exportAppData(data, exportedAt = new Date().toISOString()) {
  const parsed = AppDataSchema.parse(data);
  return JSON.stringify({ ...parsed, exportedAt }, null, 2);
}

function counts(data) {
  return {
    topicProgress: Object.keys(data.topicProgress ?? {}).length,
    customProblems: data.customProblems?.length ?? 0,
    customTopics: data.customTopics?.length ?? 0,
    attempts: data.attempts?.length ?? 0,
    journalEntries: data.journalEntries?.length ?? 0,
    metadata: Object.keys(data.metadata ?? {}).length,
  };
}

export function inspectImport(jsonText) {
  try {
    const raw = JSON.parse(jsonText);
    if (raw?.schemaVersion !== 1) return { valid: false, counts: null, data: null, error: 'Unsupported backup schema version.' };
    const data = parseAppData(raw);
    if (!data) return { valid: false, counts: null, data: null, error: 'Backup data is not valid for this journal.' };
    return { valid: true, counts: counts(data), data, error: null };
  } catch {
    return { valid: false, counts: null, data: null, error: 'The selected file is not valid JSON.' };
  }
}

function mergeRecords(current = [], imported = []) {
  const byId = new Map(current.map((item) => [item.id, item]));
  imported.forEach((item) => byId.set(item.id ?? `import-${byId.size}`, item));
  return [...byId.values()];
}

export function mergeAppData(current, imported) {
  const base = parseAppData(current) ?? createDefaultAppData();
  const incoming = parseAppData(imported);
  if (!incoming) return base;
  return AppDataSchema.parse({
    ...base,
    preferences: { ...base.preferences, ...incoming.preferences },
    topicProgress: { ...base.topicProgress, ...incoming.topicProgress },
    metadata: { ...base.metadata, ...incoming.metadata },
    ...Object.fromEntries(arrays.map((key) => [key, mergeRecords(base[key], incoming[key])])),
  });
}

export function replaceAppData(imported) {
  return parseAppData(imported) ?? null;
}
