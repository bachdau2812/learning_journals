const groupDefinitions = [
  [
    "cs-operating-systems",
    "Operating Systems",
    [
      [
        "process-thread",
        "Process & Thread",
        [
          "Process lifecycle",
          "address space",
          "shared memory",
          "context switching."
        ],
        [
          "Process và Thread khác nhau ở tài nguyên và memory isolation nào?",
          "Context switching có những chi phí gì?",
          "Làm sao xác định Java thread tiêu thụ CPU bất thường?"
        ]
      ],
      [
        "cpu-scheduling",
        "CPU Scheduling",
        [
          "Scheduling",
          "preemption",
          "starvation",
          "CPU-bound/I/O-bound."
        ],
        [
          "Vì sao nhiều thread không luôn tăng throughput?",
          "CPU-bound và I/O-bound khác nhau thế nào?",
          "Thread starvation xảy ra trong trường hợp nào?"
        ]
      ],
      [
        "synchronization",
        "Synchronization",
        [
          "Race condition",
          "mutex",
          "semaphore",
          "atomic operations",
          "deadlock."
        ],
        [
          "Race condition phát sinh khi nào?",
          "Mutex, semaphore và atomic khác nhau thế nào?",
          "Phát hiện và phòng tránh deadlock trong Java bằng cách nào?"
        ]
      ],
      [
        "memory-management",
        "Memory Management",
        [
          "Virtual memory",
          "paging",
          "stack/heap",
          "page faults."
        ],
        [
          "Virtual Memory giải quyết vấn đề gì?",
          "Page fault ảnh hưởng performance thế nào?",
          "Vì sao process memory usage có thể lớn hơn JVM heap usage?"
        ]
      ],
      [
        "io-file-systems",
        "I/O & File Systems",
        [
          "File descriptor",
          "blocking/non-blocking I/O",
          "buffering",
          "durability."
        ],
        [
          "Blocking I/O ảnh hưởng thế nào đến server?",
          "File descriptor exhaustion gây ra lỗi gì?",
          "Vì sao dữ liệu vừa ghi có thể mất khi hệ thống crash?"
        ]
      ],
      [
        "os-java-runtime",
        "OS & Java Runtime",
        [
          "JVM threads",
          "virtual threads",
          "thread pools",
          "memory/GC."
        ],
        [
          "Platform Threads và OS Threads liên quan thế nào?",
          "Virtual Threads phù hợp với workload nào?",
          "Làm sao phân biệt memory leak, heap pressure và resource exhaustion?"
        ]
      ]
    ],
    [
      "Race Condition Experiment",
      "Deadlock Simulation",
      "Thread Pool Benchmark",
      "JVM Memory Monitoring",
      "Blocking vs Non-blocking I/O"
    ],
    [
      "https://docs.oracle.com/javase/tutorial/essential/concurrency/",
      "https://docs.oracle.com/en/java/javase/"
    ]
  ],
  [
    "cs-networking",
    "Computer Networking",
    [
      [
        "networking-basics",
        "Networking Basics",
        [
          "TCP/IP",
          "IP",
          "port",
          "socket",
          "routing",
          "subnet."
        ],
        [
          "Dữ liệu từ client đến server đi qua những tầng nào?",
          "IP và port khác nhau thế nào?",
          "Vì sao server đang chạy nhưng client không kết nối được?"
        ]
      ],
      [
        "tcp-udp",
        "TCP & UDP",
        [
          "Handshake",
          "reliability",
          "ordering",
          "retransmission",
          "flow/congestion control."
        ],
        [
          "TCP duy trì ordered delivery bằng cách nào?",
          "Flow control khác congestion control thế nào?",
          "Vì sao xảy ra retransmission hoặc connection reset?"
        ]
      ],
      [
        "dns",
        "DNS",
        [
          "Resolver",
          "DNS hierarchy",
          "cache",
          "TTL."
        ],
        [
          "Điều gì xảy ra khi truy cập một domain?",
          "DNS cache ảnh hưởng thế nào khi IP server thay đổi?",
          "Vì sao DNS resolution thất bại dù server hoạt động?"
        ]
      ],
      [
        "http",
        "HTTP",
        [
          "HTTP/1.1",
          "HTTP/2",
          "HTTP/3",
          "methods",
          "status codes",
          "connection reuse."
        ],
        [
          "HTTP/2 cải thiện điểm nào của HTTP/1.1?",
          "HTTP idempotency quan trọng thế nào với retry?",
          "Request có thể thành công ở server nhưng client nhận timeout không?"
        ]
      ],
      [
        "https-tls",
        "HTTPS & TLS",
        [
          "TLS handshake",
          "certificate",
          "trust chain",
          "encryption."
        ],
        [
          "TLS thiết lập kết nối an toàn như thế nào?",
          "Certificate verification bảo vệ khỏi nguy cơ nào?",
          "Vì sao TCP thành công nhưng TLS handshake thất bại?"
        ]
      ],
      [
        "realtime-networking",
        "Realtime Networking",
        [
          "WebSocket",
          "SSE",
          "long polling",
          "heartbeat",
          "reconnect."
        ],
        [
          "Khi nào WebSocket phù hợp hơn SSE?",
          "Làm sao phát hiện và xử lý connection loss?",
          "Khi reconnect, làm sao tránh missing/duplicate messages?"
        ]
      ],
      [
        "network-performance",
        "Network Performance",
        [
          "RTT",
          "latency",
          "bandwidth",
          "throughput",
          "timeout",
          "connection pools."
        ],
        [
          "Connection pooling cải thiện hiệu năng trong điều kiện nào?",
          "Phân biệt network delay và processing delay thế nào?",
          "Retry/timeout sai có thể dẫn đến cascading failure ra sao?"
        ]
      ]
    ],
    [
      "TCP Socket Java",
      "Wireshark Investigation",
      "HTTP Timing Analysis",
      "WebSocket Reconnection",
      "Timeout Simulation"
    ],
    [
      "https://developer.mozilla.org/en-US/docs/Web/HTTP",
      "https://www.wireshark.org/docs/"
    ]
  ],
  [
    "cs-database",
    "Database Systems",
    [
      [
        "relational-modeling",
        "Relational Modeling",
        [
          "Keys",
          "normalization",
          "relationships",
          "constraints",
          "schema evolution."
        ],
        [
          "Khi nào normalization hữu ích và khi nào denormalization hợp lý?",
          "Làm sao bảo vệ data integrity ở database?",
          "Làm sao thay đổi schema production an toàn?"
        ]
      ],
      [
        "indexing",
        "Indexing",
        [
          "B+ Tree",
          "composite index",
          "covering index",
          "selectivity."
        ],
        [
          "Vì sao query có index vẫn chậm?",
          "Thứ tự các cột trong composite index ảnh hưởng ra sao?",
          "Index ảnh hưởng write performance như thế nào?"
        ]
      ],
      [
        "query-execution",
        "Query Execution",
        [
          "Execution plans",
          "scans",
          "join algorithms",
          "query optimizer."
        ],
        [
          "Query optimizer lựa chọn index như thế nào?",
          "Vì sao cùng query có performance khác nhau khi dữ liệu thay đổi?",
          "Làm sao tìm bottleneck bằng EXPLAIN?"
        ]
      ],
      [
        "transactions-acid",
        "Transactions & ACID",
        [
          "Atomicity",
          "Consistency",
          "Isolation",
          "Durability",
          "commit/rollback."
        ],
        [
          "Transaction bảo vệ những nghiệp vụ nào?",
          "Long-running transaction gây những vấn đề gì?",
          "Vì sao rollback DB không rollback được external side effects?"
        ]
      ],
      [
        "isolation-mvcc",
        "Isolation & MVCC",
        [
          "Isolation levels",
          "MVCC",
          "locks",
          "lost updates",
          "deadlocks."
        ],
        [
          "Các isolation levels khác nhau thế nào?",
          "MVCC hỗ trợ concurrency như thế nào?",
          "Làm sao xử lý lost update hoặc deadlock?"
        ]
      ],
      [
        "storage-recovery",
        "Storage & Recovery",
        [
          "Buffer pool",
          "redo log",
          "WAL",
          "checkpoint",
          "crash recovery."
        ],
        [
          "Buffer pool ảnh hưởng I/O thế nào?",
          "WAL/Redo Log giúp recovery ra sao?",
          "Database cần làm gì để phục hồi trạng thái durable sau crash?"
        ]
      ]
    ],
    [
      "MySQL Index Benchmark",
      "EXPLAIN/Query Optimization",
      "Transaction Isolation Experiments",
      "Concurrent Updates",
      "Deadlock Investigation"
    ],
    [
      "https://dev.mysql.com/doc/",
      "https://use-the-index-luke.com/"
    ]
  ],
  [
    "cs-computer-architecture-jvm",
    "Computer Architecture & JVM",
    [
      [
        "cpu-fundamentals",
        "CPU Fundamentals",
        [
          "Cores",
          "instructions",
          "pipelines",
          "CPU-bound workload."
        ],
        [
          "Khi nào multi-core cải thiện performance?",
          "Vì sao CPU usage cao chưa đủ để xác định bottleneck?",
          "Làm sao benchmark single-thread và multi-thread?"
        ]
      ],
      [
        "memory-hierarchy",
        "Memory Hierarchy",
        [
          "Registers",
          "CPU cache",
          "RAM",
          "locality."
        ],
        [
          "Cache locality ảnh hưởng hiệu năng thế nào?",
          "Vì sao random memory access có thể chậm?",
          "Data structure ảnh hưởng memory behavior ra sao?"
        ]
      ],
      [
        "java-memory-model",
        "Java Memory Model",
        [
          "Heap",
          "stack",
          "metaspace",
          "visibility",
          "happens-before."
        ],
        [
          "Java Memory Model giải quyết vấn đề gì?",
          "volatile khác synchronized thế nào?",
          "Khi nào shared state dẫn tới stale reads?"
        ]
      ],
      [
        "garbage-collection",
        "Garbage Collection",
        [
          "Reachability",
          "GC algorithms",
          "pauses",
          "profiling."
        ],
        [
          "GC phát hiện object không còn sử dụng bằng cách nào?",
          "GC ảnh hưởng p99 latency ra sao?",
          "Làm sao nhận diện GC pressure?"
        ]
      ]
    ],
    [
      "JMH Benchmarks",
      "Memory Profiling",
      "GC Logs",
      "Java Flight Recorder"
    ],
    [
      "https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html",
      "https://openjdk.org/projects/code-tools/jmh/"
    ]
  ],
  [
    "cs-linux-security",
    "Linux & Security",
    [
      [
        "linux-processes",
        "Linux Processes",
        [
          "PID",
          "signals",
          "process states",
          "permissions."
        ],
        [
          "Làm sao kiểm tra và dừng process an toàn?",
          "SIGTERM khác SIGKILL thế nào?",
          "Vì sao process còn tồn tại nhưng không phản hồi?"
        ]
      ],
      [
        "linux-networking",
        "Linux Networking",
        [
          "Ports",
          "sockets",
          "DNS tools",
          "firewall."
        ],
        [
          "Làm sao tìm service đang listen trên port?",
          "Connection refused khác timeout như thế nào?",
          "Làm sao debug kết nối giữa Docker containers?"
        ]
      ],
      [
        "resource-monitoring",
        "Resource Monitoring",
        [
          "CPU",
          "RAM",
          "disk",
          "file descriptors",
          "Docker limits."
        ],
        [
          "Làm sao phát hiện container OOM kill?",
          "Disk full ảnh hưởng database thế nào?",
          "Metrics nào cho thấy resource exhaustion?"
        ]
      ],
      [
        "authentication-authorization",
        "Authentication & Authorization",
        [
          "Sessions",
          "JWT",
          "RBAC",
          "permission boundaries."
        ],
        [
          "Authentication khác Authorization thế nào?",
          "JWT bị lộ gây ra rủi ro gì?",
          "Làm sao ngăn user truy cập dữ liệu của user khác?"
        ]
      ],
      [
        "application-security",
        "Application Security",
        [
          "SQL Injection",
          "password hashing",
          "CORS/CSRF",
          "secrets",
          "least privilege."
        ],
        [
          "Parameterized queries chống SQL injection như thế nào?",
          "CORS có thay thế authorization được không?",
          "Làm sao quản lý credentials và secrets an toàn?"
        ]
      ]
    ],
    [
      "Linux Troubleshooting",
      "Docker Resource Monitoring",
      "API Authorization Tests",
      "SQL Injection Prevention",
      "Network Diagnostics"
    ],
    [
      "https://man7.org/linux/man-pages/",
      "https://owasp.org/www-project-top-ten/"
    ]
  ]
];

