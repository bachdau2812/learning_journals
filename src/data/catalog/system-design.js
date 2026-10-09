export const systemDesignChecklists = {
  lldKnowledge: [
    'Kiến thức này giải quyết vấn đề gì trong code?',
    'Cơ chế hoạt động và trách nhiệm class/interface?',
    'Khi nào nên và không nên áp dụng?',
    'Những giải pháp thay thế nào?',
    'Ảnh hưởng tới coupling, cohesion, extensibility, testability?',
    'Anti-patterns hoặc lỗi thường gặp?',
    'Ví dụ liên hệ với Java/Spring Boot?',
  ],
  lldPractice: [
    'Đã xác định requirements, use cases, constraints, edge cases?',
    'Đã thiết kế class/interface và responsibility?',
    'Đã chọn patterns/principles phù hợp?',
    'Đã mô tả control flow, state transitions và invariants?',
    'Đã implement hoặc prototype?',
    'Đã kiểm thử happy path, edge cases, failure cases?',
    'Đã đánh giá maintainability, extensibility, testability?',
    'Nếu interviewer yêu cầu thêm chức năng, thiết kế thay đổi như thế nào?',
  ],
  hldKnowledge: [
    'Giải pháp hoặc component giải quyết vấn đề gì?',
    'Cơ chế hoạt động và data flow?',
    'Điều kiện traffic, latency, consistency, availability phù hợp?',
    'Bottlenecks quan trọng?',
    'Hành vi khi scale hoặc dependency failure?',
    'Alternative designs và trade-offs?',
    'Ứng dụng vào case thực tế nào?',
  ],
  hldPractice: [
    'Đã làm rõ requirements, NFRs, assumptions?',
    'Đã ước lượng capacity, throughput, storage?',
    'Đã thiết kế APIs, data model, request flows?',
    'Đã thiết kế architecture và trách nhiệm components?',
    'Đã xác định bottlenecks và scaling strategy?',
    'Đã đánh giá consistency, security, failure scenarios?',
    'Đã so sánh giải pháp và trade-offs?',
    'Đã prototype/validate các giả định quan trọng nếu phù hợp?',
    'Nếu requirements hoặc traffic thay đổi, cần sửa thiết kế thế nào?',
  ],
  distributedKnowledge: [
    'Vấn đề concurrency/consistency/reliability là gì?',
    'Assumptions và guarantees?',
    'Cơ chế hoạt động bình thường?',
    'Hành vi khi timeout, duplicate, crash hoặc partition?',
    'Data invariants cần bảo vệ?',
    'Correctness được bảo đảm thế nào?',
    'Kiểm chứng bằng metrics/tests nào?',
    'Trade-offs và giới hạn?',
  ],
  distributedPractice: [
    'Đã xác định failure scenario và expected behavior?',
    'Đã xác định invariants/guarantees?',
    'Đã thiết kế retry, idempotency, ordering hoặc recovery?',
    'Đã tái hiện lỗi?',
    'Đã implement hoặc simulate giải pháp?',
    'Đã kiểm chứng correctness bằng assertions/logs/data?',
    'Đã đo performance/recovery khi phù hợp?',
    'Đã so sánh before/after?',
    'Có thể giải thích khi interviewer thay đổi failure scenario không?',
  ],
};

const resourceSets = {
  lld: ['https://refactoring.guru/design-patterns', 'https://docs.oracle.com/javase/tutorial/java/concepts/'],
  hld: ['https://github.com/donnemartin/system-design-primer', 'https://aws.amazon.com/architecture/'],
  distributed: ['https://kafka.apache.org/documentation/', 'https://sre.google/sre-book/table-of-contents/'],
};

function topic(id, parentId, layer, title, concepts, contexts, problems, questions = []) {
  return {
    id, parentId, domain: 'system-design', type: 'topic', title, concepts,
    questions: questions.length ? questions : [
      `${title} giải quyết vấn đề nào và cơ chế hoạt động ra sao?`,
      `Trade-offs và failure modes của ${title} là gì?`,
      `Khi nào nên chọn ${title} trong một thiết kế thực tế?`,
    ],
    contexts, problems, practice: [...problems], resources: [...resourceSets[layer]], children: [],
  };
}

