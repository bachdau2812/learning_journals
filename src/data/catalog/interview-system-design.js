// Original practice prompts. Source keys identify the references used to choose the focus.
// Each tuple: stable slug, title, scenario, focused question, interview follow-up, source keys.
export const systemDesignInterviewTopics = {
  'lld-oop-fundamentals': [
    ['encapsulation-invariants', 'Encapsulation & Domain Invariants', 'Model a wallet that cannot have a negative available balance.', 'Which methods protect the balance invariant without exposing mutable state?', 'How would refunds and concurrent withdrawals change your design?', ['oop', 'contention']],
    ['abstraction-contracts', 'Interfaces & Abstraction Contracts', 'Support card and bank-transfer payments behind one checkout interface.', 'Which guarantees belong in the interface and which details belong in an implementation?', 'How would you represent asynchronous settlement without misleading callers?', ['oop']],
    ['polymorphism-dispatch', 'Polymorphism & Runtime Dispatch', 'Replace a growing delivery-pricing switch with interchangeable pricing policies.', 'How do overriding, overloading and runtime dispatch differ in this example?', 'When would a simple function or switch be preferable?', ['oop', 'strategy']],
    ['composition-inheritance', 'Composition vs Inheritance', 'Add loyalty discounts and express shipping without creating a subclass for every combination.', 'Which behavior should be delegated and what remains part of the object identity?', 'How would you change behavior for one order at runtime?', ['composition', 'strategy']],
    ['value-objects-identity', 'Entity Identity & Immutable Value Objects', 'Represent an Order, Money and shipping Address in a checkout model.', 'How do identity, equality and immutability differ for these objects?', 'What breaks when a mutable object is used as a hash-map key?', ['oop']],
    ['cohesion-coupling', 'Cohesion, Coupling & Responsibilities', 'An OrderService currently validates, charges cards, sends emails and writes reports.', 'Where would you draw responsibility boundaries and why?', 'Can you add a new notification provider without changing order rules?', ['composition', 'ood']],
  ],
  'lld-solid-principles': [
    ['srp-boundaries', 'Single Responsibility & Change Boundaries', 'Separate receipt formatting from checkout business rules.', 'Which independent reasons to change reveal the class boundaries?', 'How would a tax-policy change differ from a new receipt format?', ['ood']],
    ['ocp-extensions', 'Open/Closed & Extensible Policies', 'Add a new discount policy to an existing pricing service.', 'Which extension point avoids editing all callers?', 'How do you avoid speculative abstraction for a single policy?', ['strategy']],
    ['lsp-contracts', 'Liskov Substitution & Behavioral Contracts', 'A read-only collection is passed where callers expect a writable collection.', 'Which preconditions, postconditions or behaviors violate substitution?', 'Would splitting the interface solve the problem more clearly?', ['oop']],
    ['isp-interfaces', 'Interface Segregation', 'One payment interface requires charge, refund and recurring-billing methods from every provider.', 'How would you separate capabilities while keeping callers simple?', 'How should a provider advertise an unsupported capability?', ['oop']],
    ['dip-dependencies', 'Dependency Inversion & Testability', 'An order use case depends directly on an external gateway SDK.', 'Which port should the domain own and where should the adapter live?', 'How would you test gateway failures without a live network?', ['adapter', 'ood']],
  ],
  'lld-modular-architecture': [
    ['ports-adapters', 'Ports & Adapters', 'Replace a database adapter without changing order validation.', 'Which dependencies may point toward the domain?', 'How would an event publisher adapter fit the same boundary?', ['adapter', 'ood']],
    ['modular-monolith', 'Modular Monolith & Module Boundaries', 'Separate billing and fulfillment inside one deployable service.', 'How do you prevent modules from reading each other’s internal tables?', 'What evidence would justify extracting a service?', ['ood', 'delivery']],
    ['dependency-cycles', 'Dependency Cycles & Boundary Refactoring', 'Orders and payments import each other’s internal classes.', 'How would you break the cycle while preserving use-case orchestration?', 'What should be shared and what should remain private?', ['ood']],
  ],
  'lld-api-domain-modeling': [
    ['aggregate-invariants', 'Aggregates & Transaction Boundaries', 'An order reserves items before a payment is captured.', 'Which invariant needs one transaction and which step can be asynchronous?', 'How do you handle reservation expiry during payment?', ['contention', 'workflows']],
    ['dto-entity', 'DTOs, Entities & Validation', 'A public API currently serializes persistence entities directly.', 'Which API and domain validation rules should be separated?', 'How do you evolve an endpoint without leaking internal fields?', ['api']],
    ['state-transitions', 'Domain State Transitions', 'An order can be placed, paid, shipped, cancelled or refunded.', 'Which transitions are legal and where are they enforced?', 'How would you handle duplicate or out-of-order payment callbacks?', ['state', 'workflows']],
  ],
  'lld-concurrency': [
    ['lost-updates', 'Lost Updates & Optimistic Locking', 'Two shoppers update the same cart version.', 'How do you detect and resolve a conflicting update?', 'When do retries become worse than pessimistic locking?', ['contention', 'isolation']],
    ['immutable-state', 'Immutability & Safe Publication', 'Workers share configuration that can be replaced while requests are running.', 'How can each request see a consistent configuration snapshot?', 'Does a final reference make the referenced collection immutable?', ['jmm', 'concurrency']],
    ['locks-deadlocks', 'Lock Scope & Deadlock Avoidance', 'A transfer needs locks on two accounts.', 'How does a consistent lock order prevent circular waiting?', 'How would cancellation and lock timeouts affect cleanup?', ['concurrency']],
  ],
  'lld-testing-refactoring': [
    ['test-doubles', 'Test Doubles & Behavioral Tests', 'A notification provider can return a timeout or a permanent rejection.', 'Which failures should a fake simulate and which require an integration test?', 'How do you avoid asserting internal implementation details?', ['microsoft', 'ood']],
    ['contract-tests', 'Contract Tests & Adapter Compatibility', 'Two payment adapters implement the same interface.', 'Which shared tests demonstrate they preserve the interface contract?', 'How do sandbox behavior and production behavior differ?', ['adapter', 'microsoft']],
    ['safe-refactoring', 'Characterization Tests & Safe Refactoring', 'Replace a legacy pricing algorithm while keeping existing prices.', 'Which representative cases protect observable behavior?', 'How would you compare implementations before switching traffic?', ['microsoft']],
  ],
  'lld-pattern-strategy': [
    ['pricing-policy', 'Pricing Policies & Runtime Selection', 'Select a shipping policy for each order.', 'Who selects the strategy and who executes it?', 'How do you add a policy without modifying checkout?', ['strategy']],
    ['composition', 'Strategy Composition', 'Apply both loyalty and seasonal pricing rules.', 'How do you specify rule ordering and prevent conflicting discounts?', 'Would a pipeline be clearer than nested strategies?', ['strategy']],
  ],
  'lld-pattern-factory-method': [
    ['creation-boundary', 'Creation Boundaries & Provider Selection', 'Create email or SMS senders from configuration.', 'Which creation decision belongs to a factory?', 'How do you validate missing configuration without coupling callers to constructors?', ['patterns']],
    ['factory-vs-injection', 'Factory vs Dependency Injection', 'A service creates short-lived parsers but reuses a long-lived gateway client.', 'When do you need runtime creation instead of constructor injection?', 'Who owns disposal of created resources?', ['patterns']],
  ],
  'lld-pattern-adapter': [
    ['gateway-integration', 'Payment Gateway Adapters', 'Integrate gateways with different errors and response models.', 'How do you normalize failures without losing useful provider detail?', 'What happens when a provider changes its API?', ['adapter']],
    ['adapter-contract', 'Adapter vs Facade vs Decorator', 'A vendor SDK needs a domain-friendly boundary and request logging.', 'Which responsibility belongs to each wrapper?', 'Can each layer be tested independently?', ['adapter', 'decorator']],
  ],
  'lld-pattern-observer': [
    ['domain-events', 'Domain Events & Subscriber Lifecycle', 'Publish order-paid events to receipt and fulfillment handlers.', 'How do you manage subscriptions and handler failures?', 'Should handlers run before or after the transaction commits?', ['observer', 'workflows']],
    ['local-vs-broker', 'In-process Observer vs Message Broker', 'Move a local event handler into another service.', 'Which delivery and ordering guarantees change?', 'How will you prevent a replay from sending duplicate receipts?', ['observer', 'kafka']],
  ],
  'lld-pattern-state': [
    ['order-lifecycle', 'Order Lifecycle & Invalid Transitions', 'Reject shipment of unpaid or cancelled orders.', 'How does the State pattern make transition rules explicit?', 'How do you enforce rules when callbacks arrive twice?', ['state']],
    ['state-vs-strategy', 'State vs Strategy', 'Compare a payment-method policy with an order lifecycle.', 'Who controls changes to state versus strategy?', 'When is a transition table simpler than a class per state?', ['state', 'strategy']],
  ],
  'lld-pattern-decorator': [
    ['client-wrappers', 'Logging, Metrics & Caching Wrappers', 'Wrap a catalog client with metrics and a cache.', 'How does wrapper order affect latency measurements and cache hits?', 'Which errors should each layer propagate?', ['decorator']],
    ['decorator-vs-inheritance', 'Decorator vs Inheritance', 'Enable audit logging for selected gateway instances.', 'Why is object wrapping useful for optional behavior?', 'How do you preserve the original interface contract?', ['decorator']],
  ],
  'lld-pattern-builder': [
    ['validated-construction', 'Validated Construction & Immutable Results', 'Build a search request with optional filters and required tenant information.', 'Which invariants must hold when build is called?', 'Can reusing a builder accidentally mutate a previously built request?', ['builder']],
    ['builder-vs-constructor', 'Builder vs Constructor vs Factory', 'A small value object starts gaining optional configuration.', 'When does a builder improve clarity enough to justify its cost?', 'Would named factory methods express the valid combinations better?', ['builder']],
  ],
  'lld-pattern-chain-of-responsibility': [
    ['request-pipeline', 'Validation & Authorization Pipelines', 'Validate identity, permissions and payload before invoking a use case.', 'Which handlers short-circuit and which must always run?', 'How does changing handler order alter security?', ['patterns', 'security']],
    ['failure-propagation', 'Failure Propagation & Pipeline Observability', 'A handler rejects a request in a long processing chain.', 'How do you record the rejecting stage without exposing secrets?', 'When is an explicit sequence clearer than a generic chain?', ['patterns']],
  ],
  'hld-requirements-capacity': [
    ['scope-nfrs', 'Scope, User Journeys & Measurable NFRs', 'Design an image-sharing service in one interview round.', 'Which three user journeys and measurable requirements drive the design?', 'What would you explicitly defer and why?', ['delivery']],
    ['qps-storage', 'QPS, Storage & Bandwidth Estimates', 'Estimate a service with read-heavy traffic and bursty uploads.', 'Which assumptions determine peak QPS, daily storage growth and bandwidth?', 'Which estimate could change the architecture?', ['delivery']],
    ['latency-budget', 'Latency Budgets & Bottleneck Priorities', 'A user request crosses three synchronous dependencies.', 'How would you divide an end-to-end latency budget?', 'Why can averages hide a poor user experience?', ['monitoring', 'delivery']],
  ],
  'hld-api-communication': [
    ['protocol-choice', 'REST, gRPC & Async Communication', 'Choose communication for a public checkout API and internal price service.', 'What constraints determine protocol and call style?', 'How do timeouts and versioning affect the choice?', ['api', 'http']],
    ['pagination', 'Cursor Pagination & API Evolution', 'Paginate a feed while new posts arrive.', 'What makes a cursor stable and how do you handle deletes?', 'When is offset pagination still acceptable?', ['api']],
    ['realtime', 'WebSocket, SSE & Reconnect', 'Send live order updates and support two-way chat.', 'Which feature actually requires bidirectional communication?', 'How does a reconnect recover missed messages?', ['core', 'http']],
  ],
  'hld-load-balancing-scaling': [
    ['load-balancers', 'L4/L7 Balancing & Health Checks', 'Route API traffic and persistent connections across service nodes.', 'How do health checks, draining and routing rules affect availability?', 'What happens to active connections during deployment?', ['core', 'sre']],
    ['stateless-services', 'Stateless Services & Session Placement', 'Scale a service that stores sessions in process memory.', 'Where should session state live and what trade-offs follow?', 'How would you recover when a session store is unavailable?', ['core']],
    ['autoscaling', 'Autoscaling, Hotspots & Admission Control', 'A sale causes a sudden traffic surge.', 'Which signals trigger scaling and which requests should be limited?', 'Why might adding instances fail to relieve the bottleneck?', ['sre']],
  ],
  'hld-data-modeling-storage': [
    ['access-patterns', 'Access Patterns & SQL/NoSQL Choice', 'Store orders with transactional writes and chat messages with time-range reads.', 'Which access patterns and guarantees drive each storage choice?', 'How would a new query affect your schema?', ['postgres', 'core']],
    ['sharding', 'Shard Keys, Hot Partitions & Resharding', 'Partition a multi-tenant event store.', 'How do you balance locality, even load and cross-tenant queries?', 'How would you move a hot tenant without losing writes?', ['core', 'kafka']],
    ['replicas', 'Read Replicas & Read-after-write', 'A user reads a profile immediately after editing it.', 'How do replica lag and routing affect what the user sees?', 'Which reads must go to the writer?', ['postgres', 'isolation']],
  ],
  'hld-caching': [
    ['cache-aside', 'Cache-aside & Invalidation Races', 'Cache product prices while sellers update them.', 'Where can a stale value be reintroduced after invalidation?', 'How would versions or bounded staleness affect the design?', ['redis']],
    ['stampede', 'Cache Stampede & Hot-key Protection', 'A popular product cache entry expires during a flash sale.', 'How can request coalescing and expiry jitter reduce database pressure?', 'What happens if the coordinating worker crashes?', ['redis', 'sre']],
    ['eviction', 'TTL, Eviction & Cache Failure', 'A cache reaches its memory limit while traffic is rising.', 'How would you choose TTLs and distinguish cache loss from data loss?', 'Can the backing store survive a cold-cache restart?', ['redis', 'sre']],
  ],
  'hld-messaging-async': [
    ['queue-pubsub', 'Queue vs Pub/Sub vs Event Log', 'Notify users and update search after an order changes.', 'Which consumers need independent replay and which need competing workers?', 'How would you isolate a slow subscriber?', ['kafka']],
    ['background-jobs', 'Background Jobs, Retries & DLQ', 'Process images that may fail or take several minutes.', 'How do you track job state, attempts and poison messages?', 'Can a retry safely run after the previous worker completed?', ['kafka', 'workflows']],
    ['backpressure', 'Backpressure & Consumer Capacity', 'The producer emits events faster than workers can process.', 'Which limits prevent unbounded backlog and memory usage?', 'How do you choose between delaying, rejecting and dropping work?', ['sre', 'kafka']],
  ],
  'hld-search-indexing': [
    ['inverted-index', 'Inverted Indexes & Search Semantics', 'Search product titles with filters and ranking.', 'How do tokenization and inverted indexes differ from a database index?', 'How do you support typo tolerance without arbitrary substring scans?', ['search']],
    ['index-pipeline', 'Indexing Pipelines & Reconciliation', 'Database updates asynchronously reach a search index.', 'How do you handle deletes, replay and out-of-order updates?', 'How would you detect a missing indexing event?', ['search', 'workflows']],
    ['search-shards', 'Search Shards, Ranking & Pagination', 'A search service spans many index shards.', 'What work happens on each shard and at the coordinator?', 'How would deep pagination change query cost?', ['search']],
  ],
  'hld-performance-observability': [
    ['tail-latency', 'Tail Latency & Fan-out', 'A page request waits for responses from many services.', 'Why can p99 latency worsen as dependency count rises?', 'Which requests can be parallelized, bounded or degraded?', ['monitoring']],
    ['traces-metrics', 'Traces, Metrics & Bottleneck Diagnosis', 'Users report slow checkout but CPU utilization is low.', 'Which measurements distinguish dependency waiting from application work?', 'How would you avoid high-cardinality metric labels?', ['monitoring', 'microsoft']],
    ['capacity-validation', 'Capacity Validation & Graceful Degradation', 'A dependency slows during a traffic spike.', 'Which workload and limits would you use to assess degradation?', 'Which nonessential features could be disabled first?', ['sre']],
  ],
  'distributed-concurrency': [
    ['conditional-writes', 'Conditional Writes & Inventory Reservation', 'Several shoppers try to reserve the final item.', 'Which atomic condition preserves nonnegative inventory?', 'How do reservation expiry and retries interact?', ['contention', 'isolation']],
    ['fencing', 'Distributed Locks, Leases & Fencing', 'An exclusive worker pauses longer than its lock lease.', 'How do you prevent a stale worker from writing after a new owner starts?', 'Why is a lock alone insufficient if storage ignores fencing tokens?', ['contention']],
    ['contention', 'Optimistic vs Pessimistic Concurrency', 'A popular seat receives thousands of simultaneous booking attempts.', 'When does optimistic retry waste more work than a lock?', 'How would a queue change fairness and throughput?', ['contention']],
  ],
  'distributed-consistency-replication': [
    ['consistency-models', 'Consistency Models & User-visible Guarantees', 'A user edits their profile while another region reads it.', 'How do eventual consistency and read-your-writes differ?', 'Which guarantee is actually required by the product?', ['core', 'postgres']],
    ['cap-partitions', 'CAP Trade-offs During a Partition', 'Two regions lose connectivity while receiving writes.', 'Which operations remain available and which invariants require rejecting work?', 'What does partition recovery require?', ['core']],
    ['quorums', 'Quorums, Replication Lag & Failover', 'A replicated store loses its leader.', 'Which assumptions make a quorum useful and what do quorums not guarantee by themselves?', 'How would stale reads affect financial decisions?', ['postgres', 'core']],
  ],
  'distributed-message-delivery': [
    ['deduplication', 'Idempotency Keys & Deduplication', 'A client retries a payment after timing out.', 'How do you bind an idempotency key to a request and persist its result?', 'What if the same key arrives with a different payload?', ['workflows', 'http']],
    ['offset-atomicity', 'Consumer Offsets & Database Side Effects', 'A consumer writes to a database and crashes before committing its offset.', 'Which step can be repeated and how do you prevent duplicate effects?', 'Does broker exactly-once cover an external payment gateway?', ['kafka']],
    ['delivery-guarantees', 'Delivery Guarantees & Failure Windows', 'A worker acknowledges a message before or after processing it.', 'Which failures cause lost work and which cause repeated work?', 'How would you make replay safe?', ['kafka']],
  ],
  'distributed-ordering-partitioning': [
    ['partition-keys', 'Partition Keys & Per-entity Ordering', 'Deliver messages in order within each conversation.', 'Why must related messages share an ordering boundary?', 'How would a very large conversation become a hotspot?', ['kafka']],
    ['rebalancing', 'Rebalancing, Offsets & In-flight Work', 'A consumer group changes membership while work is running.', 'How can ownership changes affect commits and repeated processing?', 'How do you drain or fence an old consumer?', ['kafka']],
    ['late-events', 'Late Events & Event-time Reasoning', 'An older status update arrives after a newer one.', 'Which version or sequence rule prevents state regression?', 'When should a late event still change the result?', ['kafka']],
  ],
  'distributed-failure-handling': [
    ['deadlines', 'Timeouts, Deadlines & Ambiguous Outcomes', 'A payment request times out after the provider may have charged it.', 'Which outcome is unknown and how do you reconcile it?', 'Why is blindly retrying unsafe?', ['http', 'workflows']],
    ['retry-budget', 'Retry Budgets, Backoff & Jitter', 'Multiple service layers retry the same failing dependency.', 'How does retry multiplication amplify load?', 'Where should retries happen and which failures are retryable?', ['sre']],
    ['circuit-breakers', 'Circuit Breakers & Bulkheads', 'A slow dependency consumes every worker in a service.', 'How do you isolate its resource usage and decide when to reopen calls?', 'What useful degraded response can remain available?', ['sre']],
  ],
  'distributed-transactions': [
    ['outbox', 'Transactional Outbox & Change Propagation', 'An order commits but publishing its event fails.', 'How does an outbox align the local write and pending event?', 'Why must the downstream handler still tolerate duplicates?', ['workflows', 'wal']],
    ['sagas', 'Sagas, Compensation & Irreversible Steps', 'Coordinate inventory reservation, payment and shipment.', 'Which failures can be compensated and which need reconciliation?', 'What if compensation itself fails?', ['workflows']],
    ['two-phase-commit', 'Two-phase Commit & Coordinator Failure', 'Compare a coordinated transaction with an asynchronous workflow.', 'Which availability and blocking risks influence the choice?', 'When would a single database transaction be simpler?', ['workflows', 'isolation']],
  ],
  'distributed-fault-tolerance': [
    ['failover', 'Failover & Split-brain Protection', 'Two nodes each believe they are the active worker.', 'Which ownership rule prevents conflicting effects?', 'How do you distinguish node failure from a network partition?', ['contention', 'core']],
    ['poison-messages', 'Poison Messages & Dead-letter Recovery', 'One malformed event repeatedly crashes a consumer.', 'How can you isolate it while preserving useful processing?', 'What must be checked before replaying the dead-letter queue?', ['kafka']],
    ['overload', 'Load Shedding & Bounded Queues', 'A queue grows while a downstream dependency slows.', 'Which admission and prioritization rules protect essential work?', 'How do you prevent recovery from triggering another overload?', ['sre']],
  ],
  'distributed-reliability-observability': [
    ['slos', 'SLIs, SLOs & Error Budgets', 'Define reliability for a checkout service.', 'Which user-visible success and latency measures should drive the SLO?', 'How should exhausted error budget affect rollout decisions?', ['slo']],
    ['failure-experiments', 'Failure Experiments & Recovery Evidence', 'A replica or worker is deliberately stopped in a controlled environment.', 'Which invariant, recovery time and data checks demonstrate correctness?', 'What would make the experiment unsafe or inconclusive?', ['microsoft', 'sre']],
    ['incident-analysis', 'Incident Analysis & Causal Timelines', 'Duplicate charges coincide with timeouts and a deployment.', 'How do you establish the sequence of events and distinguish cause from correlation?', 'Which mitigation and prevention address different time horizons?', ['workflows', 'monitoring']],
  ],
  'hld-case-url-shortener': [
    ['ids-redirects', 'Short Codes, Collisions & Redirects', 'Create short links and resolve them at high read volume.', 'How do you choose identifiers, handle collisions and validate destinations?', 'What changes when links expire or become private?', ['core', 'api']],
    ['analytics-cache', 'Click Analytics & Hot-link Caching', 'One short link becomes popular while clicks are counted.', 'Which data must be synchronous and which can be processed later?', 'How do bots, duplicate events and cache invalidation affect the count?', ['redis', 'kafka']],
  ],
  'hld-case-rate-limiter': [
    ['algorithm', 'Token Bucket vs Window Algorithms', 'Limit requests per customer while allowing controlled bursts.', 'How do token and window models differ at boundary times?', 'Which behavior should clients observe after a rejection?', ['core', 'redis']],
    ['distributed-budget', 'Distributed Budgets & Store Failure', 'Several API nodes share one customer quota.', 'Which operation must be atomic to avoid overspending the quota?', 'Should requests fail open or closed when the quota store is unavailable?', ['redis', 'contention']],
  ],
  'hld-case-news-feed': [
    ['fanout', 'Fan-out on Write vs Read', 'Build feeds for users with very different follower counts.', 'How do read and write amplification influence the design?', 'How would you handle a creator with millions of followers?', ['core', 'kafka']],
    ['feed-pagination', 'Feed Pagination, Ranking & Freshness', 'Browse a feed while new content and ranking changes arrive.', 'How do you maintain stable pagination and prevent repeated items?', 'How fresh must ranking and deletion updates be?', ['api', 'redis']],
  ],
  'hld-case-realtime-chat': [
    ['delivery', 'Online Delivery, Offline Storage & Acknowledgments', 'Deliver chat messages while users change devices and connectivity.', 'What does an acknowledgment guarantee at each stage?', 'How does a client recover messages missed while offline?', ['kafka', 'core']],
    ['ordering-presence', 'Conversation Ordering & Presence', 'Route messages across gateway nodes while displaying online status.', 'How do you define ordering and locate the connected recipient?', 'Which presence updates can tolerate stale information?', ['kafka', 'redis']],
  ],
  'hld-case-notification-platform': [
    ['channels', 'Channel Preferences & Scheduling', 'Send transactional and promotional notifications through several channels.', 'How do you honor preferences, priorities and delivery windows?', 'How would a new channel fit without changing every caller?', ['strategy', 'workflows']],
    ['delivery', 'Provider Failures, Deduplication & Retry', 'An email provider times out after accepting a send.', 'How do you record intent and reconcile the unknown result?', 'Can a retry send a duplicate notification?', ['workflows', 'kafka']],
  ],
  'hld-case-file-storage': [
    ['upload', 'Multipart Uploads, Resume & Integrity', 'Upload a large file over an unreliable connection.', 'How do chunks, completion metadata and checksums fit together?', 'How would abandoned upload parts be cleaned up?', ['core', 'http']],
    ['sharing', 'File Sharing, Permissions & Download Paths', 'Share a private file with selected users.', 'How do you enforce permissions for direct or cached downloads?', 'How would revoking access affect an already issued download link?', ['security', 'core']],
  ],
  'hld-case-search-service': [
    ['ingestion', 'Search Ingestion & Index Freshness', 'New content appears asynchronously in a searchable index.', 'How do you represent updates, deletes and replayable indexing work?', 'How would you rebuild the index while serving queries?', ['search', 'kafka']],
    ['queries', 'Distributed Queries & Ranking Merge', 'A query searches multiple shards with filters and ranking.', 'How are partial results merged and paginated?', 'What happens when one shard is slow or unavailable?', ['search']],
  ],
  'hld-case-ticket-booking': [
    ['holds', 'Seat Holds, Expiry & Concurrent Buyers', 'Many buyers try to reserve the same concert seat.', 'Which atomic state change ensures one active reservation?', 'How do you handle expiry racing with a payment callback?', ['contention', 'isolation']],
    ['checkout', 'Checkout, Payment & Oversell Prevention', 'Payment succeeds but confirming the booking fails.', 'Which invariant and reconciliation record prevent double allocation?', 'How do you resolve payment after the reservation has expired?', ['workflows', 'contention']],
  ],
  'distributed-case-reliable-kafka-consumer': [
    ['crash-window', 'Consumer Crash After a Database Write', 'Stop a consumer after committing a database change but before committing its offset.', 'What repeated processing should be visible after restart?', 'Which deduplication record makes the replay safe?', ['kafka']],
    ['poison-event', 'Poison Events & Recovery', 'Inject a malformed event into an otherwise valid stream.', 'How do you isolate failure while retaining evidence for diagnosis?', 'How should a repaired event be replayed?', ['kafka']],
  ],
  'distributed-case-transactional-outbox': [
    ['publish-failure', 'Committed Write, Failed Publish', 'Crash the service immediately after saving an order and its outbox row.', 'How does a separate publisher resume pending work?', 'Which records prove no intended event was lost?', ['workflows', 'wal']],
    ['duplicate-publish', 'Duplicate Publish & Consumer Idempotency', 'Crash a publisher after sending an event but before marking the row complete.', 'How is the duplicate identified downstream?', 'Which side effect must be included in the deduplication transaction?', ['workflows', 'kafka']],
  ],
  'distributed-case-inventory-reservation': [
    ['reservation-race', 'Reservation Races & Stock Invariants', 'Run concurrent buyers against one remaining unit.', 'Which conditional update protects available stock?', 'How would you demonstrate the invariant under contention?', ['contention', 'isolation']],
    ['expiry-race', 'Reservation Expiry vs Confirmation', 'A reservation expires while checkout confirmation arrives.', 'Which state machine decides the winning transition?', 'How do you compensate a payment that arrives too late?', ['workflows', 'contention']],
  ],
  'distributed-case-cache-consistency': [
    ['invalidation-race', 'Stale Repopulation After Invalidation', 'Interleave a slow database read with a cache invalidation.', 'Which execution can put an older value back into the cache?', 'How can version checks or a staleness budget address it?', ['redis']],
    ['cold-start', 'Cold Cache & Stampede Recovery', 'Clear a cache while many clients request the same object.', 'How do you bound the concurrent reads reaching storage?', 'How does the system behave if the refresh worker dies?', ['redis', 'sre']],
  ],
  'distributed-case-payment-idempotency': [
    ['duplicate-request', 'Concurrent Duplicate Payment Requests', 'Send several identical requests with one idempotency key.', 'Which atomic claim and saved result prevent duplicate processing?', 'What if a request reuses the key with a changed amount?', ['workflows', 'http']],
    ['unknown-result', 'Timeout, Reconciliation & Unknown Outcomes', 'Drop the provider response after a charge may have succeeded.', 'How do you distinguish failed, completed and unresolved outcomes?', 'Which reconciliation evidence allows a safe retry?', ['workflows']],
  ],
  'distributed-case-ordered-messaging': [
    ['ordering-key', 'Ordering Keys & Consumer Parallelism', 'Send status changes for many orders through a partitioned log.', 'How do you preserve per-order order while allowing cross-order parallelism?', 'What happens when a single order receives extreme traffic?', ['kafka']],
    ['out-of-order', 'Duplicate, Late & Out-of-order Events', 'Deliver an old status after a newer version has already been applied.', 'Which version rule prevents regression?', 'How do you distinguish duplicates from a missing earlier event?', ['kafka']],
  ],
  'distributed-case-failure-recovery': [
    ['worker-recovery', 'Worker Failover & Fencing', 'Pause an active worker until another worker takes over.', 'How do you stop the resumed old owner from making conflicting writes?', 'What evidence demonstrates ownership during each step?', ['contention']],
    ['recovery-targets', 'Recovery Time, Data Checks & Service Restoration', 'Stop a dependency during a controlled recovery exercise.', 'Which recovery deadline and consistency checks define success?', 'How do you prevent recovery traffic from causing another outage?', ['slo', 'sre']],
  ],
  'distributed-case-backpressure': [
    ['bounded-work', 'Bounded Queues & Slow Consumers', 'Increase input rate until a consumer cannot keep up.', 'Which queue, memory and rejection bounds remain enforced?', 'How do you report delayed or rejected work to callers?', ['sre', 'kafka']],
    ['recovery', 'Backlog Drain & Priority Recovery', 'Restore a downstream dependency after a backlog has accumulated.', 'How do you drain work without exceeding downstream capacity?', 'Which new or high-priority requests should bypass old work?', ['sre']],
  ],
};