function createTopic(groupId, [slug, title, concepts, questions], practice, resources) {
  const id = `${groupId}-${slug}`;
  return { id, parentId: groupId, domain: 'cs', type: 'topic', title, concepts, questions, contexts: ['Java backend production systems', 'Technical interviews'], problems: practice.map((name) => `Practice: ${name}`), practice: practice.map((name) => `Practice: ${name}`), resources: [...resources], checklistIds: ['csKnowledge', 'csPractice'], children: [] };
}

const groups = groupDefinitions.map(([id, title, topics, practice, resources]) => ({ id, parentId: 'cs-fundamentals', domain: 'cs', type: 'group', title, concepts: ['Concept', 'Mechanism', 'Comparison', 'Application', 'Experiment'], questions: ['Cơ chế hoạt động bên trong thế nào?', 'Trade-offs nào cần cân nhắc?'], contexts: ['Java Backend', 'Production troubleshooting', 'Technical interviews'], problems: practice.map((name) => `Practice: ${name}`), resources: [...resources], children: topics.map(([slug]) => `${id}-${slug}`) }));

export const csFundamentalsNodes = [{ id: 'cs-fundamentals', parentId: null, domain: 'cs', type: 'root', title: 'CS Fundamentals', concepts: ['Operating Systems', 'Computer Networking', 'Database Systems', 'Computer Architecture & JVM', 'Linux & Security'], questions: ['Khái niệm giải quyết vấn đề gì?', 'Cơ chế bên trong hoạt động thế nào?'], contexts: ['Java Backend', 'Production systems', 'Technical interviews'], problems: [], resources: ['https://dev.java/learn/'], children: groups.map(({ id }) => id) }, ...groups, ...groupDefinitions.flatMap(([groupId, , topics, practice, resources]) => topics.map((topic) => createTopic(groupId, topic, practice, resources)))];
