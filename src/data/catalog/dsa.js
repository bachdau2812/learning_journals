import { DSA_BEST_PRACTICES_ID, DSA_GROUP_IDS, DSA_PATTERN_IDS } from './ids';

const bestPractices = {
  understandProblem: ['Xác định input/output.', 'Làm rõ constraints.', 'Hỏi về edge cases.', 'Phân biệt những điều kiện đã biết và những điều cần giả định.'],
  approachSelection: ['Bắt đầu với brute force.', 'Phân tích điểm yếu của brute force.', 'Nhận diện dữ liệu hoặc điều kiện có thể tận dụng.', 'Xác định những pattern khả thi.', 'Chọn giải pháp dựa trên constraints.'],
  correctness: ['Nắm invariant.', 'Biết tại sao thuật toán đúng.', 'Hiểu điều kiện dừng.', 'Kiểm tra corner cases.'],
  complexity: ['Time Complexity.', 'Space Complexity.', 'Worst/Average Case nếu liên quan.', 'Trade-off giữa thời gian và bộ nhớ.'],
  implementation: ['Java Collections.', 'Clean implementation.', 'Boundary handling.', 'Integer overflow.', 'Null/empty input.', 'Tránh off-by-one.'],
  interviewStrategy: ['Think aloud.', 'Clarify before coding.', 'Explain trade-offs.', 'Dry-run.', 'Time management.', 'Xử lý khi bị interviewer đưa hint.'],
  reviewStrategy: ['Rút ra nguyên lý tổng quát.', 'Phân loại lỗi.', 'Ghi lại pattern recognition.', 'Spaced repetition.', 'Mixed practice.', 'Timed mock interviews.'],
};

const groupDefinitions = [
  ['dsa-arrays-strings', 'Arrays & Strings', 'Các pattern trên mảng, chuỗi và bảng tần suất.', ['array-hashing', 'prefix-sum', 'two-pointers', 'sliding-window']],
  ['dsa-searching-linear', 'Searching & Linear Structures', 'Tìm kiếm, danh sách liên kết, stack và heap.', ['stack-monotonic-stack', 'binary-search', 'linked-list', 'heap-priority-queue']],
  ['dsa-trees-recursion', 'Trees & Recursion', 'Đệ quy, cây nhị phân, BST, backtracking và trie.', ['binary-tree-dfs-bfs', 'binary-search-tree', 'backtracking', 'trie']],
  ['dsa-graphs', 'Graphs', 'Duyệt, thứ tự topo, DSU và đồ thị có trọng số.', ['graph-dfs-bfs', 'topological-sort', 'union-find', 'weighted-graphs']],
  ['dsa-optimization', 'Optimization', 'Tối ưu hóa bằng greedy, intervals và dynamic programming.', ['greedy', 'intervals', 'dp-1d', 'dp-2d']],
  ['dsa-additional-patterns', 'Additional Patterns', 'Bit manipulation, ma trận, hình học và các bài toán số.', ['bit-manipulation', 'math-matrix-geometry']],
];

