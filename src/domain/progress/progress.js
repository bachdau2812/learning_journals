function entriesOf(data = {}) {
  return Array.isArray(data.journalEntries) ? data.journalEntries : [];
}

export function countUniqueProblems(attempts = [], predicate = () => true) {
  return new Set((attempts ?? []).filter(predicate).map((attempt) => attempt.problemId).filter(Boolean)).size;
}

function domainEntries(entries, domain) { return entries.filter((entry) => entry.domain === domain); }
function reviewDue(entry, today) { return entry.reviewDate && entry.reviewDate <= today && entry.reviewStatus !== 'reviewed'; }

export function calculateOverview(data = {}, catalog = {}) {
  const entries = entriesOf(data);
  const dsaEntries = domainEntries(entries, 'dsa');
  const solved = dsaEntries.filter((entry) => ['solved independently', 'solved-without-hint', 'solved'].includes(String(entry.result ?? '').toLowerCase()));
  const knownResults = dsaEntries.filter((entry) => entry.result);
  const systemEntries = domainEntries(entries, 'system-design');
  const csEntries = domainEntries(entries, 'cs');
  const today = new Date().toISOString().slice(0, 10);
  const recentJournals = [...entries].sort((a, b) => String(b.updatedAt ?? b.createdAt ?? '').localeCompare(String(a.updatedAt ?? a.createdAt ?? ''))).slice(0, 5);
  const topicsToReview = entries.filter((entry) => reviewDue(entry, today));
  const topicCount = (domain) => new Set(domainEntries(entries, domain).map((entry) => entry.topicId).filter(Boolean)).size;
  const catalogNodes = Object.values(catalog ?? {}).filter((node) => !node.isArchived);
  const countCatalog = (domain) => catalogNodes.filter((node) => node.domain === domain && (node.type === 'topic' || node.type === 'group')).length;
  return {
    dsa: { uniqueAttempted: countUniqueProblems(dsaEntries), uniqueSolved: countUniqueProblems(solved), totalAttempts: dsaEntries.length, independentSolveRate: knownResults.length ? solved.length / knownResults.length : null, pendingReviews: dsaEntries.filter((entry) => reviewDue(entry, today)).length },
    systemDesign: { topics: topicCount('system-design'), notes: systemEntries.length, practice: systemEntries.filter((entry) => String(entry.journalType).includes('practice')).length, catalogTopics: countCatalog('system-design') },
    cs: { topics: topicCount('cs'), notes: csEntries.length, labs: csEntries.filter((entry) => entry.journalType === 'cs-lab').length, catalogTopics: countCatalog('cs') },
    recentJournals,
    continueLearning: recentJournals[0] ?? null,
    topicsToReview,
  };
}