export const additionalDesignNodes = [
  ['lld-pattern-command', 'lld-design-patterns', 'Command & Undo', 'Represent user actions as objects in an editor.', 'What state is required to undo an action?', 'How do retries differ from undo?', 'patterns', 'topic'],
  ['lld-pattern-composite', 'lld-design-patterns', 'Composite & Tree Structures', 'Model a folder hierarchy or nested rule tree.', 'Which operations work uniformly on leaves and groups?', 'How do you prevent cycles and invalid ownership?', 'patterns', 'topic'],
  ['lld-pattern-proxy', 'lld-design-patterns', 'Proxy & Controlled Access', 'Place authorization or lazy loading in front of a service.', 'Which interface guarantees must a proxy preserve?', 'How does this differ from Adapter and Decorator?', 'patterns', 'topic'],
  ['lld-pattern-singleton', 'lld-design-patterns', 'Singleton: Scope & Trade-offs', 'Review a globally shared configuration object.', 'What lifetime and thread-safety guarantees do you actually need?', 'Why does a process singleton not coordinate multiple service instances?', 'patterns', 'topic'],
  ['lld-case-parking-lot', 'system-design-lld', 'Design a Parking Lot', 'Model spots, vehicle types, tickets and fee calculation.', 'Which responsibilities and invariants belong in each object?', 'How would simultaneous entry and exit change the design?', 'ood', 'case'],
  ['lld-case-elevator', 'system-design-lld', 'Design an Elevator Controller', 'Model requests, elevator state and dispatch policies.', 'How do you separate dispatch policy from movement state?', 'How do priority requests and failed elevators change scheduling?', 'ood', 'case'],
  ['lld-case-vending-machine', 'system-design-lld', 'Design a Vending Machine', 'Model product selection, payment, stock and change.', 'Which legal state transitions protect money and inventory?', 'What if dispensing fails after payment?', 'ood', 'case'],
  ['lld-case-expense-sharing', 'system-design-lld', 'Design Expense Sharing', 'Represent users, expenses and split policies.', 'How do you validate shares and preserve monetary precision?', 'How would you support new split types and reverse an expense?', 'ood', 'case'],
];
