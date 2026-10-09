import { describe, expect, it } from 'vitest';
import { exportAppData, inspectImport, mergeAppData, replaceAppData } from './backup';
import { createDefaultAppData } from './schema';

describe('journal JSON backup', () => {
  it('exports and inspects validated user data with counts', () => {
    const data = { ...createDefaultAppData(), journalEntries: [{ id: 'j1', header: 'A' }], customProblems: [{ id: 'p1' }] };
    const result = inspectImport(exportAppData(data, '2026-10-09T00:00:00.000Z'));
    expect(result.valid).toBe(true);
    expect(result.counts).toMatchObject({ journalEntries: 1, customProblems: 1 });
    expect(result.data.journalEntries[0].id).toBe('j1');
  });

  it('rejects malformed and unsupported backups without data', () => {
    expect(inspectImport('{bad').valid).toBe(false);
    expect(inspectImport(JSON.stringify({ schemaVersion: 99 })).error).toMatch(/Unsupported/);
    expect(replaceAppData({ schemaVersion: 1 })).toBeNull();
  });

  it('merges by stable IDs with imported records taking precedence', () => {
    const base = { ...createDefaultAppData(), journalEntries: [{ id: 'j1', header: 'old' }] };
    const incoming = { ...createDefaultAppData(), journalEntries: [{ id: 'j1', header: 'new' }, { id: 'j2' }] };
    const merged = mergeAppData(base, incoming);
    expect(merged.journalEntries).toEqual([{ id: 'j1', header: 'new' }, { id: 'j2' }]);
  });
});
