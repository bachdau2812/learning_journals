export function journalTypeLabel(type = '') {
  if (type === 'dsa-problem-solving') return 'Problem solving';
  if (type === 'dsa-concept-learning') return 'Concept learning';
  if (type === 'dsa-review') return 'Review';
  if (type === 'cs-knowledge') return 'Knowledge';
  if (type === 'cs-lab') return 'Practical lab';
  if (type.startsWith('system-design-')) return `${type.includes('lld') ? 'LLD' : type.includes('hld') ? 'HLD' : 'Distributed'} ${type.endsWith('practice') ? 'practice' : type.endsWith('review') ? 'review' : 'knowledge'}`;
  return 'Personal note';
}
export function reviewLabel(status = '') {
  return { 'not-reviewed': 'Not reviewed', 'needs-work': 'Needs work', reviewed: 'Reviewed' }[status] ?? 'Not reviewed';
}
export function dateLabel(value) {
  if (!value) return 'No date';
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
