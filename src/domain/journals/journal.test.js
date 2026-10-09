import { describe, expect, it } from 'vitest';
import { createCustomProblem, createJournal, deleteCustomProblem, getJournalTemplate, updateJournal, validateProblemUrl } from './journal';

const now = '2026-10-09T10:20:30.000Z';

describe('journal templates and records', () => {
  it('returns stable answers for every supported journal family', () => {
    const inputs = [
      { domain: 'dsa', journalType: 'dsa-problem-solving' },
      { domain: 'system-design', layer: 'lld', journalType: 'system-design-lld-study' },
      { domain: 'system-design', layer: 'hld', journalType: 'system-design-hld-practice' },
      { domain: 'system-design', layer: 'distributed', journalType: 'system-design-distributed-review' },
      { domain: 'cs', journalType: 'cs-knowledge' },
      { domain: 'cs', journalType: 'cs-lab' },
      { domain: 'others', journalType: 'others' },
    ];
    inputs.forEach((input) => {
      const template = getJournalTemplate(input);
      expect(template.checklist.every((item) => item.questionId && item.text)).toBe(true);
      expect(template.questionAnswers.map((answer) => answer.questionId)).toEqual(template.checklist.map((item) => item.questionId));
    });
  });

  it('creates independent attempts and updates only the selected record', () => {
    const first = createJournal({ domain: 'dsa', journalType: 'dsa-problem-solving', problemId: 'p1' }, now);
    const second = createJournal({ domain: 'dsa', journalType: 'dsa-problem-solving', problemId: 'p1' }, now);
    const data = { journalEntries: [first, second] };
    const changed = updateJournal(data, first.id, { header: 'Updated' }, now);
    expect(first.id).not.toBe(second.id);
    expect(changed.journalEntries[0]).toMatchObject({ header: 'Updated', id: first.id });
    expect(changed.journalEntries[1]).toEqual(second);
  });

  it('validates custom problems and preserves attempts after deletion', () => {
    expect(validateProblemUrl('nope')).toBe(false);
    const problem = createCustomProblem({ title: 'Custom', url: 'https://example.com/problem', patternIds: ['arrays'] }, now);
    const data = { customProblems: [problem], attempts: [{ id: 'a1', problemId: problem.id }] };
    expect(deleteCustomProblem(data, problem.id).requiresConfirmation).toBe(true);
    const deleted = deleteCustomProblem(data, problem.id, { confirm: true });
    expect(deleted.customProblems).toEqual([]);
    expect(deleted.attempts).toHaveLength(1);
  });
});
