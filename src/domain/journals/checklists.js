const question = (questionId, text) => ({ questionId, text });

export const DSA_CHECKLIST = [
  ['recognition', 'What signals reveal the pattern and when does it apply?'],
  ['core-idea', 'What is the brute force approach and the optimized idea? Why is it better?'],
  ['correctness', 'What invariant or proof explains why the algorithm is correct?'],
  ['complexity', 'What are the time and space costs? Can either be improved?'],
  ['edge-cases', 'Which boundary cases need explicit tests?'],
  ['mistakes', 'What went wrong, what was the root cause, and how will you improve?'],
  ['transfer', 'Which other problems can reuse this knowledge?'],
].map(([id, text]) => question(`dsa.${id}`, text));

export const LLD_KNOWLEDGE_CHECKLIST = [
  'What problem does this knowledge solve in code?',
  'How do the mechanism and class or interface responsibilities work?',
  'When should and should not this be applied?',
  'What alternative solutions exist?',
  'How does it affect coupling, cohesion, extensibility, and testability?',
  'What anti-patterns or common mistakes occur?',
  'How would you relate it to Java or Spring Boot?',
].map((text, index) => question(`system-design.lld.knowledge.${index + 1}`, text));

export const LLD_PRACTICE_CHECKLIST = [
  'Did you identify requirements, use cases, constraints, and edge cases?',
  'Did you design classes, interfaces, and responsibilities?',
  'Did you choose suitable patterns and principles?',
  'Did you describe control flow, state transitions, and invariants?',
  'Did you implement or prototype the design?',
  'Did you test happy paths, edge cases, and failures?',
  'Did you evaluate maintainability, extensibility, and testability?',
  'How would the design change when the interviewer adds a feature?',
].map((text, index) => question(`system-design.lld.practice.${index + 1}`, text));

export const HLD_KNOWLEDGE_CHECKLIST = [
  'What problem does this solution or component solve?',
  'How does it work and how does data flow?',
  'Which traffic, latency, consistency, and availability conditions fit?',
  'What are the important bottlenecks?',
  'What happens during scale or dependency failure?',
  'What alternative designs and trade-offs exist?',
  'Which real-world case would use this?',
].map((text, index) => question(`system-design.hld.knowledge.${index + 1}`, text));

export const HLD_PRACTICE_CHECKLIST = [
  'Did you clarify requirements, NFRs, and assumptions?',
  'Did you estimate capacity, throughput, and storage?',
  'Did you design APIs, the data model, and request flows?',
  'Did you design the architecture and component responsibilities?',
  'Did you identify bottlenecks and a scaling strategy?',
  'Did you evaluate consistency, security, and failure scenarios?',
  'Did you compare solutions and trade-offs?',
  'Did you prototype or validate important assumptions when useful?',
  'How would the design change if requirements or traffic changed?',
].map((text, index) => question(`system-design.hld.practice.${index + 1}`, text));

export const DISTRIBUTED_KNOWLEDGE_CHECKLIST = [
  'What concurrency, consistency, or reliability problem exists?',
  'What are the assumptions and guarantees?',
  'How does the system work normally?',
  'What happens on timeout, duplicate, crash, or partition?',
  'Which data invariants must be protected?',
  'How is correctness guaranteed?',
  'Which metrics or tests verify the design?',
  'What are the trade-offs and limits?',
].map((text, index) => question(`system-design.distributed.knowledge.${index + 1}`, text));

export const DISTRIBUTED_PRACTICE_CHECKLIST = [
  'Did you identify the failure scenario and expected behavior?',
  'Did you identify invariants and guarantees?',
  'Did you design retry, idempotency, ordering, or recovery?',
  'Did you reproduce the failure?',
  'Did you implement or simulate the solution?',
  'Did you verify correctness with assertions, logs, or data?',
  'Did you measure performance or recovery when useful?',
  'Did you compare before and after?',
  'Can you explain the design if the failure scenario changes?',
].map((text, index) => question(`system-design.distributed.practice.${index + 1}`, text));

export const CS_KNOWLEDGE_CHECKLIST = [
  'What problem does this concept solve?',
  'How does the mechanism work internally?',
  'What are its assumptions or guarantees?',
  'How does it compare with similar mechanisms and what are the trade-offs?',
  'How is it used in backend or production systems?',
  'What common failures occur and how do you debug them?',
  'Can you explain it with an interview example?',
].map((text, index) => question(`cs.knowledge.${index + 1}`, text));

export const CS_LAB_CHECKLIST = [
  'What is the experiment goal?',
  'Which theory is relevant?',
  'What result do you predict before the experiment?',
  'What environment, configuration, inputs, and tools are used?',
  'What steps did you run and can they be reproduced?',
  'What are the actual results, logs, and metrics?',
  'Where did the result differ from the prediction and why?',
  'Did you test edge cases or change inputs?',
  'What lesson applies to production or interviews?',
].map((text, index) => question(`cs.lab.${index + 1}`, text));

export const CHECKLISTS = Object.freeze({
  dsa: DSA_CHECKLIST,
  'system-design-lld-study': LLD_KNOWLEDGE_CHECKLIST,
  'system-design-lld-practice': LLD_PRACTICE_CHECKLIST,
  'system-design-lld-review': LLD_KNOWLEDGE_CHECKLIST,
  'system-design-hld-study': HLD_KNOWLEDGE_CHECKLIST,
  'system-design-hld-practice': HLD_PRACTICE_CHECKLIST,
  'system-design-hld-review': HLD_KNOWLEDGE_CHECKLIST,
  'system-design-distributed-study': DISTRIBUTED_KNOWLEDGE_CHECKLIST,
  'system-design-distributed-practice': DISTRIBUTED_PRACTICE_CHECKLIST,
  'system-design-distributed-review': DISTRIBUTED_KNOWLEDGE_CHECKLIST,
  'cs-knowledge': CS_KNOWLEDGE_CHECKLIST,
  'cs-lab': CS_LAB_CHECKLIST,
  others: [],
});
