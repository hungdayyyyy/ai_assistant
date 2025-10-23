// Problem 1
class Stack {
  constructor() {
    this.items = [];
  }

  size() {
    return this.items.length;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  push(x) {
    this.items.push(x);
  }

  pop() {
    if (this.isEmpty()) {
      console.warn("Lỗi: Stack rỗng, không thể pop.");
      return undefined;
    }
    return this.items.pop();
  }

  top() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.items.length - 1];
  }
}

const stack = new Stack();

console.log("\n--- Problem 1 (Stack Implementation) ---");
console.log("Stack ban đầu có rỗng không?", stack.isEmpty());
console.log("Kích thước stack:", stack.size());

stack.push(10);
stack.push(20);
stack.push(30);

console.log("Sau 3 lần push (10, 20, 30):", stack.items);
console.log("Phần tử ở đỉnh (top):", stack.top());
console.log("Kích thước stack:", stack.size());

console.log("Thực hiện pop:", stack.pop());
console.log("Phần tử ở đỉnh mới:", stack.top());
console.log("Stack sau khi pop:", stack.items);

console.log("Stack hiện tại có rỗng không?", stack.isEmpty());

// Problem 2:

class Queue {
  constructor() {
    this.items = {}; // Dùng Object (Map) hoặc mảng với index là số nguyên để tránh re-indexing
    this.headIndex = 0; // Con trỏ đến phần tử đầu tiên (front)
    this.tailIndex = 0; // Con trỏ đến vị trí tiếp theo để thêm vào (end)
  }

  size() {
    return this.tailIndex - this.headIndex;
  }

  isEmpty() {
    return this.size() === 0;
  }

  push(element) {
    this.items[this.tailIndex] = element;
    this.tailIndex++;
  }

  pop() {
    if (this.isEmpty()) {
      console.warn("Lỗi: Queue rỗng, không thể pop.");
      return undefined;
    }

    const element = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;

    if (this.headIndex === this.tailIndex) {
      this.headIndex = 0;
      this.tailIndex = 0;
    }

    return element;
  }

  front() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.headIndex];
  }

  back() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.tailIndex - 1];
  }
}

const queue = new Queue();

console.log("\n--- Problem 2 (Queue Implementation) ---");
console.log("Queue ban đầu có rỗng không?", queue.isEmpty());
console.log("Kích thước queue:", queue.size());

queue.push(100);
queue.push(200);
queue.push(300);

console.log(
  "Sau 3 lần push (100, 200, 300). Front:",
  queue.front(),
  ", Back:",
  queue.back()
);
console.log("Kích thước queue:", queue.size());

console.log("Thực hiện pop (Dequeue):", queue.pop());
console.log("Front mới:", queue.front());
console.log("Back mới:", queue.back());

console.log("Thực hiện pop (Dequeue):", queue.pop());
console.log("Kích thước queue:", queue.size());

queue.push(400);

console.log("Sau khi push 400. Front:", queue.front(), ", Back:", queue.back());

/**
 * Problem 3: Rotting Apples (Táo Thối Rữa)
 * Tìm số ngày tối thiểu cần thiết để tất cả táo tươi (1) trở nên thối rữa (2).
 * Sử dụng thuật toán Breadth-First Search (BFS) để mô phỏng sự lan truyền từng ngày.
 *
 * Cell Value:
 * 0: Empty Cell (Ô trống)
 * 1: Fresh Apple (Táo tươi)
 * 2: Rotten Apple (Táo thối)
 *
 * @param {number[][]} grid Lưới n x m chứa giá trị 0, 1, 2.
 * @returns {number} Số ngày tối thiểu, hoặc -1 nếu không thể thối rữa hết.
 */
function solveRottingApples(grid) {
  const R = grid.length;
  const C = grid[0].length;

  // Khởi tạo hàng đợi (Queue) cho BFS và đếm số táo tươi ban đầu
  let queue = [];
  let freshApples = 0;

  // 1. Quét lưới để tìm tất cả táo thối ban đầu và đếm táo tươi
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (grid[r][c] === 2) {
        // Thêm táo thối ban đầu vào hàng đợi (Queue)
        queue.push([r, c]);
      } else if (grid[r][c] === 1) {
        // Đếm tổng số táo tươi
        freshApples++;
      }
    }
  }

  // Nếu không có táo tươi nào, trả về 0 ngày (hoàn thành)
  if (freshApples === 0) {
    return 0;
  }

  // Các hướng di chuyển (Trên, Dưới, Trái, Phải)
  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];
  let days = 0;

  // 2. Bắt đầu quá trình thối rữa (BFS)
  // Lặp cho đến khi Queue rỗng (tức là không còn táo thối nào để lây lan)
  while (queue.length > 0) {
    // Lấy kích thước của Queue hiện tại. Đây là số táo sẽ lây lan rot trong NGÀY NÀY.
    let size = queue.length;
    // Biến cờ kiểm tra xem có táo nào bị thối rữa trong chu kỳ này không
    let newlyRotten = false;

    for (let i = 0; i < size; i++) {
      // Lấy ra phần tử đầu tiên (FIFO)
      const [r, c] = queue.shift();

      // Kiểm tra 4 hàng xóm
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;

        // Kiểm tra điều kiện biên và trạng thái táo
        if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 1) {
          // A. Táo tươi này bị thối rữa
          grid[nr][nc] = 2;

          // B. Giảm số lượng táo tươi cần thối
          freshApples--;

          // C. Thêm táo mới thối này vào Queue để lây lan vào ngày tiếp theo
          queue.push([nr, nc]);

          // Đánh dấu rằng sự thối rữa đã xảy ra trong ngày này
          newlyRotten = true;
        }
      }
    }

    // 3. Tăng số ngày nếu có sự thối rữa mới xảy ra
    // Chúng ta chỉ tăng ngày nếu có ít nhất một quả táo bị thối trong chu kỳ vừa rồi
    if (newlyRotten) {
      days++;
    }
  }

  // 4. Kiểm tra cuối cùng
  // Nếu freshApples == 0, tất cả đều đã thối, trả về số ngày.
  // Nếu freshApples > 0, một số táo không thể tiếp cận, trả về -1.
  return freshApples === 0 ? days : -1;
}

// --- Ví dụ thử nghiệm ---

// Ví dụ 1 (Từ hình ảnh): 4 ngày
const grid1 = [
  [2, 1, 0],
  [1, 1, 0],
  [0, 1, 1],
];

// Ví dụ 2 (Từ hình ảnh): 4 ngày
const grid2 = [
  [2, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
];

// Ví dụ 3: Không thể thối rữa (táo bị cô lập) -> -1
const grid3 = [
  [2, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

// Ví dụ 4: Tất cả đều thối hoặc trống -> 0 ngày
const grid4 = [
  [2, 0, 2],
  [0, 0, 0],
  [2, 0, 2],
];

console.log("--- Kết quả Rotting Apples (BFS) ---");
console.log(
  `Grid 1 (${JSON.stringify(grid1)}): ${solveRottingApples(
    grid1
  )} (Expected: 4)`
);
console.log(
  `Grid 2 (${JSON.stringify(grid2)}): ${solveRottingApples(
    grid2
  )} (Expected: 4)`
);
console.log(
  `Grid 3 (${JSON.stringify(grid3)}): ${solveRottingApples(
    grid3
  )} (Expected: -1)`
);
console.log(
  `Grid 4 (${JSON.stringify(grid4)}): ${solveRottingApples(
    grid4
  )} (Expected: 0)`
);
