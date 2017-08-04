/**
 * Created by zhangyong on 2017/6/14.
 */

/**
 *
 * @param arr
 * @param target
 * @param direction
 * @returns {number}
 */
export function linearFindNearest (arr, target, direction) {
  const n = arr.length
  if (arr[0] <= target) {
    return 0
  } else if (target <= arr[n - 1]) {
    return n - 1
  } else {
    let i
    if (direction > 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] < target) {
          return i - 1
        }
      }
    } else if (direction < 0) {
      for (i = 1; i < n; ++i) {
        if (arr[i] <= target) {
          return i
        }
      }
    } else {
      for (i = 1; i < n; ++i) {
        if (arr[i] == target) {
          return i
        } else if (arr[i] < target) {
          if (arr[i - 1] - target < target - arr[i]) {
            return i - 1
          } else {
            return i
          }
        }
      }
    }
    return n - 1
  }
}

/**
 *
 * @param arr
 * @param compareFnc
 */
export function stableSort (arr, compareFnc) {
  const length = arr.length
  let tmp = Array(arr.length)
  let i
  
  for (i = 0; i < length; i++) {
    tmp[i] = {index: i, value: arr[i]}
  }
  
  tmp.sort(function(a, b) {
    return compareFnc(a.value, b.value) || a.index - b.index
  })
  
  for (i = 0; i < arr.length; i++) {
    arr[i] = tmp[i].value
  }
}

/**
 *
 * @param haystack
 * @param needle
 * @param opt_comparator
 * @returns {number}
 */
export function binarySearch (haystack, needle, opt_comparator) {
  let mid, cmp
  const comparator = opt_comparator || numberSafeCompareFunction
  let low = 0
  let high = haystack.length
  let found = false
  
  while (low < high) {
    /* Note that "(low + high) >>> 1" may overflow, and results in a typecast
     * to double (which gives the wrong results). */
    mid = low + (high - low >> 1)
    cmp = +comparator(haystack[mid], needle)
    
    if (cmp < 0.0) { /* Too low. */
      low  = mid + 1
      
    } else { /* Key found or too high */
      high = mid
      found = !cmp
    }
  }
  
  /* Key not found. */
  return found ? low : ~low
}

/**
 * Determine if two arrays get equal to each other
 * @param arr1
 * @param arr2
 * @returns {boolean}
 */
export function equals (arr1, arr2) {
  const len1 = arr1.length
  if (len1 !== arr2.length) {
    return false
  }
  
  for (let i = 0; i < len1; i++) {
    if (arr1[i] !== arr2[i]) {
      return false
    }
  }
  
  return true
}

/**
 *
 * @param a
 * @param b
 * @returns {number}
 */
export function numberSafeCompareFunction (a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}