const lldTopics = [
  topic('lld-oop-fundamentals', 'system-design-lld', 'lld', 'OOP Fundamentals', ['Encapsulation', 'Abstraction', 'Polymorphism', 'Inheritance', 'Composition', 'Cohesion/Coupling'], ['Payment methods', 'Order/OrderItem modeling'], ['Model a payment method hierarchy', 'Design an Order and OrderItem domain model']),
  topic('lld-solid-principles', 'system-design-lld', 'lld', 'SOLID Principles', ['SRP', 'OCP', 'LSP', 'ISP', 'DIP', 'DRY', 'KISS', 'YAGNI'], ['Extensible checkout logic', 'Notification service refactoring'], ['Refactor checkout strategies for new payment types', 'Refactor a notification service around interfaces']),
  topic('lld-modular-architecture', 'system-design-lld', 'lld', 'Modular Architecture', ['Layered', 'Modular Monolith', 'Clean Architecture', 'Hexagonal', 'Ports & Adapters'], ['Separating chat domain from Kafka/MySQL', 'Separating order domain from payment providers'], ['Separate chat domain logic from Kafka and MySQL adapters', 'Isolate an order domain from payment providers']),
  topic('lld-api-domain-modeling', 'system-design-lld', 'lld', 'API & Domain Modeling', ['REST', 'DTO', 'Entity', 'Value Object', 'Aggregate', 'invariants', 'transaction boundaries'], ['Order API', 'Message/conversation state management'], ['Design an order API and aggregate boundaries', 'Model conversation and message state transitions']),
  topic('lld-concurrency', 'system-design-lld', 'lld', 'Concurrency in LLD', ['Shared state', 'immutability', 'locks', 'optimistic locking', 'thread safety'], ['Concurrent cart updates', 'Inventory updates'], ['Prevent lost updates in a cart', 'Implement thread-safe inventory updates']),
  topic('lld-testing-refactoring', 'system-design-lld', 'lld', 'Testing & Refactoring', ['Unit tests', 'integration tests', 'test doubles', 'contract tests', 'refactoring'], ['Notification provider testing', 'Order module regression tests'], ['Test notification providers with test doubles', 'Add regression tests while refactoring an order module']),
];

const patternDefinitions = [
  ['strategy', 'Strategy', ['Discount policies', 'Shipping fee algorithms']],
  ['factory-method', 'Factory Method', ['Notification sender creation', 'File parser creation']],
  ['adapter', 'Adapter', ['Payment gateways', 'Multiple SMS providers']],
  ['observer', 'Observer', ['Order domain events', 'Application state notifications']],
  ['state', 'State', ['Order lifecycle', 'Message delivery states']],
  ['decorator', 'Decorator', ['Caching wrappers', 'Logging/metrics wrappers']],
  ['builder', 'Builder', ['Complex search request', 'Notification payload construction']],
  ['chain-of-responsibility', 'Chain of Responsibility', ['Request validation pipeline', 'Authentication filters']],
];
const patternGroup = {
  id: 'lld-design-patterns', parentId: 'system-design-lld', domain: 'system-design', type: 'group', title: 'Design Patterns',
  concepts: ['Java example', 'Class diagram or relationship model', 'Use cases', 'Anti-patterns', 'Trade-offs'],
  questions: ['Pattern nào phù hợp với yêu cầu thay đổi?', 'Chi phí abstraction và các lựa chọn thay thế là gì?'],
  contexts: ['Java/Spring Boot applications'], problems: ['Implement a pattern and compare it with a simpler alternative'],
  resources: [...resourceSets.lld], children: patternDefinitions.map(([slug]) => `lld-pattern-${slug}`),
};
const patternTopics = patternDefinitions.map(([slug, title, contexts]) => topic(
  `lld-pattern-${slug}`, patternGroup.id, 'lld', title,
  ['Java example', 'Class diagram or relationship model', 'Use cases', 'Anti-patterns', 'Trade-offs'], contexts,
  [`Implement ${title} in Java for ${contexts[0]}`, `Compare ${title} with an alternative for ${contexts[1]}`],
));

