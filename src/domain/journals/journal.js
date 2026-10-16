import { CHECKLISTS } from './checklists';

export const JOURNAL_TYPES = Object.freeze([
  'dsa-problem-solving', 'dsa-concept-learning', 'dsa-review',
  'system-design-lld-study', 'system-design-lld-practice', 'system-design-lld-review',
  'system-design-hld-study', 'system-design-hld-practice', 'system-design-hld-review',
  'system-design-distributed-study', 'system-design-distributed-practice', 'system-design-distributed-review',
  'cs-knowledge', 'cs-lab', 'others',
]);

const makeId = (prefix = 'journal') => {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};

export function getJournalTemplate({ domain = 'others', layer = null, journalType = 'others', topicId = null, problemId = null } = {}) {
  return {
    domain,
    layer,
    journalType,
    topicId,
    problemId,
    checklist: [],
    questionAnswers: [],
    header: '',
    studyDate: '',
    takeaway: '',
    others: '',
    references: [],
    reviewStatus: 'not-reviewed',
    reviewDate: null,
  };
}

export function addJournalQuestion(journal) {
  const questionId = makeId('question');
  return {
    checklist: [...(journal.checklist ?? []), { questionId, text: '' }],
    questionAnswers: [...(journal.questionAnswers ?? []), { questionId, status: 'todo', text: '' }],
  };
}

export function removeJournalQuestion(journal, questionId) {
  return {
    checklist: (journal.checklist ?? []).filter((item) => item.questionId !== questionId),
    questionAnswers: (journal.questionAnswers ?? []).filter((answer) => answer.questionId !== questionId),
  };
}

export function restoreJournalQuestions(journal, topicQuestions = []) {
  const checklist = [...(journal.checklist ?? [])];
  const savedIds = new Set(checklist.map((item) => item.questionId));
  const oldPrompts = new Map(Object.values(CHECKLISTS).flat().map((item) => [item.questionId, item.text]));
  topicQuestions.forEach((text, index) => oldPrompts.set(`${journal.domain}.topic.${journal.topicId ?? 'general'}.${index + 1}`, text));
  // Recover only questions with persisted answers; never insert fresh defaults.
  for (const answer of journal.questionAnswers ?? []) {
    if (savedIds.has(answer.questionId)) continue;
    checklist.push({ questionId: answer.questionId, text: oldPrompts.get(answer.questionId) ?? answer.questionId });
    savedIds.add(answer.questionId);
  }
  return { ...journal, checklist };
}

export function createJournal(input = {}, now = new Date().toISOString()) {
  const template = getJournalTemplate(input);
  return {
    ...template,
    ...input,
    id: input.id ?? makeId('journal'),
    topicId: input.topicId ?? template.topicId,
    problemId: input.problemId ?? template.problemId,
    studyDate: input.studyDate || now.slice(0, 10),
    questionAnswers: input.questionAnswers ?? template.questionAnswers,
    takeaway: input.takeaway ?? '',
    others: input.others ?? '',
    references: input.references ?? [],
    reviewStatus: input.reviewStatus ?? 'not-reviewed',
    reviewDate: input.reviewDate ?? null,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };
}

export function updateJournal(data, id, patch = {}, now = new Date().toISOString()) {
  const entries = Array.isArray(data?.journalEntries) ? data.journalEntries : [];
  return {
    ...data,
    journalEntries: entries.map((entry) => entry.id === id ? { ...entry, ...patch, id, updatedAt: now } : entry),
  };
}

export function validateProblemUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function createCustomProblem(input = {}, now = new Date().toISOString()) {
  if (!input.title?.trim()) throw new Error('A problem title is required.');
  if (!validateProblemUrl(input.url)) throw new Error('Enter a valid http(s) problem URL.');
  return {
    ...input,
    id: input.id ?? makeId('problem'),
    title: input.title.trim(),
    patternIds: Array.isArray(input.patternIds) ? input.patternIds : [],
    isCustom: true,
    createdAt: input.createdAt ?? now,
    updatedAt: now,
  };
}

export function deleteCustomProblem(data, problemId, { confirm = false } = {}) {
  const problems = Array.isArray(data?.customProblems) ? data.customProblems : [];
  const attempts = [
    ...(Array.isArray(data?.attempts) ? data.attempts : []),
    ...(Array.isArray(data?.journalEntries) ? data.journalEntries : []),
  ].filter((entry) => entry.problemId === problemId);
  if (attempts.length && !confirm) {
    return {
      ...data,
      requiresConfirmation: true,
      warning: `This problem has ${attempts.length} attempt${attempts.length === 1 ? '' : 's'}. Delete the problem and keep its attempt history?`,
    };
  }
  return { ...data, customProblems: problems.filter((problem) => problem.id !== problemId) };
}

export { DSA_CHECKLIST, CS_KNOWLEDGE_CHECKLIST, CS_LAB_CHECKLIST } from './checklists';
