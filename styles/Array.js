//Problems 1
// Cách 1: Sử dụng mảng phụ để lưu trữ kết quả
function moveZeroesInPlace(nums) {
  let writeIndex = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[writeIndex] = nums[i];
      writeIndex++;
    }
  }

  for (let i = writeIndex; i < nums.length; i++) {
    nums[i] = 0;
  }
  return nums;
}
const rawArray = [0, 1, 0, 3, 12, 5, 0];
const arrayCopy = [...rawArray];
console.log("\nProblem 1:");
console.log("Mảng gốc:", rawArray);
const result1 = moveZeroesInPlace(arrayCopy);
console.log("Mảng kết quả (đã thay đổi):", result1);
// Cách 2: Sử dụng concat để tạo mảng mới
function moveZeroesInPlaceConcat(nums) {
  const nonZeroes = nums.filter((num) => num !== 0);
  const zeroesCount = nums.length - nonZeroes.length;
  const zeroes = new Array(zeroesCount).fill(0);
  return nonZeroes.concat(zeroes);
}
console.log("Mảng gốc:", rawArray);
const result2 = moveZeroesInPlaceConcat(arrayCopy);
console.log("Mảng kết quả (đã thay đổi):", result2);

//Problems 2
// Give an array X[] consisting of 0s,1s and 2s.Write a program to sort the array off 0's, 1's and 2's in ascending order (not using any sorting algorithm). Write 2 ways to solve the problem.
// Cách 1: Đếm số lượng 0, 1 và 2
function sort012Count(nums) {
  let count0 = 0,
    count1 = 0,
    count2 = 0;
  for (let num of nums) {
    if (num === 0) count0++;
    else if (num === 1) count1++;
    else if (num === 2) count2++;
  }
  let index = 0;
  for (let i = 0; i < count0; i++) nums[index++] = 0;
  for (let i = 0; i < count1; i++) nums[index++] = 1;
  for (let i = 0; i < count2; i++) nums[index++] = 2;
  return nums;
}

const rawArray2 = [2, 0, 1, 2, 1, 0, 0, 2, 1];
const arrayCopy2 = [...rawArray2]; // tránh tham trị
const resultA = sort012Count(arrayCopy2);
console.log("\nProblem 2:");
console.log("Mảng ban đầu:", rawArray2);
console.log("Mảng kết quả:", resultA);

// Cách 2: Sử dụng hai con trỏ biên để hoán đổi
function sort012TwoBoundaryPointers(nums) {
  const swap = (arr, i, j) => {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  };

  let p0 = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      swap(nums, i, p0);
      p0++;
    }
  }

  let p2 = nums.length - 1;

  for (let i = nums.length - 1; i >= p0; i--) {
    if (nums[i] === 2) {
      swap(nums, i, p2);
      p2--;
    }
  }

  return nums;
}

const arrayC = [1, 2, 0, 1, 2, 0, 0, 1];
const arrayCopyC = [...arrayC]; // Tạo bản sao để không thay đổi mảng gốc

const resultC = sort012TwoBoundaryPointers(arrayCopyC);
console.log("Mảng gốc:", arrayC);
console.log("Mảng kết quả:", resultC);

//Problems 3: Given an array of n integers and value goalSum, write a program
// check whether there is  a pair of elements in the array whose sum is equal
// to goalSUm. If yes, return true; otherwise, return false
// Assume all elements are distinct.
// Value in the array can be both positive and negative.
// for example output: true(7,8) or (-5,20)

function findAllPairsWithSum(nums, goalSum) {
  const seen = new Set();
  const pairs = [];

  for (let num of nums) {
    const complement = goalSum - num;
    if (seen.has(complement)) {
      pairs.push([num, complement]);
    }
    seen.add(num);
  }
  return pairs;
}

const rawArray3 = [-5, 1, -40, 20, 6, 8, 7];
const goalSum = 15;
const arrayCopy3 = [...rawArray3];
const resultProblem3 = findAllPairsWithSum(arrayCopy3, goalSum);

let logOutput3 = "";
if (resultProblem3.length > 0) {
  const pairsString = resultProblem3
    .map((pair) => `(${pair[0]}, ${pair[1]})`)
    .join(", ");
  logOutput3 = `true ${pairsString}`;
} else {
  logOutput3 = "false";
}

console.log("\n--- Problem 3 (Two Sum - All Pairs) ---");
console.log("Mảng ban đầu:", rawArray3);
console.log("Tổng mục tiêu (Goal Sum):", goalSum);
console.log("Kết quả:", logOutput3);

// Problem 4: Given an array of integers, return the maximum product of two elements in the array. Write 2 ways to solve the problem.
// Cách 1: Sắp xếp mảng và lấy hai phần tử lớn nhất
function maxProductSort(nums) {
  const sortedNums = [...nums].sort((a, b) => a - b);
  const n = sortedNums.length;

  const min1 = sortedNums[0];
  const min2 = sortedNums[1];
  const productN = min1 * min2;

  const max1 = sortedNums[n - 1];
  const max2 = sortedNums[n - 2];
  const productP = max1 * max2;

  if (productP >= productN) {
    return { product: productP, factors: [max1, max2] };
  } else {
    return { product: productN, factors: [min1, min2] };
  }
}
// Cách 2: Duyệt mảng để tìm hai phần tử lớn nhất
function maxProductTwoPass(nums) {
  if (nums.length < 2) return { product: 0, factors: [] };

  let max1 = -Infinity,
    max2 = -Infinity;
  let min1 = Infinity,
    min2 = Infinity;

  for (const num of nums) {
    if (num > max1) {
      max2 = max1;
      max1 = num;
    } else if (num > max2) {
      max2 = num;
    }

    if (num < min1) {
      min2 = min1;
      min1 = num;
    } else if (num < min2) {
      min2 = num;
    }
  }

  const productP = max1 * max2;
  const productN = min1 * min2;

  if (productP >= productN) {
    return { product: productP, factors: [max1, max2] };
  } else {
    return { product: productN, factors: [min1, min2] };
  }
}

const rawArray4 = [3, 4, 5, 2];
const arrayCopy4 = [...rawArray4];

const resultSort = maxProductSort(arrayCopy4);
const resultTwoPass = maxProductTwoPass(arrayCopy4);
const formatOutput = (result) =>
  `${result.product} (${result.factors[0]}*${result.factors[1]})`;
console.log("\n--- Problem 4 (Maximum Product) ---");
console.log("Mảng ban đầu:", rawArray4);
console.log("Tích lớn nhất (Cách 1 - Sắp xếp):", formatOutput(resultSort));
console.log(
  "Tích lớn nhất (Cách 2 - Duyệt mảng):",
  formatOutput(resultTwoPass)
);

// Problem 5: Given an array nums of integers, find all  uqnique tripplets in the array which gives the sum of zero.
function threeSum(nums) {
  const n = nums.length;
  if (n < 3) return [];

  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < n - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    const target = -nums[i];
    let left = i + 1;
    let right = n - 1;

    while (left < right) {
      const sum = nums[left] + nums[right];

      if (sum === target) {
        result.push([nums[i], nums[left], nums[right]]);

        while (left < right && nums[left] === nums[left + 1]) {
          left++;
        }
        while (left < right && nums[right] === nums[right - 1]) {
          right--;
        }
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}

const rawArray5 = [-1, 0, 1, 2, -1, -4];
const resultProblem5 = threeSum(rawArray5);

console.log("\n--- Problem 5 (3Sum) ---");
console.log("Mảng ban đầu:", rawArray5);
console.log("Các bộ ba có tổng bằng 0:", JSON.stringify(resultProblem5));
