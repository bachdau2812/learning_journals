import { normalizeSearchText } from '../journals/search';
import { getChildren, getNode } from '../../data/catalog';

export function createCatalogItem(input, parent, siblings = [], ancestors = []) {
  if (!parent || !['dsa', 'system-design', 'cs'].includes(parent.domain)) throw new Error('Choose a valid parent topic.');
  const title = String(input.title ?? '').trim();
  if (!title) throw new Error('Please enter a title.');
  if (title.length > 120) throw new Error('Keep the title within 120 characters.');
  if (siblings.some((item) => normalizeSearchText(item.title) === normalizeSearchText(title))) throw new Error('An item with this title already exists here.');
  const allowedTypes = parent.domain === 'dsa' ? ['topic', 'problem'] : parent.domain === 'cs' ? ['topic', 'lab'] : ['topic', 'case'];
  if (!allowedTypes.includes(input.type)) throw new Error('Choose an item type for this learning area.');
  const url = String(input.url ?? '').trim();
  if (url) {
    try {
      if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new Error();
    } catch { throw new Error('Use a valid http:// or https:// reference URL.'); }
  }
  const context = String(input.context ?? '').trim();
  const questions = String(input.questions ?? '').split('\n').map((line) => line.trim()).filter(Boolean);
  const sourceLinks = url ? [{ label: 'Your reference', url }] : [];
  const prefix = input.type === 'problem' ? 'problem' : 'topic';
  const unique = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  const now = new Date().toISOString();
  const node = {
    id: `custom-${prefix}-${unique}`, parentId: parent.id, domain: parent.domain,
    type: input.type, title, isCustom: true, children: [], concepts: [],
    questions, contexts: context ? [context] : [], practice: context ? [context] : [], problems: [],
    url, resources: sourceLinks.map((source) => source.url),
    interviewFocus: context || questions.length || url ? { scenario: context, sourceLinks } : null,
    createdAt: now, updatedAt: now,
  };
  if (input.type === 'problem') {
    node.difficulty = input.difficulty || 'Unspecified';
    node.patternIds = [...ancestors, parent].filter((item) => item.type === 'pattern').map((item) => item.id);
  }
  return node;
}

export function collectCatalogBranch(ids, catalog) {
  const removed = new Set();
  const visit = (id) => {
    const node = getNode(id, catalog);
    if (!node?.parentId || node.isCustom !== true || removed.has(id)) return;
    removed.add(id);
    getChildren(id, catalog).forEach((child) => visit(child.id));
  };
  ids.forEach(visit);
  return removed;
}

export function deleteCatalogItems(data, ids, catalog) {
  const removed = collectCatalogBranch(ids, catalog);
  return {
    ...data,
    customTopics: (data.customTopics ?? []).filter((node) => !removed.has(node.id)),
    customProblems: (data.customProblems ?? []).filter((node) => !removed.has(node.id)),
  };
}
