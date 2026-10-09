import { describe, expect, it } from 'vitest';
import { filterJournals, normalizeSearchText, sortJournals } from './search';

const entries = [
  { id: '1', header: 'Cấu trúc dữ liệu', domain: 'dsa', journalType: 'dsa-review', studyDate: '2026-01-02', updatedAt: '2026-01-03', reviewStatus: 'reviewed' },
  { id: '2', header: 'Caching', problemTitle: 'LRU Cache', domain: 'system-design', layer: 'hld', topicId: 'cache', journalType: 'system-design-hld-practice', studyDate: '2026-02-02', updatedAt: '2026-02-04', reviewStatus: 'needs-work' },
  { id: '3', header: 'Older', domain: 'cs', studyDate: '2025-12-02', updatedAt: '2026-02-01' },
];

describe('journal search', () => {
  it('normalizes Vietnamese accents and matches fields', () => {
    expect(normalizeSearchText(' CẤU trúc dữ liệu ')).toBe('cau truc du lieu');
    expect(filterJournals(entries, { query: 'cau truc du lieu' }).map((entry) => entry.id)).toEqual(['1']);
    expect(filterJournals(entries, { query: 'lru cache' }).map((entry) => entry.id)).toEqual(['2']);
  });

  it('applies filters with inclusive date boundaries', () => {
    expect(filterJournals(entries, { domain: 'system-design', dateFrom: '2026-02-02', dateTo: '2026-02-02' }).map((entry) => entry.id)).toEqual(['2']);
    expect(filterJournals(entries, { reviewStatus: 'reviewed' }).map((entry) => entry.id)).toEqual(['1']);
  });

  it('sorts stable newest, oldest, alphabetical, and updated', () => {
    expect(sortJournals(entries, 'newest').map((entry) => entry.id)).toEqual(['2', '1', '3']);
    expect(sortJournals(entries, 'oldest').map((entry) => entry.id)).toEqual(['3', '1', '2']);
    expect(sortJournals(entries, 'a-z').map((entry) => entry.id)).toEqual(['2', '1', '3']);
    expect(sortJournals(entries, 'recently-updated').map((entry) => entry.id)).toEqual(['2', '3', '1']);
  });
});
