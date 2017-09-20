/**
 * Created by zhangyong on 2017/5/23.
 */

import Geometry from '../../geometry/geometry'

/**
 * 判断两个点是否相交
 *
 * @method pointIntersectPoint
 * @param pointA
 * @param pointB
 * @param tolerance {Number}
 * @returns {Boolean}
 */
export function pointIntersectPoint (pointA, pointB, tolerance) {
  const toleranceDistance = tolerance ? tolerance : 2
  
  const distance = squaredDistance(pointA.x, pointA.y, pointB.x, pointB.y)
  if (distance <= toleranceDistance) {
    return true
  }
  
  return false
}

/**
 * 判断点是否与线相交
 *
 * @method pointIntersectLine
 * @param pointA
 * @param line
 * @param tolerance {Number}
 * @returns {Boolean}
 */
export function pointIntersectLine (pointA, line, tolerance) {
  const path = line.path
  const squaredSegmentDistanceFn = squaredSegmentDistance
  const x = pointA.x
  const y = pointA.y
  
  let find = false
  for (let i = 0, ii = path.length - 1; i < ii; i++) {
    let nowP = path[i]
    let nextP = path[i + 1]
    let distance = squaredSegmentDistanceFn(x, y, nowP.x, nowP.y, nextP.x, nextP.y)
    distance = Math.sqrt(distance)
    if (distance <= tolerance) {
      find = true
      break
    }
  }
  
  return find
}

/**
 * Return the square of the closest distance between the point
 * and the line segment.
 * @param x
 * @param y
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
export function squaredSegmentDistance (x, y, x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  if (dx !== 0 || dy !== 0) {
    let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)
    if (t > 1) {
      x1 = x2
      y1 = y2
    } else if (t > 0) {
      x1 += dx * t
      y1 += dy * t
    }
  }
  
  return squaredDistance(x, y, x1, y1)
}

/**
 *
 * @param coordinate
 * @param segment
 * @returns {number}
 */
export function squaredDistanceToSegment (coordinate, segment) {
  const closestCoordinate = closestOnSegment(coordinate, segment)
  return squaredDistance(coordinate[0], coordinate[1], closestCoordinate[0], closestCoordinate[1])
}

/**
 * 判断两个坐标是否相等
 *
 * @method equals
 * @param coordinate1
 * @param coordinate2
 * @returns {Boolean}
 */
export function equals (coordinate1, coordinate2) {
  let equals = true
  for (let i = coordinate1.length - 1; i >= 0; --i) {
    if (coordinate1[i] != coordinate2[i]) {
      equals = false
      break
    }
  }
  
  return equals
}

/**
 * 计算两点之间的距离的平方
 *
 * @method squaredDistance
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {Number} squared distance
 */
export function squaredDistance (x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}

/**
 * 计算两点之间的距离
 *
 * @method distance
 * @param coord1
 * @param coord2
 * @returns {Number}
 */
export function distance (coord1, coord2) {
  return Math.sqrt(squaredDistance(coord1[0], coord1[1], coord2[0], coord2[1]))
}

/**
 *
 * @param coordinate {Array}
 * @param segment
 * @returns {Array}
 */
export function closestOnSegment (coordinate, segment) {
  const x0 = coordinate[0]
  const y0 = coordinate[1]
  const start = segment[0]
  const end = segment[1]
  const x1 = start[0]
  const y1 = start[1]
  const x2 = end[0]
  const y2 = end[1]
  const dx = x2 - x1
  const dy = y2 - y1
  
  const along = (dx === 0 && dy === 0) ? 0 :
  ((dx * (x0 - x1)) + (dy * (y0 - y1))) / ((dx * dx + dy * dy) || 0)
  
  let x, y
  if (along <= 0) {
    x = x1
    y = y1
  } else if (along >= 1) {
    x = x2
    y = y2
  } else {
    x = x1 + along * dx
    y = y1 + along * dy
  }
  
  return [x, y]
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param ends
 * @param stride
 * @param x
 * @param y
 * @returns {oolean}
 */
export function linearRingsContainsXY (flatCoordinates, offset, ends, stride, x, y) {
  if (ends.length === 0) {
    return false
  }
  
  if (!linearRingContainsXY(flatCoordinates, offset, ends[0], stride, x, y)) {
    return false
  }
  
  let i, ii
  for (i = 1, ii = ends.length; i < ii; ++i) {
    if (linearRingContainsXY(flatCoordinates, ends[i - 1], ends[i], stride, x, y)) {
      return false
    }
  }
  
  return true
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param end
 * @param stride
 * @param x
 * @param y
 * @returns {boolean}
 */
export function linearRingContainsXY (flatCoordinates, offset, end, stride, x, y) {
  // http://geomalgorithms.com/a03-_inclusion.html
  // Copyright 2000 softSurfer, 2012 Dan Sunday
  // This code may be freely used and modified for any purpose
  // providing that this copyright notice is included with it.
  // SoftSurfer makes no warranty for this code, and cannot be held
  // liable for any real or imagined damage resulting from its use.
  // Users of this code must verify correctness for their application.
  let wn = 0
  let x1 = flatCoordinates[end - stride]
  let y1 = flatCoordinates[end - stride + 1]
  for (; offset < end; offset += stride) {
    let x2 = flatCoordinates[offset]
    let y2 = flatCoordinates[offset + 1]
    
    if (y1 <= y) {
      if (y2 > y && ((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1)) > 0) {
        wn++
      }
    } else if (y2 <= y && ((x2 - x1) * (y - y1)) - ((x - x1) * (y2 - y1)) < 0) {
      wn--
    }
    
    x1 = x2
    y1 = y2
  }
  
  return wn !== 0
}

/**
 * 计算在 AB 延长线上的距离点 B d 距离的点
 * @param xa A 点的 X
 * @param ya A 点的 Y
 * @param xb B 点的 X
 * @param yb B 点的 Y
 * @param d 距离 B 点 d 距离
 * @returns {Array} 返回延长线上的点
 */
export function getPointInExtendedLineByDistanceFromAB (xa, ya, xb, yb, d) {
  let xab, yab
  let xbd
  let xd, yd
  
  xab = xb - xa
  yab = yb - ya
  
  xbd = Math.sqrt((d * d) / ((yab / xab) * (yab / xab) + 1))
  
  if (xab > 0) {
    xbd = Math.sqrt((d * d) / ((yab / xab) * (yab / xab) + 1))
  } else {
    xbd = -Math.sqrt((d * d) / ((yab / xab) * (yab / xab) + 1))
  }
  
  xd = xb + xbd
  yd = yb + yab / xab * xbd
  
  return [xd, yd]
}

export function simplify(geometry) {
  if (!geometry) {
    return geometry
  }
  
  let coordinates
  const geoType = geometry.geometryType
  if (geoType === Geometry.POLYGON) {
    coordinates = geometry.getCoordinates()[0]
  } else if (geoType === Geometry.LINE) {
    coordinates = geometry.getCoordinates()
    
    const sliceCoords = coordinates.slice(1, coordinates.length - 2)
    const newCoords = [coordinates[0]]
    
    for (let i = 0, len = sliceCoords.length ;i < len; i += 2) {
      newCoords.push(sliceCoords[i])
    }
  
    newCoords.push(coordinates[coordinates.length - 1])
    geometry.setCoordinates(newCoords)
  }
}

export default {
  linearRingContainsXY,
  linearRingsContainsXY,
  pointIntersectPoint,
  squaredDistance,
  closestOnSegment,
  getPointInExtendedLineByDistanceFromAB,
  equals,
  simplify,
  distance
}