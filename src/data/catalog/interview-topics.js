import { systemDesignInterviewTopics, additionalDesignNodes } from './interview-system-design';
import { csInterviewTopics } from './interview-cs';

export const interviewSources = {
  amazon: ['Amazon interview topics', 'https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics'],
  microsoft: ['Microsoft technical interviews', 'https://careers.microsoft.com/v2/global/en/hiring-tips/technical-interviewing.html'],
  delivery: ['Hello Interview: delivery framework', 'https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery'],
  core: ['Hello Interview: core concepts', 'https://www.hellointerview.com/learn/system-design/in-a-hurry/core-concepts'],
  ood: ['Design Gurus: object-oriented interview syllabus', 'https://www.designgurus.io/course/grokking-the-object-oriented-design-interview'],
  oop: ['Oracle: objects and interfaces', 'https://docs.oracle.com/javase/tutorial/java/concepts/'],
  composition: ['Refactoring Guru: inheritance to delegation', 'https://refactoring.guru/replace-inheritance-with-delegation'],
  patterns: ['Refactoring Guru: pattern catalog', 'https://refactoring.guru/design-patterns/catalog'],
  strategy: ['Refactoring Guru: Strategy', 'https://refactoring.guru/design-patterns/strategy'],
  adapter: ['Refactoring Guru: Adapter', 'https://refactoring.guru/design-patterns/adapter'],
  observer: ['Refactoring Guru: Observer', 'https://refactoring.guru/design-patterns/observer'],
  state: ['Refactoring Guru: State', 'https://refactoring.guru/design-patterns/state'],
  decorator: ['Refactoring Guru: Decorator', 'https://refactoring.guru/design-patterns/decorator'],
  builder: ['Refactoring Guru: Builder', 'https://refactoring.guru/design-patterns/builder'],
  api: ['Hello Interview: API design', 'https://www.hellointerview.com/learn/system-design/core-concepts/api-design'],
  contention: ['Hello Interview: contention', 'https://www.hellointerview.com/learn/system-design/patterns/dealing-with-contention'],
  workflows: ['Hello Interview: multi-step processes', 'https://www.hellointerview.com/learn/system-design/patterns/multi-step-processes'],
  kafka: ['Hello Interview: Kafka', 'https://www.hellointerview.com/learn/system-design/deep-dives/kafka'],
  redis: ['Hello Interview: Redis', 'https://www.hellointerview.com/learn/system-design/deep-dives/redis'],
  search: ['Hello Interview: Elasticsearch', 'https://www.hellointerview.com/learn/system-design/deep-dives/elasticsearch'],
  postgres: ['Hello Interview: PostgreSQL', 'https://www.hellointerview.com/learn/system-design/deep-dives/postgres'],
  sre: ['Google SRE: overload handling', 'https://sre.google/sre-book/handling-overload/'],
  slo: ['Google SRE: service-level objectives', 'https://sre.google/sre-book/service-level-objectives/'],
  monitoring: ['Google SRE: distributed monitoring', 'https://sre.google/sre-book/monitoring-distributed-systems/'],
  concurrency: ['Oracle: concurrency', 'https://docs.oracle.com/javase/tutorial/essential/concurrency/'],
  jmm: ['Java Language Specification: threads and locks', 'https://docs.oracle.com/javase/specs/jls/se25/html/jls-17.html'],
  virtualThreads: ['Oracle: virtual threads', 'https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html'],
  gc: ['Oracle: garbage collection', 'https://docs.oracle.com/en/java/javase/25/gctuning/garbage-collector-implementation.html'],
  os: ['OSTEP: operating systems', 'https://pages.cs.wisc.edu/~remzi/OSTEP/'],
  http: ['RFC 9110: HTTP semantics', 'https://www.rfc-editor.org/rfc/rfc9110.html'],
  tcp: ['RFC 9293: TCP', 'https://www.rfc-editor.org/rfc/rfc9293.html'],
  tls: ['RFC 8446: TLS 1.3', 'https://www.rfc-editor.org/rfc/rfc8446.html'],
  dns: ['RFC 1034: DNS concepts', 'https://www.rfc-editor.org/rfc/rfc1034.html'],
  relational: ['PostgreSQL: SQL language', 'https://www.postgresql.org/docs/current/sql.html'],
  indexes: ['PostgreSQL: indexes', 'https://www.postgresql.org/docs/current/indexes.html'],
  multicolumn: ['PostgreSQL: multicolumn indexes', 'https://www.postgresql.org/docs/current/indexes-multicolumn.html'],
  explain: ['PostgreSQL: EXPLAIN', 'https://www.postgresql.org/docs/current/using-explain.html'],
  isolation: ['PostgreSQL: transaction isolation', 'https://www.postgresql.org/docs/current/transaction-iso.html'],
  wal: ['PostgreSQL: write-ahead logging', 'https://www.postgresql.org/docs/current/wal-intro.html'],
  linux: ['Linux manual: process monitoring', 'https://man7.org/linux/man-pages/man1/top.1.html'],
  epoll: ['Linux manual: epoll', 'https://man7.org/linux/man-pages/man7/epoll.7.html'],
  security: ['OWASP: security cheat sheets', 'https://cheatsheetseries.owasp.org/'],
};

function makeTopic(parent, id, title, scenario, question, followUp, sources, type = 'topic') {
  const sourceLinks = sources.map((key) => interviewSources[key]).filter(Boolean).map(([label, url]) => ({ label, url }));
  return {
    id, parentId: parent.id, domain: parent.domain, type, title,
    children: [], concepts: [title], contexts: [scenario],
    questions: [question, followUp], problems: [scenario], practice: [scenario],
    interviewFocus: { scenario, followUp, sourceLinks },
    resources: sourceLinks.map(({ url }) => url),
  };
}

export function expandInterviewCatalog(baseNodes) {
  const byId = Object.fromEntries(baseNodes.map((node) => [node.id, { ...node, children: [...(node.children ?? [])] }]));
  const added = [];
  for (const [parentId, definitions] of Object.entries({ ...systemDesignInterviewTopics, ...csInterviewTopics })) {
    const parent = byId[parentId];
    if (!parent) throw new Error(`Missing interview topic parent: ${parentId}`);
    for (const [slug, title, scenario, question, followUp, sources] of definitions) {
      const node = makeTopic(parent, `${parentId}--${slug}`, title, scenario, question, followUp, sources);
      parent.children.push(node.id);
      added.push(node);
    }
  }
  for (const [id, parentId, title, scenario, question, followUp, source, type] of additionalDesignNodes) {
    const parent = byId[parentId];
    const node = makeTopic(parent, id, title, scenario, question, followUp, [source], type);
    parent.children.push(id);
    added.push(node);
  }
  return [...Object.values(byId), ...added];
}
