// Problem 1:
// 1. Linear Search (Tìm kiếm Tuyến tính)
function linearSearch(arr, key) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === key) return i;
  }
  return -1;
}

// 2. Binary Search (Tìm kiếm Nhị phân - Yêu cầu mảng SẮP XẾP)
function binarySearch(sortedArr, key) {
  let low = 0;
  let high = sortedArr.length - 1;

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);
    if (sortedArr[mid] === key) return mid;
    if (sortedArr[mid] < key) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

// --- INPUT & OUTPUT MẪU ---
const arr_p1 = [10, 20, 30, 40, 50, 60, 70];
const key_found_p1 = 50;
const key_not_found_p1 = 35;

const linear_res_found = linearSearch(arr_p1, key_found_p1);
const linear_res_not_found = linearSearch(arr_p1, key_not_found_p1);
const binary_res_found = binarySearch(arr_p1, key_found_p1);

console.log(`\n======================================================`);
console.log(`|       PROBLEM 1: LINEAR & BINARY SEARCH              |`);
console.log(`======================================================`);
console.log(`Input Mảng: [${arr_p1.join(", ")}]`);
console.log(`------------------------------------------------------`);
console.log(`Key (50) - Linear Search Index: ${linear_res_found}`); // Output: 4
console.log(`Key (50) - Binary Search Index: ${binary_res_found}`); // Output: 4
console.log(`Key (35) - Linear Search Index: ${linear_res_not_found}`); // Output: -1
console.log(`======================================================`);

// Problem 2:

// Hàm phụ trợ sử dụng Binary Search để tìm ranh giới
function findBoundary(sortedArr, key, findFirst) {
  let low = 0;
  let high = sortedArr.length - 1;
  let result = -1;

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);

    if (sortedArr[mid] === key) {
      result = mid;
      if (findFirst) high = mid - 1; // Tìm kiếm tiếp ở TRÁI
      else low = mid + 1; // Tìm kiếm tiếp ở PHẢI
    } else if (sortedArr[mid] < key) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
}

function findFirstAndLastOccurrence(sortedArr, key) {
  const firstIndex = findBoundary(sortedArr, key, true);
  if (firstIndex === -1) return [-1, -1];
  const lastIndex = findBoundary(sortedArr, key, false);
  return [firstIndex, lastIndex];
}

// --- INPUT & OUTPUT MẪU ---
const sortedArr_p2 = [5, 7, 7, 8, 8, 8, 10, 10];
const key_found_p2 = 8;
const key_not_found_p2 = 6;
const result_found_p2 = findFirstAndLastOccurrence(sortedArr_p2, key_found_p2);
const result_not_found_p2 = findFirstAndLastOccurrence(
  sortedArr_p2,
  key_not_found_p2
);

console.log(`\n======================================================`);
console.log(`|   PROBLEM 2: FIRST AND LAST OCCURRENCE (SORTED)      |`);
console.log(`======================================================`);
console.log(`Input Mảng: [${sortedArr_p2.join(", ")}]`);
console.log(`------------------------------------------------------`);
console.log(
  `Key 8: Output [First Index, Last Index]: [${result_found_p2.join(", ")}]`
); // Output: [3, 5]
console.log(
  `Key 6: Output [First Index, Last Index]: [${result_not_found_p2.join(", ")}]`
); // Output: [-1, -1]
console.log(`======================================================`);

function searchInsertPosition(sortedArr, key) {
  let low = 0;
  let high = sortedArr.length - 1;
  let insertionIndex = sortedArr.length; // Chỉ mục chèn mặc định là cuối mảng

  while (low <= high) {
    let mid = Math.floor(low + (high - low) / 2);

    if (sortedArr[mid] === key) {
      return mid; // Khóa đã được tìm thấy
    } else if (sortedArr[mid] > key) {
      insertionIndex = mid; // Lưu chỉ mục tiềm năng (vị trí chèn)
      high = mid - 1; // Thử tìm vị trí chèn nhỏ hơn (sát về bên trái)
    } else {
      low = mid + 1; // Khóa lớn hơn, tìm kiếm ở bên phải
    }
  }
  return insertionIndex; // Trả về chỉ mục chèn
}

// --- INPUT & OUTPUT MẪU ---
const sortedArr_p3 = [1, 2, 3, 4, 5];
const key_p3_found = 3;
const key_p3_not_found = 2;
const key_p3_end = 7;

const res_found_p3 = searchInsertPosition(sortedArr_p3, key_p3_found);
const res_not_found_p3 = searchInsertPosition(sortedArr_p3, key_p3_not_found);
const res_end_p3 = searchInsertPosition(sortedArr_p3, key_p3_end);

console.log(`\n======================================================`);
console.log(`|      PROBLEM 3: SEARCH INSERT POSITION (SORTED)      |`);
console.log(`======================================================`);
console.log(`Input Mảng: [${sortedArr_p3.join(", ")}]`);
console.log(`------------------------------------------------------`);
console.log(`Key 5 (Found): Index ${res_found_p3}`); // Output: 2
console.log(`Key 2 (Insert): Index ${res_not_found_p3}`); // Output: 1 (Chèn giữa 1 và 3)
console.log(`Key 7 (Insert End): Index ${res_end_p3}`); // Output: 4 (Chèn sau 6)
console.log(`======================================================`);

// Problem 4:
function calculateEmployeeRating(workload) {
  let maxConsecutiveDays = 0;
  let currentConsecutiveDays = 0;

  for (let i = 0; i < workload.length; i++) {
    // Kiểm tra điều kiện: làm việc > 6 giờ
    if (workload[i] > 6) {
      currentConsecutiveDays++;
    } else {
      // Chuỗi ngày liên tiếp bị ngắt (<= 6 giờ)
      currentConsecutiveDays = 0;
    }

    // Cập nhật số ngày liên tiếp tối đa
    if (currentConsecutiveDays > maxConsecutiveDays) {
      maxConsecutiveDays = currentConsecutiveDays;
    }
  }
  return maxConsecutiveDays;
}

// --- INPUT & OUTPUT MẪU ---
const workload_p4 = [2, 3, 7, 8, 7, 6, 3, 8, 12, 11, 12, 10]; // N=12
const rating_p4 = calculateEmployeeRating(workload_p4);

console.log(`\n======================================================`);
console.log(`|               PROBLEM 4: EMPLOYEE RATING             |`);
console.log(`======================================================`);
console.log(`Input Workload (giờ/ngày): [${workload_p4.join(", ")}]`);
console.log(`------------------------------------------------------`);
console.log(`Output (Rating): ${rating_p4}`);
console.log(
  `Giải thích: Chuỗi liên tiếp dài nhất > 6 giờ là [8, 12, 11, 12, 10] => 5 ngày.`
);
console.log(`======================================================`);
