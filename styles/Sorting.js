// Problem 1: Implement Algorithms Selection Sorting
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}
let arr_selection = [64, 25, 12, 22, 11];
console.log(`Selection Sort Input: [${arr_selection}]`);
console.log(`Selection Sort Output: [${selectionSort(arr_selection)}]`);
console.log(`======================================================`);

// Problem 2: Implement Algorithms Insertion Sorting
function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}
let arr_insertion = [12, 11, 13, 5, 6];
console.log(`Insertion Sort Input: [${arr_insertion}]`);
console.log(`Insertion Sort Output: [${insertionSort(arr_insertion)}]`);
console.log(`======================================================`);

// Problem 3: Implement Algorithms Counting Sorting
function countingSort(arr) {
  if (arr.length === 0) return [];

  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);
  const output = new Array(arr.length);

  for (const num of arr) {
    count[num]++;
  }

  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  for (let i = arr.length - 1; i >= 0; i--) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]]--;
  }

  return output;
}
let arr_counting = [4, 2, 2, 8, 3, 3, 1];
console.log(`Counting Sort Input: [${arr_counting}]`);
console.log(`Counting Sort Output: [${countingSort(arr_counting)}]`);
console.log(`======================================================`);

// Problem 4: Implement Algorithms Radix Sorting

function getDigit(num, i) {
  return Math.floor(Math.abs(num) / Math.pow(10, i)) % 10;
}

function mostDigits(arr) {
  let maxDigits = 0;
  for (const num of arr) {
    maxDigits = Math.max(maxDigits, num.toString().length);
  }
  return maxDigits;
}

function radixSort(arr) {
  const maxDigitCount = mostDigits(arr);

  for (let k = 0; k < maxDigitCount; k++) {
    let digitBuckets = Array.from({ length: 10 }, () => []);

    for (const num of arr) {
      let digit = getDigit(num, k);
      digitBuckets[digit].push(num);
    }

    arr = [].concat(...digitBuckets);
  }
  return arr;
}
let arr_radix = [170, 45, 75, 90, 802, 24, 2, 66];
console.log(`Radix Sort Input: [${arr_radix}]`);
console.log(`Radix Sort Output: [${radixSort(arr_radix)}]`);
console.log(`======================================================`);

// Problem 5: Implement Algorithms TimSort

const RUN = 32;
function insertionSortTim(arr, left, right) {
  for (let i = left + 1; i <= right; i++) {
    let temp = arr[i];
    let j = i - 1;
    while (j >= left && arr[j] > temp) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = temp;
  }
}

function merge(arr, l, m, r) {
  let len1 = m - l + 1;
  let len2 = r - m;

  let left = new Array(len1);
  let right = new Array(len2);

  for (let i = 0; i < len1; i++) left[i] = arr[l + i];
  for (let i = 0; i < len2; i++) right[i] = arr[m + 1 + i];

  let i = 0;
  let j = 0;
  let k = l;

  while (i < len1 && j < len2) {
    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
  }

  while (i < len1) {
    arr[k] = left[i];
    k++;
    i++;
  }

  while (j < len2) {
    arr[k] = right[j];
    k++;
    j++;
  }
}

function timSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n; i += RUN) {
    insertionSortTim(arr, i, Math.min(i + RUN - 1, n - 1));
  }

  for (let size = RUN; size < n; size = 2 * size) {
    for (let left = 0; left < n; left += 2 * size) {
      let mid = left + size - 1;
      let right = Math.min(left + 2 * size - 1, n - 1);

      if (mid < right) {
        merge(arr, left, mid, right);
      }
    }
  }
  return arr;
}
let arr_tim = [5, 21, 7, 23, 19, 45, 33, 11, 4];
console.log(`TimSort Input: [${arr_tim}]`);
console.log(`TimSort Output: [${timSort(arr_tim)}]`);
console.log(`======================================================`);

// Problem 6: Implement Algorithms Bingo Sorting
function bingoSort(arr) {
  const n = arr.length;
  if (n <= 1) return arr;

  let bingo = Math.min(...arr);
  let max = Math.max(...arr);

  let nextBingo = max;
  let nextPos = 0;
  let startPos = 0;

  while (bingo < max) {
    for (let i = startPos; i < n; i++) {
      if (arr[i] > bingo && arr[i] < nextBingo) {
        nextBingo = arr[i];
      }
    }

    for (let i = nextPos; i < n; i++) {
      if (arr[i] === bingo) {
        [arr[i], arr[nextPos]] = [arr[nextPos], arr[i]];
        nextPos++;
      }
    }

    startPos = nextPos;
    bingo = nextBingo;
    nextBingo = max;
  }

  return arr;
}
let arr_bingo = [9, 8, 7, 6, 5, 4, 3, 2, 1];
console.log(`Bingo Sort Input: [${arr_bingo}]`);
console.log(`Bingo Sort Output: [${bingoSort(arr_bingo)}]`);
console.log(`======================================================`);
