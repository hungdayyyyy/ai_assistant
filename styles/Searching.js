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
const sortedArr_p2 = [1, 2, 3, 3, 3, 4, 4, 5];
const key_found_p2 = 5;
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
  `Key 5: Output [First Index, Last Index]: [${result_found_p2.join(", ")}]`
);
console.log(
  `Key 6: Output [First Index, Last Index]: [${result_not_found_p2.join(", ")}]`
);
console.log(`======================================================`);

//Problem 3
function findInsertIndex(arr, key) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === key) {
      return mid;
    } else if (arr[mid] < key) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return low;
}

// --- Ví dụ 1: Key có mặt ---
console.log("--- Ví dụ 1: Key có mặt ---");
const arr1 = [1, 2, 3, 4, 5];
const key1 = 3;
console.log(`Input: Array: [${arr1}], Key: ${key1}`);
const result1 = findInsertIndex(arr1, key1);
console.log(`\nKết quả cuối cùng: ${result1}\n`);

// --- Ví dụ 2: Key không có mặt ---
console.log("--- Ví dụ 2: Key không có mặt ---");
const arr2 = [1, 2, 3, 5];
const key2 = 4;
console.log(`Input: Array: [${arr2}], Key: ${key2}`);
const result2 = findInsertIndex(arr2, key2);
console.log(`\nKết quả cuối cùng: ${result2}\n`);

// Problem 4:
function calculateEmployeeRating(workload) {
  let maxConsecutiveDays = 0;
  let currentConsecutiveDays = 0;

  for (let i = 0; i < workload.length; i++) {
    if (workload[i] > 6) {
      currentConsecutiveDays++;
    } else {
      currentConsecutiveDays = 0;
    }

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
