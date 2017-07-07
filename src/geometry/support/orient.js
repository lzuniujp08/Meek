/**
 * Created by zhangyong on 2017/6/14.
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


export function linearRingsAreOriented (flatCoordinates, offset, ends, stride, opt_right) {
  const right = opt_right !== undefined ? opt_right : false
  let i, ii
  
  for (i = 0, ii = ends.length; i < ii; ++i) {
    let end = ends[i]
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