import { describe, expect, it } from 'vitest';
import { AppDataSchema, createDefaultAppData, migrateAppData } from './schema';
import { readAppData, writeAppData, STORAGE_KEY } from './storage';

function fakeStorage(initial = null, overrides = {}) {
  let value = initial;
  let key = null;
  return {
    getItem: overrides.getItem ?? (() => value),
    setItem: overrides.setItem ?? ((nextKey, next) => { key = nextKey; value = next; }),
    removeItem: () => { value = null; },
    get value() { return value; },
    get keyWritten() { return key; },
  };
}

describe('versioned app-data schema', () => {
  it('creates a valid empty envelope without catalog content', () => {
    const data = createDefaultAppData();
    expect(data).toEqual({
      schemaVersion: 1,
      preferences: {},
      topicProgress: {},
      customProblems: [],
      customTopics: [],
      attempts: [],
      journalEntries: [],
      metadata: {},
    });
    expect(AppDataSchema.safeParse(data).success).toBe(true);
  });

  it('migrates schema 0 progress and keeps every question id unchanged', () => {
    const legacy = {
      schemaVersion: 0,
      preferences: { theme: 'dark' },
      progress: {
        'topic-a': { questions: { 'old-question-id': 'done', 'unknown-question': 'kept' } },
      },
      journals: [{ id: 'journal-1', answers: { 'old-question-id': true } }],
    };
    const migrated = migrateAppData(legacy);
    expect(migrated.schemaVersion).toBe(1);
    expect(migrated.topicProgress['topic-a'].questions).toEqual({
      'old-question-id': 'done',
      'unknown-question': 'kept',
    });
    expect(migrated.journalEntries).toEqual(legacy.journals);
  });
});

describe('local app-data storage', () => {
  it('round trips validated user data under the v1 key', () => {
    const storage = fakeStorage();
    const data = { ...createDefaultAppData(), journalEntries: [{ id: 'j1', title: 'A note' }] };
    expect(writeAppData(storage, { ...data, catalog: { dsa: ['arrays'] } })).toEqual({ ok: true });
    expect(storage.keyWritten).toBe(STORAGE_KEY);
    expect(readAppData(storage)).toEqual(data);
    expect(JSON.parse(storage.value)).not.toHaveProperty('catalog');
  });

  it('falls back to defaults for malformed JSON and unsupported data', () => {
    const malformed = fakeStorage('{not json');
    expect(readAppData(malformed)).toEqual(createDefaultAppData());
    const unsupported = fakeStorage(JSON.stringify({ schemaVersion: 99 }));
    expect(readAppData(unsupported)).toEqual(createDefaultAppData());
  });

  it('reports quota, security, read, and invalid-data failures truthfully', () => {
    const quota = fakeStorage(null, { setItem: () => { const error = new Error('full'); error.name = 'QuotaExceededError'; throw error; } });
    expect(writeAppData(quota, createDefaultAppData())).toEqual({ ok: false, error: expect.stringMatching(/storage is full/i) });
    const security = fakeStorage(null, { setItem: () => { const error = new Error('denied'); error.name = 'SecurityError'; throw error; } });
    expect(writeAppData(security, createDefaultAppData())).toEqual({ ok: false, error: expect.stringMatching(/could not save/i) });
    const readFailure = fakeStorage(null, { getItem: () => { const error = new Error('denied'); error.name = 'SecurityError'; throw error; } });
    expect(readAppData(readFailure)).toEqual(createDefaultAppData());
    expect(writeAppData(fakeStorage(), { schemaVersion: 1 })).toEqual({ ok: false, error: 'Data did not match the supported format.' });
  });
});
