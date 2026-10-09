import { describe, expect, it } from 'vitest';
import { calculateOverview, countUniqueProblems } from './progress';

describe('learning progress', () => {
  it('counts unique DSA problems separately from attempts', () => {
    const attempts = [{ problemId: 'p1' }, { problemId: 'p1' }, { problemId: 'p2' }];
    expect(countUniqueProblems(attempts)).toBe(2);
    const overview = calculateOverview({ journalEntries: [
      { domain: 'dsa', problemId: 'p1', result: 'Solved independently', studyDate: '2026-01-01' },
      { domain: 'dsa', problemId: 'p1', result: 'Solved with hint', studyDate: '2026-01-02' },
      { domain: 'dsa', problemId: 'p2', result: 'Unsolved', studyDate: '2026-01-03' },
    ] });
    expect(overview.dsa).toMatchObject({ uniqueAttempted: 2, uniqueSolved: 1, totalAttempts: 3, independentSolveRate: 1 / 3 });
  });
  it('returns domain counts, reviews, recent journals, and empty metrics', () => {
    const overview = calculateOverview({ journalEntries: [
      { id: 'j1', domain: 'system-design', topicId: 'cache', journalType: 'system-design-hld-practice', updatedAt: '2026-02-01' },
      { id: 'j2', domain: 'cs', topicId: 'tcp', journalType: 'cs-lab', reviewDate: '2000-01-01', reviewStatus: 'needs-work', updatedAt: '2026-01-01' },
    ] });
    expect(overview.systemDesign).toMatchObject({ topics: 1, notes: 1, practice: 1 });
    expect(overview.cs).toMatchObject({ topics: 1, notes: 1, labs: 1 });
    expect(overview.topicsToReview).toHaveLength(1);
    expect(calculateOverview({})).toMatchObject({ recentJournals: [], continueLearning: null, topicsToReview: [] });
  });
});
