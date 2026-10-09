// The seven stages follow the DSA Best Practices section in interview_learning_journal.txt.
// A single Two Sum scenario connects the examples across the interview workflow.
export const dsaBestPracticeGuides = [
  {
    id: 'understand-problem',
    title: 'Hiểu đúng đề bài',
    summary: 'Chốt yêu cầu trước khi chọn thuật toán.',
    steps: [
      'Nhắc lại input, output và điều kiện trả kết quả bằng lời của bạn.',
      'Hỏi rõ kích thước dữ liệu, miền giá trị, thứ tự và khả năng có phần tử trùng.',
      'Làm rõ trường hợp rỗng, không có nghiệm, nhiều nghiệm và điều được phép giả định.',
      'Viết một ví dụ nhỏ cùng kết quả mong đợi để xác nhận cách hiểu.',
    ],
    example: 'Two Sum: cần trả về chỉ số hay giá trị? Có đúng một cặp nghiệm không? Một phần tử có được dùng hai lần không?',
  },
  {
    id: 'choose-approach',
    title: 'Chọn hướng giải',
    summary: 'Đi từ cách đơn giản tới phương án hợp constraints.',
    steps: [
      'Nêu brute force và độ phức tạp để có mốc so sánh.',
      'Tìm cấu trúc có thể tận dụng: dữ liệu đã sắp xếp, tra cứu nhanh, cửa sổ liên tiếp hoặc tính đơn điệu.',
      'So sánh các pattern khả thi bằng thời gian, bộ nhớ và điều kiện áp dụng.',
      'Chốt thuật toán, cấu trúc dữ liệu và lý do chọn trước khi viết mã.',
    ],
    example: 'Two Sum chưa sắp xếp: thử mọi cặp O(n²); hash map tìm phần bù trong O(n) thời gian kỳ vọng, dùng O(n) bộ nhớ.',
  },
  {
    id: 'prove-correctness',
    title: 'Giải thích tính đúng',
    summary: 'Nói rõ điều gì luôn đúng sau mỗi bước.',
    steps: [
      'Phát biểu invariant của vòng lặp hoặc trạng thái đệ quy.',
      'Giải thích khởi tạo, mỗi bước duy trì invariant và điều kiện dừng.',
      'Chỉ ra vì sao không bỏ sót nghiệm và không trả về nghiệm sai.',
      'Dùng một trường hợp biên để thử lại lập luận.',
    ],
    example: 'Two Sum: trước khi xét vị trí i, map chỉ chứa các phần tử ở vị trí nhỏ hơn i; vì vậy một chỉ số không bị dùng hai lần.',
  },
  {
    id: 'analyze-complexity',
    title: 'Phân tích độ phức tạp',
    summary: 'Tính theo thao tác thực tế và nêu rõ giả định.',
    steps: [
      'Xác định n và số lần chạy của vòng lặp, truy vấn hoặc lời gọi đệ quy.',
      'Tính time complexity cho trường hợp cần thiết; nêu rõ khi dùng độ phức tạp kỳ vọng.',
      'Tính extra space, gồm cấu trúc phụ và stack đệ quy; không cộng input nếu đề không yêu cầu.',
      'Giải thích đánh đổi thời gian và bộ nhớ giữa các phương án.',
    ],
    example: 'Hash map trong Two Sum có O(n) thời gian kỳ vọng và O(n) bộ nhớ phụ; brute force dùng O(1) bộ nhớ phụ nhưng O(n²) thời gian.',
  },
  {
    id: 'implement-safely',
    title: 'Viết mã chắc chắn',
    summary: 'Biến ý tưởng thành code dễ đọc và xử lý đủ biên.',
    steps: [
      'Chọn collection phù hợp và đặt tên biến thể hiện vai trò.',
      'Xử lý mảng rỗng, null nếu hợp đồng hàm cho phép, chỉ số và điều kiện dừng.',
      'Kiểm tra off-by-one, kiểu số và nguy cơ tràn số theo constraints.',
      'Viết từng nhánh ngắn gọn; tránh tối ưu khiến invariant khó nhìn thấy.',
    ],
    example: 'Two Sum: kiểm tra phần bù trong map trước khi lưu phần tử hiện tại; nếu target − value có thể tràn int trong Java, dùng long theo constraints.',
  },
  {
    id: 'communicate-in-interview',
    title: 'Trao đổi trong phỏng vấn',
    summary: 'Cho interviewer theo dõi quyết định của bạn.',
    steps: [
      'Hỏi điều còn mơ hồ, sau đó tóm tắt hướng giải trước khi code.',
      'Nói thành tiếng invariant, trade-off và điểm bạn đang kiểm tra.',
      'Dry-run với ví dụ thường và edge case trước khi kết luận.',
      'Khi nhận hint, xác nhận ý hiểu rồi điều chỉnh; dành thời gian cuối để kiểm tra mã.',
    ],
    example: 'Có thể nói: “Em bắt đầu với O(n²), nhưng giới hạn n lớn nên em dùng map để tra phần bù khi duyệt một lần.”',
  },
  {
    id: 'review-and-retain',
    title: 'Ôn tập sau bài',
    summary: 'Biến mỗi lần giải thành kinh nghiệm tái sử dụng.',
    steps: [
      'Ghi pattern, tín hiệu nhận diện và invariant bằng lời của bạn.',
      'Phân loại lỗi: hiểu đề, chọn hướng, chứng minh, cài đặt hay giao tiếp.',
      'Ôn lại bằng spaced repetition và trộn các pattern để tránh nhận diện theo thứ tự bài.',
      'Luyện mock interview có giới hạn thời gian; giải lại mà không xem lời giải.',
    ],
    example: 'Sau Two Sum, ghi lại tín hiệu “tìm phần bù trong một lượt”, rồi luyện thêm bài hash map xen với two pointers và prefix sum.',
  },
];
