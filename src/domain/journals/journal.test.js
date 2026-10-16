import { describe, expect, it } from 'vitest';
import { addJournalQuestion, removeJournalQuestion, JOURNAL_TYPES, createCustomProblem, createJournal, deleteCustomProblem, getJournalTemplate, updateJournal, validateProblemUrl } from './journal';

const now = '2026-10-09T10:20:30.000Z';

describe('journal templates and records', () => {
  it('starts every supported journal family without preset or catalog questions', () => {
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
      const template = getJournalTemplate({ ...input, topicQuestions: ['Preset topic question'] });
      expect(template.checklist).toEqual([]);
      expect(template.questionAnswers).toEqual([]);
    });
    JOURNAL_TYPES.forEach((journalType) => {
      expect(createJournal({ journalType }).checklist).toEqual([]);
      expect(createJournal({ journalType }).questionAnswers).toEqual([]);
    });
  });

  it('adds independent questions and removes only the matching question and answer', () => {
    const journal = createJournal({ domain: 'cs', journalType: 'cs-knowledge' }, now);
    const first = { ...journal, ...addJournalQuestion(journal) };
    const firstId = first.checklist[0].questionId;
    first.checklist[0].text = 'What happens during a TCP handshake?';
    first.questionAnswers[0] = { questionId: firstId, text: 'SYN, SYN-ACK, ACK', status: 'done' };
    const second = { ...first, ...addJournalQuestion(first) };
    expect(second.checklist).toHaveLength(2);
    expect(second.checklist[1].questionId).not.toBe(firstId);
    expect(second.questionAnswers[1]).toMatchObject({ questionId: second.checklist[1].questionId, text: '', status: 'todo' });
    const removed = removeJournalQuestion(second, second.checklist[1].questionId);
    expect(removed.checklist).toEqual(first.checklist);
    expect(removed.questionAnswers).toEqual(first.questionAnswers);
    expect(removeJournalQuestion({ ...journal, ...removed }, firstId)).toEqual({ checklist: [], questionAnswers: [] });
    expect(journal.checklist).toEqual([]);
  });

  it('preserves stored questions and answers when duplicating legacy journals', () => {
    const legacy = { checklist: [{ questionId: 'old-prompt', text: 'An existing question' }], questionAnswers: [{ questionId: 'old-prompt', text: 'An existing answer', status: 'done' }] };
    const copy = createJournal({ ...legacy, domain: 'system-design', journalType: 'system-design-lld-study' }, now);
    expect(copy.checklist).toEqual(legacy.checklist);
    expect(copy.questionAnswers).toEqual(legacy.questionAnswers);
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