const hldTopics = [
  topic('hld-requirements-capacity', 'system-design-hld', 'hld', 'Requirements & Capacity Estimation', ['Functional/NFR', 'QPS', 'throughput', 'latency', 'storage', 'read/write ratio'], ['Chat traffic estimation', 'File upload capacity planning'], ['Estimate traffic, storage, and bandwidth for a chat service']),
  topic('hld-api-communication', 'system-design-hld', 'hld', 'API & Communication', ['REST', 'gRPC', 'WebSocket', 'SSE', 'synchronous/asynchronous calls'], ['Realtime chat', 'Live notification updates'], ['Choose APIs and communication protocols for realtime chat']),
  topic('hld-load-balancing-scaling', 'system-design-hld', 'hld', 'Load Balancing & Scaling', ['Horizontal/vertical scaling', 'stateless/stateful services', 'load balancing'], ['News feed API scaling', 'Multi-node WebSocket connections'], ['Scale a news feed API and multi-node WebSocket service']),
  topic('hld-data-modeling-storage', 'system-design-hld', 'hld', 'Data Modeling & Storage', ['SQL/NoSQL', 'indexing', 'replication', 'sharding', 'partitioning'], ['Chat history storage', 'Large order datasets'], ['Choose storage and partitioning for chat history and orders']),
  topic('hld-caching', 'system-design-hld', 'hld', 'Caching', ['Cache-aside', 'write-through', 'TTL', 'invalidation', 'cache stampede', 'hot keys'], ['User profile caching', 'Product catalog caching'], ['Design profile and catalog caches with invalidation']),
  topic('hld-messaging-async', 'system-design-hld', 'hld', 'Messaging & Async Processing', ['Queue', 'pub/sub', 'consumer groups', 'background jobs'], ['Notification delivery', 'Image resizing pipeline'], ['Design notification delivery and image resizing pipelines']),
  topic('hld-search-indexing', 'system-design-hld', 'hld', 'Search & Indexing', ['Inverted index', 'full-text search', 'Elasticsearch', 'indexing pipelines'], ['Product search', 'Message search'], ['Design product search and message indexing pipelines']),
  topic('hld-performance-observability', 'system-design-hld', 'hld', 'Performance & Observability', ['Throughput', 'p95/p99', 'tracing', 'monitoring', 'bottlenecks'], ['Slow chat APIs', 'Search performance investigation'], ['Investigate slow chat APIs and search performance']),
];
const hldCases = [
  ['url-shortener', 'URL Shortener'], ['rate-limiter', 'Rate Limiter'], ['news-feed', 'News Feed'], ['realtime-chat', 'Realtime Chat'],
  ['notification-platform', 'Notification Platform'], ['file-storage', 'File Storage'], ['search-service', 'Search Service'], ['ticket-booking', 'Ticket Booking'],
].map(([slug, title]) => ({
  id: `hld-case-${slug}`, parentId: 'system-design-hld', domain: 'system-design', type: 'case', title,
  description: `Design ${title}; begin by defining the problem statement and requirements before proposing an architecture.`,
  concepts: ['Problem statement', 'Requirements', 'Constraints', 'Capacity assumptions', 'API/Data model exercise', 'Architecture exercise', 'Bottleneck analysis', 'Failure scenarios', 'Interview follow-up questions'],
  questions: [`What are the functional and non-functional requirements for ${title}?`, 'What capacity assumptions and bottlenecks should be validated?', 'How should the design behave during dependency failures?'],
  contexts: [`Real-world ${title} design interview and architecture exercise`],
  problems: [`Practice case: ${title} — requirements, constraints, capacity, APIs/data model, architecture, bottlenecks, failures, and follow-up questions`],
  practice: [`Practice case: ${title} — requirements, constraints, capacity, APIs/data model, architecture, bottlenecks, failures, and follow-up questions`],
  resources: [...resourceSets.hld], children: [],
}));

const distributedTopics = [
  topic('distributed-concurrency', 'system-design-distributed', 'distributed', 'Distributed Concurrency', ['Atomicity', 'CAS', 'distributed locks', 'optimistic/pessimistic locking'], ['Inventory overselling', 'Exclusive background jobs'], ['Prevent inventory overselling', 'Ensure only one worker runs an exclusive job']),
  topic('distributed-consistency-replication', 'system-design-distributed', 'distributed', 'Consistency & Replication', ['Strong/eventual consistency', 'replication lag', 'CAP', 'quorum'], ['Profile read-after-write', 'Balance reads from replicas'], ['Analyze read-after-write behavior with replica lag', 'Choose consistency for balance reads']),
  topic('distributed-message-delivery', 'system-design-distributed', 'distributed', 'Message Delivery', ['At-most/at-least-once', 'deduplication', 'idempotency', 'delivery guarantees'], ['Duplicate Kafka events', 'Repeated payment webhooks'], ['Handle duplicate Kafka events', 'Make payment webhook processing idempotent']),
  topic('distributed-ordering-partitioning', 'system-design-distributed', 'distributed', 'Ordering & Partitioning', ['Kafka partitioning', 'keys', 'offsets', 'consumer groups', 'rebalancing'], ['Conversation message ordering', 'Order status events'], ['Preserve conversation order', 'Partition order status events']),
  topic('distributed-failure-handling', 'system-design-distributed', 'distributed', 'Failure Handling', ['Timeout', 'retry', 'backoff', 'jitter', 'circuit breaker'], ['Payment gateway timeout', 'Redis temporary failures'], ['Handle payment gateway timeouts', 'Recover from temporary Redis failures']),
  topic('distributed-transactions', 'system-design-distributed', 'distributed', 'Distributed Transactions', ['Transactional Outbox', 'Saga', 'compensation', '2PC basics'], ['MySQL commit succeeds but Kafka publish fails', 'Order-payment-inventory workflow'], ['Reconcile a committed MySQL transaction when Kafka publishing fails', 'Coordinate order-payment-inventory workflow']),
  topic('distributed-fault-tolerance', 'system-design-distributed', 'distributed', 'Fault Tolerance', ['Failover', 'redundancy', 'backpressure', 'queue backlog', 'DLQ'], ['Kafka consumer overload', 'Database primary failure'], ['Recover from consumer overload', 'Plan database primary failure handling']),
  topic('distributed-reliability-observability', 'system-design-distributed', 'distributed', 'Reliability & Observability', ['SLI/SLO', 'error budget', 'tracing', 'failure injection', 'incident analysis'], ['Chat p99 latency', 'Service recovery testing'], ['Investigate chat p99 latency', 'Test service recovery with failure injection']),
];
const distributedCases = [
  ['reliable-kafka-consumer', 'Reliable Kafka Consumer'], ['transactional-outbox', 'Transactional Outbox'], ['inventory-reservation', 'Inventory Reservation'], ['cache-consistency', 'Cache Consistency'],
  ['payment-idempotency', 'Payment Idempotency'], ['ordered-messaging', 'Ordered Messaging'], ['failure-recovery', 'Failure Recovery'], ['backpressure', 'Backpressure'],
].map(([slug, title]) => ({
  id: `distributed-case-${slug}`, parentId: 'system-design-distributed', domain: 'system-design', type: 'case', title,
  description: `Reproduce and simulate failure scenarios for ${title} with code or a controlled experiment.`,
  concepts: ['Failure scenario', 'Expected behavior', 'Correctness invariant', 'Implementation or simulation', 'Assertions/logs/data', 'Performance/recovery measurement', 'Before/after comparison'],
  questions: [`Which failure can be reproduced for ${title}?`, 'Which invariant and guarantee must hold?', 'How will correctness and recovery be measured?'],
  contexts: [`Production failure exercise: ${title}`],
  problems: [`Practice case: ${title} — reproduce a failure, implement or simulate recovery, and verify correctness`],
  practice: [`Practice case: ${title} — reproduce a failure, implement or simulate recovery, and verify correctness`],
  resources: [...resourceSets.distributed], children: [],
}));

