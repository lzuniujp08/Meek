/**
 * Created by zhangyong on 2017/5/23.
 */


/**
 * Calculate the distance between two points, and then determine
 * if two points get intersecting
 *
 * @param pointA
 * @param pointB
 * @param tolerance
 * @returns {boolean}
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
 * Detemin if the point is clo
 * @param pointA
 * @param line
 * @param tolerance
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


export function pointIntersectPolygon (pointA, polygon, tolerance) {
  
}


/**
 * Return the square of the distance between the points
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number} squared distance
 */
export function squaredDistance (x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  return dx * dx + dy * dy
}



export default {
  pointIntersectPoint,
  squaredDistance

}