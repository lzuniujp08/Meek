/**
 * Created by zhangyong on 2017/6/14.
 */


import {binarySearch, numberSafeCompareFunction} from '../../utils/array'
import {linearRingsContainsXY} from '../support/geometryutil'
import {lerp} from '../../utils/math'
import {ExtentUtil} from './extentutil'


/**
 *
 * @param flatCoordinates
 * @param offset
 * @param end
 * @param stride
 * @param fraction
 * @param opt_dest
 * @returns {*}
 */
export function lineString (flatCoordinates, offset, end, stride, fraction, opt_dest) {
  let pointX = NaN
  let pointY = NaN
  const n = (end - offset) / stride
  
  if (n === 1) {
    pointX = flatCoordinates[offset]
    pointY = flatCoordinates[offset + 1]
  } else if (n == 2) {
    pointX = (1 - fraction) * flatCoordinates[offset] +
      fraction * flatCoordinates[offset + stride]
    pointY = (1 - fraction) * flatCoordinates[offset + 1] +
      fraction * flatCoordinates[offset + stride + 1]
  } else if (n !== 0) {
    let x1 = flatCoordinates[offset]
    let y1 = flatCoordinates[offset + 1]
    let length = 0
    const cumulativeLengths = [0]
    let i
    for (i = offset + stride; i < end; i += stride) {
      const x2 = flatCoordinates[i]
      const y2 = flatCoordinates[i + 1]
      length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
      cumulativeLengths.push(length)
      x1 = x2
      y1 = y2
    }
    
    const target = fraction * length
    const index = binarySearch(cumulativeLengths, target)
    
    if (index < 0) {
      const t = (target - cumulativeLengths[-index - 2]) /
        (cumulativeLengths[-index - 1] - cumulativeLengths[-index - 2])
      const o = offset + (-index - 2) * stride
      pointX = lerp(
        flatCoordinates[o], flatCoordinates[o + stride], t)
      pointY = lerp(
        flatCoordinates[o + 1], flatCoordinates[o + stride + 1], t)
    } else {
      pointX = flatCoordinates[offset + index * stride]
      pointY = flatCoordinates[offset + index * stride + 1]
    }
  }
  
  if (opt_dest) {
    opt_dest[0] = pointX
    opt_dest[1] = pointY
    return opt_dest
  } else {
    return [pointX, pointY]
  }
}


/**
 *
 * @param flatCoordinates
 * @param offset
 * @param ends
 * @param stride
 * @param flatCenters
 * @param flatCentersOffset
 * @param opt_dest
 * @returns {*}
 */
export function linearRings(flatCoordinates, offset,
       ends, stride, flatCenters, flatCentersOffset, opt_dest) {
  let i, ii, x, x1, x2, y1, y2
  const y = flatCenters[flatCentersOffset + 1]
  const intersections = []
  // Calculate intersections with the horizontal line
  const end = ends[0]
  x1 = flatCoordinates[end - stride]
  y1 = flatCoordinates[end - stride + 1]
  
  for (i = offset; i < end; i += stride) {
    x2 = flatCoordinates[i]
    y2 = flatCoordinates[i + 1]
    if ((y <= y1 && y2 <= y) || (y1 <= y && y <= y2)) {
      x = (y - y1) / (y2 - y1) * (x2 - x1) + x1
      intersections.push(x)
    }
    x1 = x2
    y1 = y2
  }
  
  // Find the longest segment of the horizontal line that has its center point
  // inside the linear ring.
  let pointX = NaN
  let maxSegmentLength = -Infinity
  intersections.sort(numberSafeCompareFunction)
  x1 = intersections[0]
  for (i = 1, ii = intersections.length; i < ii; ++i) {
    x2 = intersections[i]
    const segmentLength = Math.abs(x2 - x1)
    if (segmentLength > maxSegmentLength) {
      x = (x1 + x2) / 2
      if (linearRingsContainsXY(
          flatCoordinates, offset, ends, stride, x, y)) {
        pointX = x
        maxSegmentLength = segmentLength
      }
    }
    x1 = x2
  }
  
  if (isNaN(pointX)) {
    // There is no horizontal line that has its center point inside the linear
    // ring.  Use the center of the the linear ring's extent.
    pointX = flatCenters[flatCentersOffset]
  }
  
  if (opt_dest) {
    opt_dest.push(pointX, y)
    return opt_dest
  } else {
    return [pointX, y]
  }
}


/**
 *
 * @param flatCoordinates
 * @param offset
 * @param endss
 * @param stride
 * @param flatCenters
 * @returns {Array}
 */
export function linearRingss (flatCoordinates, offset, endss, stride, flatCenters) {
  let interiorPoints = []
  let i, ii
  for (i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i]
    interiorPoints = linearRings(flatCoordinates,
      offset, ends, stride, flatCenters, 2 * i, interiorPoints)
    offset = ends[ends.length - 1]
  }
  
  return interiorPoints
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param endss
 * @param stride
 * @returns {Array}
 */
export function centerLinearRingss (flatCoordinates, offset, endss, stride) {
  const flatCenters = []
  let i, ii
  let extent = ExtentUtil.createEmpty()
  for (i = 0, ii = endss.length; i < ii; ++i) {
    const ends = endss[i]
    extent = ExtentUtil.createOrUpdateFromFlatCoordinates(
      flatCoordinates, offset, ends[0], stride)
    flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2)
    offset = ends[ends.length - 1]
  }
  return flatCenters
}