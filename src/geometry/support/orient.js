/**
 * Created by zhangyong on 2017/6/14.
 */

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param endss
 * @param stride
 * @param opt_right
 * @returns {*}
 */
export function orientLinearRingss (flatCoordinates, offset, endss, stride, opt_right) {
  let i, ii
  for (i = 0, ii = endss.length; i < ii; ++i) {
    offset = orientLinearRings(
      flatCoordinates, offset, endss[i], stride, opt_right)
  }
  
  return offset
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param ends
 * @param stride
 * @param opt_right
 * @returns {*}
 */
export function orientLinearRings (flatCoordinates, offset, ends, stride, opt_right) {
  const right = opt_right !== undefined ? opt_right : false
  let i, ii
  
  for (i = 0, ii = ends.length; i < ii; ++i) {
    const end = ends[i]
    const isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride)
    
    const reverse = i === 0 ?
    (right && isClockwise) || (!right && !isClockwise) :
    (right && !isClockwise) || (!right && isClockwise)
    
    if (reverse) {
      // reverse(flatCoordinates, offset, end, stride)
      // 反转
      flatCoordinates = flatCoordinates.reverse()
    }
    offset = end
  }
  
  return offset
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param endss
 * @param stride
 * @param opt_right
 * @returns {boolean}
 */
export function linearRingssAreOriented (flatCoordinates, offset, endss, stride, opt_right) {
  let i, ii
  for (i = 0, ii = endss.length; i < ii; ++i) {
    if (!linearRingsAreOriented(
        flatCoordinates, offset, endss[i], stride, opt_right)) {
      return false
    }
  }
  return true
}

/**
 * 判断线串的方向
 * @param flatCoordinates
 * @param offset
 * @param ends
 * @param stride
 * @param opt_right
 * @returns {boolean}
 */
export function linearRingsAreOriented (flatCoordinates, offset, ends, stride, opt_right) {
  const right = opt_right !== undefined ? opt_right : false
  let i, ii
  
  for (i = 0, ii = ends.length; i < ii; ++i) {
    let end = ends[i]
    // 判断坐标串是否是顺时针
    let isClockwise = linearRingIsClockwise(flatCoordinates, offset, end, stride)
    
    if (i === 0) {
      if ((right && isClockwise) || (!right && !isClockwise)) {
        return false
      }
    } else {
      if ((right && !isClockwise) || (!right && isClockwise)) {
        return false
      }
    }
    
    offset = end
  }
  
  return true
}

/**
 * 判断坐标串是否是顺时针方向
 * @param flatCoordinates
 * @param offset
 * @param end
 * @param stride
 * @returns {boolean}
 */
export function linearRingIsClockwise(flatCoordinates, offset, end, stride) {
  // http://tinyurl.com/clockwise-method
  // https://github.com/OSGeo/gdal/blob/trunk/gdal/ogr/ogrlinearring.cpp
  let edge = 0
  let x1 = flatCoordinates[end - stride]
  let y1 = flatCoordinates[end - stride + 1]
  
  for (; offset < end; offset += stride) {
    let x2 = flatCoordinates[offset]
    let y2 = flatCoordinates[offset + 1]
    edge += (x2 - x1) * (y2 + y1)
    x1 = x2
    y1 = y2
  }
  
  return edge > 0
}