const problemDefinitions = {
  'array-hashing': [['1', 'Two Sum', 'two-sum', 'Easy'], ['217', 'Contains Duplicate', 'contains-duplicate', 'Easy'], ['242', 'Valid Anagram', 'valid-anagram', 'Easy'], ['49', 'Group Anagrams', 'group-anagrams', 'Medium']],
  'prefix-sum': [['1480', 'Running Sum of 1D Array', 'running-sum-of-1d-array', 'Easy'], ['303', 'Range Sum Query - Immutable', 'range-sum-query-immutable', 'Easy'], ['560', 'Subarray Sum Equals K', 'subarray-sum-equals-k', 'Medium'], ['525', 'Contiguous Array', 'contiguous-array', 'Medium']],
  'two-pointers': [['125', 'Valid Palindrome', 'valid-palindrome', 'Easy'], ['167', 'Two Sum II', 'two-sum-ii-input-array-is-sorted', 'Medium'], ['15', '3Sum', '3sum', 'Medium'], ['11', 'Container With Most Water', 'container-with-most-water', 'Medium']],
  'sliding-window': [['643', 'Maximum Average Subarray I', 'maximum-average-subarray-i', 'Easy'], ['3', 'Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'Medium'], ['424', 'Longest Repeating Character Replacement', 'longest-repeating-character-replacement', 'Medium'], ['76', 'Minimum Window Substring', 'minimum-window-substring', 'Hard']],
  'stack-monotonic-stack': [['20', 'Valid Parentheses', 'valid-parentheses', 'Easy'], ['155', 'Min Stack', 'min-stack', 'Medium'], ['739', 'Daily Temperatures', 'daily-temperatures', 'Medium'], ['84', 'Largest Rectangle in Histogram', 'largest-rectangle-in-histogram', 'Hard']],
  'binary-search': [['704', 'Binary Search', 'binary-search', 'Easy'], ['35', 'Search Insert Position', 'search-insert-position', 'Easy'], ['33', 'Search in Rotated Sorted Array', 'search-in-rotated-sorted-array', 'Medium'], ['875', 'Koko Eating Bananas', 'koko-eating-bananas', 'Medium']],
  'linked-list': [['206', 'Reverse Linked List', 'reverse-linked-list', 'Easy'], ['141', 'Linked List Cycle', 'linked-list-cycle', 'Easy'], ['19', 'Remove Nth Node From End', 'remove-nth-node-from-end-of-list', 'Medium'], ['143', 'Reorder List', 'reorder-list', 'Medium']],
  'heap-priority-queue': [['215', 'Kth Largest Element', 'kth-largest-element-in-an-array', 'Medium'], ['347', 'Top K Frequent Elements', 'top-k-frequent-elements', 'Medium'], ['973', 'K Closest Points', 'k-closest-points-to-origin', 'Medium'], ['295', 'Find Median From Data Stream', 'find-median-from-data-stream', 'Hard']],
  'binary-tree-dfs-bfs': [['104', 'Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree', 'Easy'], ['226', 'Invert Binary Tree', 'invert-binary-tree', 'Easy'], ['102', 'Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal', 'Medium'], ['543', 'Diameter of Binary Tree', 'diameter-of-binary-tree', 'Easy']],
  'binary-search-tree': [['98', 'Validate Binary Search Tree', 'validate-binary-search-tree', 'Medium'], ['230', 'Kth Smallest Element in BST', 'kth-smallest-element-in-a-bst', 'Medium'], ['235', 'Lowest Common Ancestor of BST', 'lowest-common-ancestor-of-a-binary-search-tree', 'Medium'], ['701', 'Insert into BST', 'insert-into-a-binary-search-tree', 'Medium']],
  backtracking: [['78', 'Subsets', 'subsets', 'Medium'], ['46', 'Permutations', 'permutations', 'Medium'], ['39', 'Combination Sum', 'combination-sum', 'Medium'], ['79', 'Word Search', 'word-search', 'Medium']],
  trie: [['208', 'Implement Trie', 'implement-trie-prefix-tree', 'Medium'], ['211', 'Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure', 'Medium'], ['648', 'Replace Words', 'replace-words', 'Medium'], ['212', 'Word Search II', 'word-search-ii', 'Hard']],
  'graph-dfs-bfs': [['200', 'Number of Islands', 'number-of-islands', 'Medium'], ['133', 'Clone Graph', 'clone-graph', 'Medium'], ['994', 'Rotting Oranges', 'rotting-oranges', 'Medium'], ['417', 'Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow', 'Medium']],
  'topological-sort': [['207', 'Course Schedule', 'course-schedule', 'Medium'], ['210', 'Course Schedule II', 'course-schedule-ii', 'Medium'], ['802', 'Find Eventual Safe States', 'find-eventual-safe-states', 'Medium'], ['2115', 'Find All Possible Recipes', 'find-all-possible-recipes-from-given-supplies', 'Medium']],
  'union-find': [['547', 'Number of Provinces', 'number-of-provinces', 'Medium'], ['684', 'Redundant Connection', 'redundant-connection', 'Medium'], ['1319', 'Make Network Connected', 'number-of-operations-to-make-network-connected', 'Medium'], ['721', 'Accounts Merge', 'accounts-merge', 'Medium']],
  'weighted-graphs': [['743', 'Network Delay Time', 'network-delay-time', 'Medium'], ['1631', 'Path With Minimum Effort', 'path-with-minimum-effort', 'Medium'], ['787', 'Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops', 'Medium'], ['1584', 'Min Cost to Connect All Points', 'min-cost-to-connect-all-points', 'Medium']],
  greedy: [['55', 'Jump Game', 'jump-game', 'Medium'], ['45', 'Jump Game II', 'jump-game-ii', 'Medium'], ['134', 'Gas Station', 'gas-station', 'Medium'], ['763', 'Partition Labels', 'partition-labels', 'Medium']],
  intervals: [['56', 'Merge Intervals', 'merge-intervals', 'Medium'], ['57', 'Insert Interval', 'insert-interval', 'Medium'], ['435', 'Non-overlapping Intervals', 'non-overlapping-intervals', 'Medium'], ['452', 'Minimum Number of Arrows', 'minimum-number-of-arrows-to-burst-balloons', 'Medium']],
  'dp-1d': [['70', 'Climbing Stairs', 'climbing-stairs', 'Easy'], ['198', 'House Robber', 'house-robber', 'Medium'], ['213', 'House Robber II', 'house-robber-ii', 'Medium'], ['322', 'Coin Change', 'coin-change', 'Medium']],
  'dp-2d': [['62', 'Unique Paths', 'unique-paths', 'Medium'], ['64', 'Minimum Path Sum', 'minimum-path-sum', 'Medium'], ['1143', 'Longest Common Subsequence', 'longest-common-subsequence', 'Medium'], ['72', 'Edit Distance', 'edit-distance', 'Medium']],
  'bit-manipulation': [['136', 'Single Number', 'single-number', 'Easy'], ['191', 'Number of 1 Bits', 'number-of-1-bits', 'Easy'], ['338', 'Counting Bits', 'counting-bits', 'Easy'], ['268', 'Missing Number', 'missing-number', 'Easy']],
  'math-matrix-geometry': [['48', 'Rotate Image', 'rotate-image', 'Medium'], ['54', 'Spiral Matrix', 'spiral-matrix', 'Medium'], ['73', 'Set Matrix Zeroes', 'set-matrix-zeroes', 'Medium'], ['202', 'Happy Number', 'happy-number', 'Easy']],
};

const patternDetails = {
  'array-hashing': ['Dùng hash map/set để tra cứu và gom nhóm dữ liệu mảng trong một lượt.', ['complement lookup', 'frequency map', 'canonical key'], ['Khi cần tra cứu phần tử hoặc tần suất trong mảng.', 'Khi kết quả phụ thuộc vào phần tử đã thấy.']],
  'prefix-sum': ['Tiền xử lý tổng tích lũy để trả lời tổng đoạn và nhận diện subarray nhanh.', ['prefix array', 'prefix frequency map', 'difference of prefixes'], ['Nhiều truy vấn tổng đoạn.', 'Subarray có tổng hoặc chênh lệch mục tiêu.']],
  'two-pointers': ['Hai chỉ số di chuyển có chủ đích trên dữ liệu đã sắp xếp hoặc hai đầu chuỗi.', ['left/right pointers', 'sort then scan', 'slow/fast pointers'], ['Mảng đã sắp xếp hoặc có thể sắp xếp.', 'Cần tìm cặp, bộ ba hoặc đoạn đối xứng.']],
  'sliding-window': ['Duy trì một cửa sổ liên tiếp và cập nhật trạng thái khi mở rộng hoặc thu hẹp.', ['fixed window', 'variable window', 'frequency counter'], ['Bài toán trên substring/subarray liên tiếp.', 'Có điều kiện hợp lệ thay đổi theo phạm vi.']],
  'stack-monotonic-stack': ['Stack lưu thứ tự ứng viên để xử lý ngoặc, trạng thái lồng nhau và phần tử lớn hơn kế tiếp.', ['LIFO stack', 'monotonic increasing/decreasing stack', 'next greater element'], ['Cần kết hợp phần tử gần nhất.', 'Cần xử lý thứ tự lồng nhau hoặc histogram.']],
  'binary-search': ['Chia đôi miền tìm kiếm khi predicate thay đổi đơn điệu.', ['lower/upper bound', 'search on answer', 'rotated array partition'], ['Dữ liệu đã sắp xếp hoặc đáp án có tính đơn điệu.', 'Mỗi bước loại bỏ được một nửa miền.']],
  'linked-list': ['Điều hướng node bằng con trỏ và thay đổi liên kết tại chỗ.', ['dummy node', 'fast/slow pointers', 'in-place reversal'], ['Cần chèn, xóa hoặc đảo liên kết.', 'Không có random access và cần giữ O(1) space.']],
  'heap-priority-queue': ['Heap giữ phần tử ưu tiên nhất ở đỉnh để chọn hoặc hợp nhất luồng dữ liệu.', ['min/max heap', 'top K', 'two heaps'], ['Cần lấy min/max lặp lại.', 'Dữ liệu đến liên tục hoặc chỉ cần top K.']],
  'binary-tree-dfs-bfs': ['Duyệt cây theo chiều sâu hoặc chiều rộng, giữ invariant theo subtree hoặc level.', ['pre/in/post-order DFS', 'level-order BFS', 'recursive return state'], ['Câu hỏi về subtree hoặc đường đi.', 'Cần xử lý theo từng level.']],
  'binary-search-tree': ['Khai thác thứ tự trái < node < phải của cây tìm kiếm nhị phân.', ['in-order traversal', 'range bounds', 'successor/predecessor'], ['Cần kiểm tra hoặc truy vấn thứ tự trong BST.', 'Cần tìm ancestor và phần tử hạng k.']],
  backtracking: ['Thử lựa chọn, đệ quy, rồi hoàn tác để khám phá không gian nghiệm.', ['choose/explore/unchoose', 'pruning', 'path state'], ['Tìm tất cả subset, permutation, combination.', 'Không gian nghiệm cần cắt nhánh.']],
  trie: ['Cây tiền tố lưu chuỗi theo từng ký tự để tìm prefix nhanh.', ['prefix paths', 'terminal marker', 'DFS with trie'], ['Nhiều truy vấn prefix.', 'Từ điển và tìm kiếm từ trên lưới.']],
  'graph-dfs-bfs': ['Duyệt đỉnh/cạnh để tìm thành phần liên thông, khoảng cách và lan truyền trạng thái.', ['visited set', 'queue BFS', 'recursive/iterative DFS'], ['Mạng, lưới, quan hệ hoặc component.', 'Khoảng cách ngắn nhất trên cạnh không trọng số.']],
  'topological-sort': ['Sắp xếp các đỉnh có quan hệ phụ thuộc và phát hiện chu trình.', ['indegree/Kahn', 'DFS colors', 'dependency graph'], ['Task có prerequisite.', 'Cần thứ tự hợp lệ hoặc kiểm tra dependency cycle.']],
  'union-find': ['DSU hợp nhất các component và truy vấn cùng tập với path compression.', ['parent/rank', 'path compression', 'component count'], ['Cạnh được thêm dần.', 'Cần kết nối component hoặc phát hiện chu trình.']],
  'weighted-graphs': ['Tối ưu đường đi hoặc cây khung khi cạnh có trọng số.', ['Dijkstra', 'Bellman-Ford style relaxation', 'MST/Kruskal'], ['Mỗi cạnh có chi phí/thời gian.', 'Tìm đường rẻ nhất hoặc kết nối toàn mạng.']],
  greedy: ['Mỗi bước chọn phương án cục bộ tốt nhất và chứng minh lựa chọn không làm mất nghiệm tối ưu.', ['exchange argument', 'reachability frontier', 'sort by key'], ['Quyết định có thể cam kết sau khi sắp xếp.', 'Một lựa chọn mở rộng frontier tốt nhất.']],
  intervals: ['Sắp xếp các đoạn theo đầu/cuối rồi quét để gộp hoặc chọn không giao nhau.', ['sort by start/end', 'merge overlap', 'interval scheduling'], ['Dữ liệu là các khoảng thời gian.', 'Cần gộp, chèn hoặc chọn số đoạn tối đa.']],
  'dp-1d': ['Xây dựng trạng thái một chiều từ các trạng thái nhỏ hơn và lưu kết quả con.', ['state transition', 'rolling memory', 'base cases'], ['Trạng thái phụ thuộc vào vài vị trí trước.', 'Tối ưu số cách, chi phí hoặc lợi ích trên dãy.']],
  'dp-2d': ['Lập bảng trạng thái hai chiều cho lưới hoặc hai chuỗi.', ['grid transitions', 'sequence alignment', 'table initialization'], ['Hai chiều độc lập hoặc hai chuỗi cần so sánh.', 'Trạng thái tại ô phụ thuộc hàng/cột trước.']],
  'bit-manipulation': ['Dùng biểu diễn nhị phân và phép bit để mã hóa trạng thái hoặc tính toán hằng số.', ['XOR cancellation', 'bit masks', 'shift/count bits'], ['Tập trạng thái nhỏ hoặc cần O(1) extra space.', 'Các phần tử xuất hiện theo parity.']],
  'math-matrix-geometry': ['Kết hợp biến đổi ma trận, mô phỏng hướng và tính chất số học.', ['transpose/reflect', 'spiral boundaries', 'digit/sum invariants'], ['Thao tác trên ma trận vuông hoặc hình học.', 'Cần tránh tạo ma trận phụ.']],
};

const groupByPattern = Object.fromEntries(groupDefinitions.flatMap(([groupId, , , patterns]) => patterns.map((id) => [id, groupId])));
const patternOrder = Object.fromEntries(DSA_PATTERN_IDS.map((id, index) => [id, index]));

function createProblem(patternId, [leetcodeId, title, slug, difficulty]) {
  const problemId = `dsa-problem-${leetcodeId}`;
  return {
    id: problemId,
    parentId: patternId,
    domain: 'dsa',
    type: 'problem',
    title,
    description: `${title} — bài luyện tập cho pattern ${patternId}.`,
    concepts: [],
    questions: [],
    contexts: [],
    problems: [],
    resources: [`https://leetcode.com/problems/${slug}/`],
    children: [],
    leetcodeId,
    url: `https://leetcode.com/problems/${slug}/`,
    difficulty,
    patterns: [patternId],
    source: 'leetcode',
    isCustom: false,
  };
}

const problemNodes = DSA_PATTERN_IDS.flatMap((patternId) => problemDefinitions[patternId].map((definition) => createProblem(patternId, definition)));

const patternNodes = DSA_PATTERN_IDS.map((id) => {
  const [description, concepts, signals] = patternDetails[id];
  const problems = problemNodes.filter((problem) => problem.parentId === id);
  return {
    id,
    parentId: groupByPattern[id],
    domain: 'dsa',
    type: 'pattern',
    title: {
      'array-hashing': 'Array & Hashing',
      'stack-monotonic-stack': 'Stack & Monotonic Stack',
      'heap-priority-queue': 'Heap / Priority Queue',
      'binary-tree-dfs-bfs': 'Binary Tree DFS/BFS',
      'graph-dfs-bfs': 'Graph DFS/BFS',
      'union-find': 'Union Find / DSU',
      'weighted-graphs': 'Weighted Graphs',
      'dp-1d': '1D Dynamic Programming',
      'dp-2d': '2D Dynamic Programming',
      'math-matrix-geometry': 'Math, Matrix & Geometry',
    }[id] ?? id.replace(/\b\w/g, (character) => character.toUpperCase()).replaceAll('-', ' '),
    description,
    concepts,
    questions: [
      `Nhận diện tín hiệu của pattern ${id} là gì?`,
      'Invariant nào cần giữ trong từng bước?',
      'Độ phức tạp thời gian và bộ nhớ thay đổi thế nào?',
    ],
    contexts: signals,
    problems: problems.map((problem) => problem.id),
    resources: [
      `https://neetcode.io/roadmap`,
      `https://cp-algorithms.com/`,
    ],
    children: problems.map((problem) => problem.id),
  };
});

const groupNodes = groupDefinitions.map(([id, title, description, children]) => ({
  id,
  parentId: 'dsa',
  domain: 'dsa',
  type: 'group',
  title,
  description,
  concepts: ['Overview', 'Recognition signals', 'Core techniques', 'Important invariants', 'Common mistakes', 'Complexity considerations'],
  questions: ['Pattern nào phù hợp với constraints?', 'Edge cases nào cần kiểm tra?'],
  contexts: ['SWE coding interviews và các bài toán thực tế có dữ liệu biến đổi.'],
  problems: [],
  resources: ['https://neetcode.io/roadmap'],
  children,
}));

const bestPracticesNode = {
  id: DSA_BEST_PRACTICES_ID,
  parentId: 'dsa',
  domain: 'dsa',
  type: 'best-practices',
  title: 'Best Practices',
  description: 'Checklist và câu hỏi phát triển tư duy khi giải bài DSA trong phỏng vấn.',
  concepts: Object.keys(bestPractices),
  questions: Object.values(bestPractices).flat(),
  contexts: ['SWE coding interviews', 'Timed mock interviews', 'Spaced repetition và mixed practice'],
  problems: [],
  resources: ['https://neetcode.io/roadmap', 'https://cp-algorithms.com/'],
  children: [],
  bestPractices,
};

export const dsaNodes = [
  {
    id: 'dsa',
    parentId: null,
    domain: 'dsa',
    type: 'root',
    title: 'Data Structures & Algorithms',
    description: 'DSA gồm Best Practices, Learning Roadmap và Problem Journal; roadmap chia theo pattern và nhóm thuật toán.',
    concepts: Object.values(bestPractices).flat(),
    questions: ['Đã xác định input/output và constraints chưa?', 'Invariant và điều kiện dừng là gì?', 'Đã phân tích time/space complexity chưa?'],
    contexts: ['SWE coding interviews', 'Timed mock interviews', 'Spaced repetition và mixed practice'],
    problems: [],
    resources: ['https://neetcode.io/roadmap', 'https://cp-algorithms.com/'],
    children: [...DSA_GROUP_IDS, DSA_BEST_PRACTICES_ID],
  },
  bestPracticesNode,
  ...groupNodes,
  ...patternNodes,
  ...problemNodes,
];

export { bestPractices };
