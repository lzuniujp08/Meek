/**
 * Created by zhangyong on 2017/6/14.
 */

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
 *
 * @param a
 * @param b
 * @returns {number}
 */
export function numberSafeCompareFunction (a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}