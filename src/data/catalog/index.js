import { dsaNodes } from './dsa';
import { systemDesignNodes } from './system-design';
import { csFundamentalsNodes } from './cs-fundamentals';
import { expandInterviewCatalog } from './interview-topics';

const allNodes = expandInterviewCatalog([...dsaNodes, ...systemDesignNodes, ...csFundamentalsNodes]);

function freezeNode(node) {
  const copy = { ...node };
  Object.entries(copy).forEach(([key, value]) => {
    if (Array.isArray(value)) copy[key] = Object.freeze([...value]);
  });
  return Object.freeze(copy);
}

export const catalogById = Object.freeze(
  Object.fromEntries(allNodes.map((node) => [node.id, freezeNode(node)])),
);

export function getNode(id, catalog = catalogById) {
  return Object.prototype.hasOwnProperty.call(catalog, id) ? catalog[id] : null;
}

export function getChildren(id, catalog = catalogById) {
  return (getNode(id, catalog)?.children ?? []).map((childId) => getNode(childId, catalog)).filter(Boolean);
}

export function getAncestors(id, catalog = catalogById) {
  const node = getNode(id, catalog);
  if (!node?.parentId) return [];
  const ancestors = [];
  const visited = new Set([id]);
  let parentId = node.parentId;
  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = getNode(parentId, catalog);
    if (!parent) break;
    ancestors.unshift(parent);
    parentId = parent.parentId;
  }
  return ancestors;
}

export function buildCatalog(data = {}) {
  const catalog = Object.assign(Object.create(null), catalogById);
  const customNodes = [
    ...(data.customTopics ?? []),
    ...(data.customProblems ?? []).map((problem) => ({
      ...problem, domain: 'dsa', type: 'problem', children: [],
      parentId: problem.parentId ?? problem.patternIds?.find((id) => getNode(id, catalog)?.domain === 'dsa') ?? 'dsa',
      resources: problem.resources ?? (problem.url ? [problem.url] : []),
    })),
  ];
  for (const node of customNodes) {
    if (typeof node.id !== 'string' || getNode(node.id, catalog) || !['dsa', 'cs', 'system-design'].includes(node.domain)) continue;
    catalog[node.id] = { ...node, children: [] };
  }
  for (const node of customNodes) {
    if (getNode(node.id, catalog)?.isCustom !== true) continue;
    const parent = getNode(node.parentId, catalog);
    if (!parent || parent.domain !== node.domain || parent.id === node.id) continue;
    // Reject imported cycles without changing either built-in or stored nodes.
    if (getAncestors(parent.id, catalog).some((ancestor) => ancestor.id === node.id)) continue;
    catalog[parent.id] = { ...parent, children: [...new Set([...(parent.children ?? []), node.id])] };
  }
  return catalog;
}

export { dsaNodes } from './dsa';
export { systemDesignNodes, systemDesignChecklists } from './system-design';
export { csFundamentalsNodes } from './cs-fundamentals';
