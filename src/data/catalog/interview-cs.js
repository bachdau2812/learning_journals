// Authored interview exercises; these are not transcripts of company interview questions.
export const csInterviewTopics = {
  'cs-operating-systems-process-thread': [
    ['isolation', 'Process Isolation & Shared Thread State', 'Choose processes or threads for independent file-processing jobs.', 'Which resources are isolated and which are shared?', 'How does a worker crash affect the rest of the application?', ['os', 'concurrency']],
    ['context-switch', 'Context Switching & Thread Diagnostics', 'A Java service becomes slower after increasing its worker count.', 'How would you distinguish useful parallelism from scheduling overhead?', 'Which thread-state and CPU observations would support your conclusion?', ['os', 'linux']],
  ],
  'cs-operating-systems-cpu-scheduling': [
    ['workloads', 'CPU-bound vs I/O-bound Workloads', 'Size workers for image processing and remote API calls.', 'Why should these workloads use different concurrency limits?', 'What changes when a downstream connection pool is smaller than the worker pool?', ['os', 'virtualThreads']],
    ['starvation', 'Preemption, Fairness & Starvation', 'Long background tasks delay short user requests.', 'How would priorities or separate queues affect fairness?', 'How can a higher-priority task still wait on a lower-priority task?', ['os']],
  ],
  'cs-operating-systems-synchronization': [
    ['race-condition', 'Race Conditions & Atomic Operations', 'Two threads increment a shared counter.', 'Why is a read-modify-write operation not made atomic by visibility alone?', 'When is a lock needed instead of an atomic counter?', ['jmm', 'concurrency']],
    ['mutex-semaphore', 'Mutex vs Semaphore vs Condition', 'Limit concurrent database requests while workers wait for tasks.', 'Which primitive protects state and which limits permits?', 'How do you avoid leaking a permit when work fails?', ['os', 'concurrency']],
    ['deadlock', 'Deadlock, Livelock & Lock Ordering', 'Two workers acquire the same pair of locks in opposite order.', 'Which necessary conditions create the deadlock?', 'How do timeouts, ordering and retry affect progress?', ['concurrency']],
  ],
  'cs-operating-systems-memory-management': [
    ['virtual-memory', 'Virtual Memory, Paging & Page Faults', 'Resident memory grows while the managed heap remains stable.', 'How do address space, resident pages and heap allocation differ?', 'Which page-fault and memory observations would reveal pressure?', ['os']],
    ['memory-limits', 'Stack, Heap & Native Memory', 'A container is killed although the JVM heap is below its limit.', 'Which allocations exist outside the heap?', 'How do thread count, buffers and container limits affect sizing?', ['os', 'virtualThreads']],
  ],
  'cs-operating-systems-io-file-systems': [
    ['nonblocking-io', 'Blocking I/O vs Readiness Multiplexing', 'Serve many mostly idle socket connections.', 'How does readiness notification differ from one blocking thread per connection?', 'What must an edge-triggered reader do before waiting again?', ['epoll', 'virtualThreads']],
    ['durability', 'Buffers, fsync & Crash Durability', 'An application reports a successful write before a machine loses power.', 'Which layers might still hold unflushed data?', 'How does batching durable writes trade latency for throughput?', ['os', 'wal']],
    ['file-descriptors', 'File Descriptors & Resource Leaks', 'A server starts failing to open new sockets.', 'How would you distinguish descriptor exhaustion from network failure?', 'Which ownership and cleanup rules prevent the leak?', ['linux', 'epoll']],
  ],
  'cs-operating-systems-os-java-runtime': [
    ['virtual-threads', 'Platform vs Virtual Threads', 'A server performs many blocking remote calls.', 'Why can virtual threads improve concurrency without making CPU work faster?', 'Which external resources still need explicit limits?', ['virtualThreads']],
    ['thread-pools', 'Thread Pools, Queues & Rejection', 'Requests queue faster than a bounded executor can finish them.', 'How do pool size, queue capacity and rejection policy interact?', 'What should happen when a client cancels queued work?', ['concurrency', 'sre']],
  ],
  'cs-networking-networking-basics': [
    ['request-journey', 'The Journey of a Browser Request', 'Explain what happens between entering a URL and receiving a response.', 'Where do name resolution, transport, encryption and application routing occur?', 'How would you locate the failing stage of a request?', ['http', 'tcp', 'tls']],
    ['socket-routing', 'Sockets, Ports & Routing', 'A server is listening but a remote client cannot connect.', 'Which address, bind interface, route and firewall facts would you inspect?', 'How does a refused connection differ from a timeout?', ['tcp', 'linux']],
  ],
  'cs-networking-tcp-udp': [
    ['handshake-reliability', 'TCP Handshake, Retransmission & Ordering', 'Packets are lost while an application uploads a large file.', 'How does TCP detect missing data and reconstruct the byte stream?', 'Why must an application still define its own message boundaries?', ['tcp']],
    ['flow-congestion', 'Flow Control vs Congestion Control', 'A receiver is slow while the network is also congested.', 'Which control protects the receiver and which protects the network?', 'How can packet loss and RTT change throughput?', ['tcp']],
    ['protocol-choice', 'TCP, UDP & Application Trade-offs', 'Choose transport for file transfer and interactive voice.', 'Which reliability, latency and ordering properties matter?', 'How would the application handle loss if using UDP?', ['tcp', 'microsoft']],
  ],
  'cs-networking-dns': [
    ['resolution-caching', 'DNS Resolution & Cache Layers', 'A service changes IP but some clients keep using the previous address.', 'Which resolver and application caches could explain this?', 'Why does changing a TTL not instantly clear existing caches?', ['dns']],
    ['dns-failures', 'DNS Failures & Service Discovery', 'Only one environment cannot resolve an internal service name.', 'How would you separate resolver configuration from authoritative DNS failure?', 'What changes when service instances are added frequently?', ['dns', 'linux']],
  ],
  'cs-networking-http': [
    ['semantics-idempotency', 'HTTP Methods, Idempotency & Retries', 'A client retries an API request after losing its response.', 'Which method semantics permit safe repetition and what does the endpoint actually guarantee?', 'How can a POST endpoint support explicit deduplication?', ['http']],
    ['versions-connections', 'HTTP Versions & Connection Reuse', 'Compare many small requests over HTTP/1.1 and HTTP/2.', 'How do multiplexing and transport-level blocking affect concurrent requests?', 'What changes when a gateway speaks a different protocol upstream?', ['http', 'tcp']],
    ['conditional-requests', 'HTTP Caching & Conditional Requests', 'Clients repeatedly fetch a product that rarely changes.', 'How do validators and conditional requests avoid transferring unchanged data?', 'Which responses must not be shared between users?', ['http']],
  ],
  'cs-networking-https-tls': [
    ['certificate-validation', 'Certificates, Trust Chains & Hostnames', 'TCP connects but HTTPS fails after a certificate update.', 'Which trust-chain, hostname and expiry checks would you examine?', 'Why is disabling certificate validation unsafe?', ['tls']],
    ['handshake-encryption', 'TLS Handshake & Encryption Boundaries', 'Trace an HTTPS request through a reverse proxy.', 'Where is the connection authenticated and where is encryption terminated?', 'What protects the proxy-to-service connection?', ['tls']],
  ],
  'cs-networking-realtime-networking': [
    ['websocket-sse', 'WebSocket vs SSE vs Long Polling', 'Choose transport for a chat feature and a one-way status feed.', 'Which feature needs two-way traffic over one connection?', 'How do proxies and connection limits affect the choice?', ['core', 'http']],
    ['reconnect-replay', 'Heartbeats, Reconnect & Resume Tokens', 'A mobile client disconnects and reconnects during message delivery.', 'How does the client detect liveness and resume from a known position?', 'How are repeated messages recognized?', ['tcp', 'kafka']],
  ],
  'cs-networking-network-performance': [
    ['latency-throughput', 'RTT, Bandwidth & Throughput', 'A high-bandwidth connection still makes small sequential calls slow.', 'How do request size and round trips limit effective performance?', 'Would batching or parallel requests help more than additional bandwidth?', ['tcp']],
    ['pools-deadlines', 'Connection Pools & End-to-end Deadlines', 'Requests wait for a connection before reaching the database.', 'Which queueing and connection metrics separate waiting from execution?', 'How does a timeout budget propagate across dependent calls?', ['http', 'sre']],
  ],
  'cs-database-relational-modeling': [
    ['constraints-normalization', 'Keys, Constraints & Normalization', 'Model customers, orders and order items.', 'Which keys and constraints protect integrity independently of application code?', 'When would denormalization be justified by a measured access pattern?', ['relational']],
    ['joins-pagination', 'Joins, NULL Semantics & Pagination', 'Return recent orders and their optional payment records.', 'How do join type and filtering affect missing rows?', 'How can a one-to-many join duplicate paginated results?', ['relational', 'postgres']],
  ],
  'cs-database-indexing': [
    ['composite-index', 'Composite Indexes & Column Order', 'Filter orders by customer and sort by creation time.', 'How would you choose an index for the query’s equality, range and ordering conditions?', 'What changes if the query omits the first indexed column?', ['indexes', 'multicolumn']],
    ['index-cost', 'Selectivity, Covering & Write Cost', 'A table has several indexes but one query is still slow.', 'Why may the planner choose a sequential scan?', 'Which additional index would increase write and storage costs?', ['indexes', 'explain']],
    ['specialized-indexes', 'Partial, Expression & Specialized Indexes', 'Frequently query active users by a normalized email address.', 'When can a partial or expression index match the workload?', 'What query conditions are required to use it?', ['indexes']],
  ],
  'cs-database-query-execution': [
    ['explain-analyze', 'EXPLAIN: Estimates vs Actual Work', 'A query is fast on development data but slow on production data.', 'Which estimates, row counts and execution nodes would you compare?', 'Why should EXPLAIN ANALYZE on a write query be used carefully?', ['explain']],
    ['joins-n-plus-one', 'Join Strategies & N+1 Queries', 'Loading a page of orders triggers one extra query per order.', 'How would you identify the repeated query pattern and choose batching or a join?', 'Can a large join produce more data than the page needs?', ['explain', 'relational']],
  ],
  'cs-database-transactions-acid': [
    ['atomicity-durability', 'Atomicity, Durability & Failure Boundaries', 'A transfer updates two account rows before a process crashes.', 'Which guarantees come from a committed database transaction?', 'Which external side effects remain outside that transaction?', ['isolation', 'wal']],
    ['locks-transactions', 'Transactions, Locks & Deadlock Recovery', 'Two transactions update the same rows in different orders.', 'How would you reduce lock duration and avoid cyclic waiting?', 'Which errors require retrying the entire transaction?', ['isolation']],
  ],
  'cs-database-isolation-mvcc': [
    ['anomalies', 'Read Anomalies & Isolation Levels', 'Two concurrent transactions read and update shared business state.', 'Which observations distinguish nonrepeatable reads, phantoms and write skew?', 'How do guarantees vary between database engines?', ['isolation']],
    ['mvcc-snapshots', 'MVCC Snapshots & Long Transactions', 'An old transaction remains open while many rows change.', 'How does a snapshot affect what is visible?', 'How can a long-running transaction affect cleanup and storage?', ['isolation']],
    ['serializable', 'Serializable Execution & Retry', 'Concurrent booking transactions must preserve a cross-row rule.', 'When can serializable isolation reject a transaction instead of blocking it?', 'How would you retry without duplicating a payment side effect?', ['isolation', 'contention']],
  ],
  'cs-database-storage-recovery': [
    ['wal-checkpoints', 'WAL, Checkpoints & Crash Recovery', 'A database restarts after losing power during writes.', 'Why must durable log records precede related data-page writes?', 'How do checkpoints influence recovery work?', ['wal']],
    ['replication-backup', 'Replication vs Backup & Recovery Objectives', 'An accidental deletion is copied to every replica.', 'Why does replication not replace a recoverable backup?', 'How do recovery point and recovery time affect the plan?', ['wal', 'postgres']],
  ],
  'cs-computer-architecture-jvm-cpu-fundamentals': [
    ['parallelism', 'Parallelism, Cores & Sequential Bottlenecks', 'A batch job stops scaling beyond a few workers.', 'Which sequential work and contention bound the possible speedup?', 'How could measurement distinguish a CPU bottleneck from I/O waiting?', ['os', 'linux']],
    ['locality-branches', 'Data Locality & Branch Behavior', 'Compare traversing compact arrays with following scattered objects.', 'Why can data access patterns matter beyond asymptotic complexity?', 'How would you benchmark without confusing warm-up with steady-state performance?', ['os', 'jmm']],
  ],
  'cs-computer-architecture-jvm-memory-hierarchy': [
    ['cache-locality', 'CPU Caches & Cache-friendly Layout', 'Workers repeatedly access a large shared data structure.', 'How do cache locality and memory bandwidth affect execution?', 'When could a more compact representation help?', ['os']],
    ['false-sharing', 'False Sharing & Shared Counters', 'Independent worker counters perform poorly when updated concurrently.', 'How can unrelated fields contend through cache lines?', 'How would you demonstrate the cause before changing layout?', ['jmm', 'os']],
  ],
  'cs-computer-architecture-jvm-java-memory-model': [
    ['happens-before', 'Happens-before & Safe Publication', 'A worker reads a newly constructed object published by another thread.', 'Which synchronization edges make its initialized state visible?', 'What happens if this escapes during construction?', ['jmm']],
    ['volatile-atomicity', 'volatile: Visibility vs Atomicity', 'A stop flag works but a volatile counter still loses increments.', 'Which guarantee does volatile provide and which operation remains compound?', 'When would synchronization or an atomic type be required?', ['jmm']],
    ['final-immutability', 'final Fields & Effective Immutability', 'Share a final reference to a collection between workers.', 'Why can the reference be final while the collection remains mutable?', 'How would defensive copying affect safe sharing?', ['jmm']],
  ],
  'cs-computer-architecture-jvm-garbage-collection': [
    ['reachability', 'Reachability, Retention & Memory Leaks', 'Heap usage increases after every request despite garbage collection.', 'Which retained references prevent objects from becoming collectible?', 'How would a bounded cache differ from an unbounded retention bug?', ['gc']],
    ['gc-latency', 'Allocation Rate, GC Pauses & Throughput', 'Latency spikes coincide with collection activity.', 'Which allocation and pause observations guide the investigation?', 'How do heap size and collector choice involve trade-offs?', ['gc']],
  ],
  'cs-linux-security-linux-processes': [
    ['signals', 'Signals & Graceful Shutdown', 'A service must stop accepting requests before deployment terminates it.', 'How do shutdown signals, draining and cleanup fit together?', 'Why can an immediate kill interrupt pending writes?', ['linux', 'os']],
    ['cpu-diagnosis', 'CPU, Thread States & Process Diagnosis', 'A Java service has high CPU and increasing response time.', 'How would process metrics and thread evidence identify useful versus stuck work?', 'Which evidence would distinguish busy looping from lock contention?', ['linux', 'concurrency']],
  ],
  'cs-linux-security-linux-networking': [
    ['connection-diagnostics', 'Connection Refused vs Timeout vs TLS Failure', 'An API is unreachable from one host but reachable from another.', 'Which DNS, route, listener and TLS checks narrow the cause?', 'How do you avoid treating all failures as application errors?', ['tcp', 'tls', 'linux']],
    ['socket-lifecycle', 'Socket States & Connection Leaks', 'Socket counts grow after each traffic spike.', 'How do you distinguish normal connection lifecycle from leaked ownership?', 'Which limits and connection reuse settings matter?', ['tcp', 'epoll']],
  ],
  'cs-linux-security-resource-monitoring': [
    ['container-limits', 'Container CPU/Memory Limits & OOM', 'A container restarts while the host has unused memory.', 'How can per-container limits differ from host resources?', 'Which memory categories and termination evidence would you inspect?', ['os', 'linux']],
    ['disk-fd', 'Disk, File Descriptors & Saturation', 'A service fails under load despite low CPU usage.', 'Which disk, descriptor and queue metrics expose resource exhaustion?', 'How would you prioritize restoration before root-cause work?', ['linux', 'os']],
  ],
  'cs-linux-security-authentication-authorization': [
    ['sessions-tokens', 'Sessions vs Tokens & Revocation', 'Users need to log out every device after a credential compromise.', 'How do stateful sessions and signed tokens differ for revocation?', 'What happens to refresh tokens and stolen active tokens?', ['security']],
    ['object-permissions', 'Object-level Authorization & Tenant Isolation', 'An authenticated user changes an order ID in a request.', 'Where is ownership checked independently of successful authentication?', 'How would role permissions and tenant boundaries compose?', ['security', 'api']],
  ],
  'cs-linux-security-application-security': [
    ['injection', 'SQL Injection & Parameterized Queries', 'An endpoint accepts user-controlled search criteria.', 'Which values can be bound and which identifiers need an allowlist?', 'Why does input validation alone not replace parameterization?', ['security']],
    ['csrf-cors', 'CSRF, CORS & Browser Trust Boundaries', 'A browser calls an API using cookie-based credentials.', 'Which threat is addressed by CSRF defenses and which policy is enforced by CORS?', 'Why does CORS not authorize access to an object?', ['security', 'http']],
    ['secrets-passwords', 'Password Storage, Secrets & Least Privilege', 'A service stores user passwords and external API credentials.', 'Why do password hashing and reversible secret storage have different goals?', 'How do rotation and restricted permissions reduce compromise impact?', ['security']],
  ],
};
