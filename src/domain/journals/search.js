export function normalizeSearchText(value = '') {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi').trim();
}

function dateValue(value) {
  const timestamp = value ? Date.parse(value) : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function matchesQuery(entry, query) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return true;
  return [entry.header, entry.problemTitle, entry.problemId, entry.leetcodeId, entry.topicId]
    .some((value) => normalizeSearchText(value).includes(normalized));
}

export function filterJournals(entries = [], filters = {}) {
  const list = Array.isArray(entries) ? entries : [];
  return list.filter((entry) => {
    if (!matchesQuery(entry, filters.query ?? filters.search)) return false;
    for (const key of ['domain', 'layer', 'topicId', 'journalType', 'reviewStatus']) {
      if (filters[key] && entry[key] !== filters[key]) return false;
    }
    const date = String(entry.studyDate ?? '').slice(0, 10);
    if (filters.dateFrom && date < filters.dateFrom) return false;
    if (filters.dateTo && date > filters.dateTo) return false;
    return true;
  });
}

export function sortJournals(entries = [], mode = 'newest') {
  return (Array.isArray(entries) ? entries : []).map((entry, index) => ({ entry, index })).sort((a, b) => {
    let result = 0;
    if (mode === 'oldest') result = dateValue(a.entry.studyDate) - dateValue(b.entry.studyDate);
    else if (mode === 'a-z') result = normalizeSearchText(a.entry.header).localeCompare(normalizeSearchText(b.entry.header), 'vi');
    else if (mode === 'recently-updated') result = dateValue(b.entry.updatedAt) - dateValue(a.entry.updatedAt);
    else result = dateValue(b.entry.studyDate) - dateValue(a.entry.studyDate);
    return result || a.index - b.index;
  }).map(({ entry }) => entry);
}