const layers = [
  { id: 'system-design-lld', title: 'Low-Level Design', concepts: ['Object design', 'principles', 'patterns', 'domain modeling', 'testing'], children: [...lldTopics.map(({ id }) => id), patternGroup.id],
    contexts: ['Payment and order domain modeling', 'Extensible notification and checkout services'], practice: ['Coding and design exercises'], checklistKeys: ['lldKnowledge', 'lldPractice'] },
  { id: 'system-design-hld', title: 'High-Level Design', concepts: ['Requirements', 'capacity', 'APIs', 'storage', 'scaling', 'observability'], children: [...hldTopics.map(({ id }) => id), ...hldCases.map(({ id }) => id)],
    contexts: ['Realtime chat', 'News feed', 'Ticket booking'], practice: hldCases.map(({ title }) => `Practice case: ${title}`), checklistKeys: ['hldKnowledge', 'hldPractice'] },
  { id: 'system-design-distributed', title: 'Distributed Systems & Reliability', concepts: ['Concurrency', 'consistency', 'delivery', 'failure handling', 'reliability'], children: [...distributedTopics.map(({ id }) => id), ...distributedCases.map(({ id }) => id)],
    contexts: ['Payment processing', 'Inventory and messaging reliability', 'Chat service recovery'], practice: distributedCases.map(({ title }) => `Practice case: ${title}`), checklistKeys: ['distributedKnowledge', 'distributedPractice'] },
];
const layerNodes = layers.map(({ id, title, concepts, children, contexts, practice, checklistKeys }) => ({
  id, parentId: 'system-design', domain: 'system-design', type: 'group', title,
  concepts: [...concepts], questions: [`What problems does ${title} address?`, 'What assumptions and trade-offs guide the design?'],
  contexts: [...contexts], problems: [...practice], resources: [...resourceSets[checklistKeys[0].startsWith('lld') ? 'lld' : checklistKeys[0].startsWith('hld') ? 'hld' : 'distributed']],
  children: [...children], checklistKeys: [...checklistKeys],
}));

export const systemDesignNodes = [
  {
    id: 'system-design', parentId: null, domain: 'system-design', type: 'root', title: 'System Design',
    concepts: ['Low-Level Design (LLD)', 'High-Level Design (HLD)', 'Distributed Systems & Reliability'],
    questions: ['What are the requirements, constraints, and trade-offs?', 'How does the design behave under scale and failure?'],
    contexts: ['Java/Spring Boot systems', 'Production architecture and design interviews'],
    problems: ['Learning Roadmap', 'Knowledge Journal', 'Practice Journal'],
    resources: [...resourceSets.lld, ...resourceSets.hld, ...resourceSets.distributed], children: layers.map(({ id }) => id),
  },
  ...layerNodes,
  ...lldTopics, patternGroup, ...patternTopics,
  ...hldTopics, ...hldCases, ...distributedTopics, ...distributedCases,
];
