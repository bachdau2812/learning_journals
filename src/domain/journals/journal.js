import {
  CHECKLISTS,
  CS_KNOWLEDGE_CHECKLIST,
  CS_LAB_CHECKLIST,
  DSA_CHECKLIST,
} from './checklists';

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

function cloneAnswers(checklist) {
  return checklist.map(({ questionId }) => ({ questionId, status: 'todo', text: '' }));
}

export function getJournalTemplate({ domain = 'others', layer = null, journalType = 'others', topicId = null, problemId = null, topicQuestions = [] } = {}) {
  let checklist = CHECKLISTS[journalType] ?? [];
  if (domain === 'dsa') checklist = DSA_CHECKLIST;
  if (domain === 'cs' && journalType === 'cs-knowledge') checklist = CS_KNOWLEDGE_CHECKLIST;
  if (domain === 'cs' && journalType === 'cs-lab') checklist = CS_LAB_CHECKLIST;
  const copied = checklist.map((item) => ({ ...item }));
  if (['cs', 'system-design', 'dsa'].includes(domain)) {
    topicQuestions.forEach((text, index) => copied.push({ questionId: `${domain}.topic.${topicId ?? 'general'}.${index + 1}`, text }));
  }
  return {
    domain,
    layer,
    journalType,
    topicId,
    problemId,
    checklist: copied,
    questionAnswers: cloneAnswers(copied),
    header: '',
    studyDate: '',
    takeaway: '',
    others: '',
    references: [],
    reviewStatus: 'not-reviewed',
    reviewDate: null,
  };
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

export { DSA_CHECKLIST, CS_KNOWLEDGE_CHECKLIST, CS_LAB_CHECKLIST };
