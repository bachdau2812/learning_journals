import { describe, expect, it } from 'vitest';
import { catalogById, getAncestors, getChildren, getNode } from './index';
import { systemDesignChecklists } from './system-design';
import { DSA_BEST_PRACTICES_ID, DSA_GROUP_IDS, DSA_PATTERN_IDS } from './ids';

const patternIds = DSA_PATTERN_IDS;

describe('DSA catalog coverage', () => {
  it('includes the stable DSA root, six roadmap groups, and Best Practices', () => {
    const root = getNode('dsa');
    expect(root).toMatchObject({ id: 'dsa', domain: 'dsa', type: 'root', children: expect.any(Array) });
    expect(root.children).toHaveLength(7);
    expect(root.children.slice(0, 6)).toEqual(DSA_GROUP_IDS);
    expect(root.children.map((id) => getNode(id).title)).toEqual([
      'Arrays & Strings',
      'Searching & Linear Structures',
      'Trees & Recursion',
      'Graphs',
      'Optimization',
      'Additional Patterns',
      'Best Practices',
    ]);
    expect(getNode(DSA_BEST_PRACTICES_ID)).toMatchObject({
      id: DSA_BEST_PRACTICES_ID,
      parentId: 'dsa',
      type: 'best-practices',
      concepts: expect.arrayContaining(['understandProblem', 'approachSelection', 'correctness']),
      questions: expect.arrayContaining(['Time Complexity.', 'Think aloud.']),
      bestPractices: expect.objectContaining({
        understandProblem: expect.any(Array),
        reviewStrategy: expect.any(Array),
      }),
    });
  });

  it('contains all 22 required pattern IDs with complete learning fields', () => {
    expect(patternIds).toHaveLength(22);
    patternIds.forEach((id) => {
      const node = getNode(id);
      expect(node, id).toBeTruthy();
      expect(node).toMatchObject({ domain: 'dsa', type: 'pattern', parentId: expect.any(String) });
      expect(node.description.length).toBeGreaterThan(20);
      expect(node.concepts.length).toBeGreaterThan(0);
      expect(node.questions.length).toBeGreaterThan(0);
      expect(node.contexts.length).toBeGreaterThan(0);
      expect(node.resources.length).toBeGreaterThan(0);
      expect(node.children).toHaveLength(4);
    });
    expect(getNode('array-hashing').title).toBe('Array & Hashing');
  });

  it('links at least four distinct LeetCode problems to every pattern', () => {
    const problems = [];
    patternIds.forEach((patternId) => {
      const pattern = getNode(patternId);
      const linked = getChildren(patternId);
      expect(linked).toHaveLength(4);
      linked.forEach((problem) => {
        expect(problem).toMatchObject({
          domain: 'dsa',
          type: 'problem',
          parentId: patternId,
          leetcodeId: expect.any(String),
          title: expect.any(String),
          url: expect.stringMatching(/^https:\/\/leetcode\.com\/problems\//),
          difficulty: expect.stringMatching(/^(Easy|Medium|Hard)$/),
          patterns: expect.arrayContaining([patternId]),
          source: 'leetcode',
          isCustom: false,
        });
        problems.push(problem);
      });
    });
    expect(new Set(problems.map((problem) => problem.id)).size).toBe(problems.length);
    expect(problems.length).toBeGreaterThanOrEqual(88);
  });

  it('keeps IDs unique and every child reference resolvable', () => {
    const ids = Object.keys(catalogById);
    expect(new Set(ids).size).toBe(ids.length);
    ids.forEach((id) => {
      const node = catalogById[id];
      node.children.forEach((childId) => {
        expect(catalogById[childId], `${id} -> ${childId}`).toBeTruthy();
        expect(catalogById[childId].parentId).toBe(id);
      });
    });
  });
});

describe('catalog helpers', () => {
  it('returns nodes, children in catalog order, and root-to-parent ancestors', () => {
    expect(getNode('missing')).toBeNull();
    expect(getChildren('missing')).toEqual([]);
    expect(getChildren('dsa')[0].id).toBe('dsa-arrays-strings');
    expect(getAncestors('dsa')).toEqual([]);
    expect(getAncestors('array-hashing').map((node) => node.id)).toEqual(['dsa', 'dsa-arrays-strings']);
    expect(getAncestors('missing')).toEqual([]);
  });
});

describe('System Design catalog coverage', () => {
  const expectedChecklistKeys = [
    'lldKnowledge', 'lldPractice', 'hldKnowledge', 'hldPractice',
    'distributedKnowledge', 'distributedPractice',
  ];

  it('includes the three roadmap layers and distinct populated checklist templates', () => {
    const root = getNode('system-design');
    expect(root).toMatchObject({ domain: 'system-design', type: 'root' });
    expect(root.children).toEqual(['system-design-lld', 'system-design-hld', 'system-design-distributed']);
    expect(root.children.map((id) => getNode(id).title)).toEqual([
      'Low-Level Design', 'High-Level Design', 'Distributed Systems & Reliability',
    ]);
    expect(Object.keys(systemDesignChecklists).sort()).toEqual([...expectedChecklistKeys].sort());
    expectedChecklistKeys.forEach((key) => expect(systemDesignChecklists[key].length).toBeGreaterThanOrEqual(7));
    expect(systemDesignChecklists.lldKnowledge).toContain('Kiến thức này giải quyết vấn đề gì trong code?');
    expect(systemDesignChecklists.hldPractice).toContain('Đã làm rõ requirements, NFRs, assumptions?');
    expect(systemDesignChecklists.distributedKnowledge).toContain('Vấn đề concurrency/consistency/reliability là gì?');
  });

  it('gives every System Design topic a concrete context, resources, and practice', () => {
    const leaves = Object.values(catalogById).filter((node) => node.domain === 'system-design' && node.type === 'topic');
    expect(leaves.length).toBeGreaterThanOrEqual(30);
    leaves.forEach((node) => {
      expect(node.contexts.length, `${node.id} contexts`).toBeGreaterThanOrEqual(1);
      expect(node.resources.length, `${node.id} resources`).toBeGreaterThanOrEqual(1);
      expect(node.problems.length, `${node.id} practice`).toBeGreaterThanOrEqual(1);
    });
    expect(getNode('lld-pattern-strategy').contexts).toEqual(expect.arrayContaining(['Discount policies', 'Shipping fee algorithms']));
    expect(getNode('hld-case-realtime-chat')).toMatchObject({ type: 'case', contexts: expect.any(Array), resources: expect.any(Array) });
    expect(getNode('distributed-case-payment-idempotency')).toBeTruthy();
  });
});

describe('CS Fundamentals catalog coverage', () => {
  const expectedGroups = [
    'Operating Systems', 'Computer Networking', 'Database Systems',
    'Computer Architecture & JVM', 'Linux & Security',
  ];

  it('contains five required groups and expanded topic leaves with questions, resources, and practice', () => {
    const root = getNode('cs-fundamentals');
    expect(root).toMatchObject({ domain: 'cs', type: 'root' });
    const groups = getChildren(root.id);
    expect(groups).toHaveLength(5);
    expect(groups.map(({ title }) => title)).toEqual(expectedGroups);
    const leaves = Object.values(catalogById).filter((node) => node.domain === 'cs' && node.type === 'topic');
    expect(leaves.length).toBeGreaterThanOrEqual(28);
    const coreLeaves = leaves.filter((node) => !node.id.includes('--'));
    expect(coreLeaves).toHaveLength(28);
    coreLeaves.forEach((node) => {
      expect(node.questions.length, `${node.id} questions`).toBeGreaterThanOrEqual(3);
      expect(new Set(node.questions).size).toBe(node.questions.length);
      expect(node.resources.length, `${node.id} resources`).toBeGreaterThanOrEqual(1);
      expect(node.problems.length, `${node.id} practice`).toBeGreaterThanOrEqual(1);
    });
    expect(getNode('cs-networking-tcp-udp').questions).toContain('TCP duy trì ordered delivery bằng cách nào?');
    expect(getNode('cs-database-isolation-mvcc').questions).toContain('MVCC hỗ trợ concurrency như thế nào?');
    expect(leaves.reduce((count, node) => count + node.questions.length, 0)).toBeGreaterThanOrEqual(84);
  });
});
