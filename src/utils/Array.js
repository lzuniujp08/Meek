/**
 * Created by zhangyong on 2017/6/14.
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


export function numberSafeCompareFunction (a, b) {
  return a > b ? 1 : a < b ? -1 : 0
}