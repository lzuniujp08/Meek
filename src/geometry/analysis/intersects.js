/**
 * Created by zhangyong on 2017/7/13.
 */

import Geometry from '../../geometry/geometry'
import {ExtentUtil} from '../support/extentutil'

/**
 * 判断任意图形是否相交
 * @TODO 还需要解决带洞多边形带来的问题
 *
 * @method intersects
 * @param geometry1
 * @param geometry2
 * @returns {Boolean}
 */
export default function intersects (geometry1, geometry2) {
  if ( (geometry1 === null || geometry1 === undefined ) ||
       (geometry2 === null || geometry2 === undefined )) {
    return false
  }
  
  const extent1 = geometry1.extent
  const extent2 = geometry2.extent
  const ext1Arr = [extent1.xmin, extent1.ymin, extent1.xmax, extent1.ymax]
  const ext2Arr = [extent2.xmin, extent2.ymin, extent2.xmax, extent2.ymax]
  
  // 如果两个图形的外界矩形不相交，则跳出判断
  if (!ExtentUtil.intersects(ext1Arr, ext2Arr)) {
    return false
  }
  
  const geometryType = geometry1.geometryType
  
  let result = false
  switch (geometryType) {
  case Geometry.POINT :
    result = pointIntersectsGeometry(geometry1, geometry2)
    break
  case Geometry.LINE :
    result = lineIntersectsGeometry(geometry1, geometry2)
    break
  case Geometry.POLYGON:
  case Geometry.EXTENT:
    result = polygonIntersectsGeometry(geometry1, geometry2)
  }
  
  return result
}

/**
 * 点和图形相交判断
 * @param point
 * @param geometry
 * @returns {*}
 */
const pointIntersectsGeometry = function(point, geometry) {
  const geometryType = geometry.geometryType
  
  switch (geometryType) {
  case Geometry.POINT:
  case Geometry.LINE:
  case Geometry.POLYGON:
  case Geometry.EXTENT:
    return geometry.containsXY(point.x, point.y)
  }
  
  return false
}

/**
 * 线和图形相交判断
 * @param line
 * @param geometry
 * @returns {Boolean|boolean|*}
 */
const lineIntersectsGeometry = function (line, geometry) {
  const geometryType = geometry.geometryType
  switch (geometryType) {
  case Geometry.POINT:
    return line.containsXY(geometry.x, geometry.y)
  case Geometry.LINE:
    return lineIntersectsLine(line, geometry)
  case Geometry.POLYGON:
  case Geometry.EXTENT:
    return lineIntersectsPolygon(line, geometry)
  }
}

/**
 * 线与线相交判断
 * @param line1
 * @param line2
 */
const lineIntersectsLine = function(line1, line2) {
  const lineLinearRings1 = line1.getCoordinates()
  const lineLinearRings2 = line2.getCoordinates()
  
  return intersectsByLinearRings(lineLinearRings1, lineLinearRings2)
}

/**
 * 多边形和图形相交判断
 * @param poly
 * @param geometry
 * @returns {Boolean|boolean|*}
 */
const polygonIntersectsGeometry = function (poly, geometry) {
  const geometryType = geometry.geometryType
  switch (geometryType) {
  case Geometry.POINT:
    return poly.containsXY(geometry.x, geometry.y)
  case Geometry.LINE:
    return lineIntersectsPolygon(geometry, poly)
  case Geometry.POLYGON:
  case Geometry.EXTENT:
    return polygonIntersectsPolygon(poly, geometry)
  }
}

/**
 * 线和多边形相交判断
 * @param line
 * @param polygon
 */
const lineIntersectsPolygon = function (line, polygon) {
  const lineLinearRings = line.getCoordinates()
  let polygon2LinearRings = polygon.getCoordinates()
  
  if (polygon.geometryType === Geometry.POLYGON ||
      polygon.geometry === Geometry.MULTI_POLYGON) {
    polygon2LinearRings = polygon2LinearRings[0] // 只获得外环
  }
  
  let intersect = intersectsByLinearRings(lineLinearRings, polygon2LinearRings)
  
  if (!intersect) {
    // check if this poly contains points of the ring/linestring
    for (let i = 0, len = lineLinearRings.length; i < len; ++i) {
      const point = lineLinearRings[i]
      intersect = polygon.containsXY(point[0], point[1])
      if (intersect) {
        break
      }
    }
  }
  
  return intersect
}

/**
 * 多边形和多边形相交判断
 * @param poly
 * @param polygon
 */
const polygonIntersectsPolygon = function (poly, polygon) {
  let lineLinearRings = poly.getCoordinates()
  let polygon2LinearRings = polygon.getCoordinates()// 只获得外环
  
  if (poly.geometryType === Geometry.POLYGON) {
    lineLinearRings = lineLinearRings[0]
  }
  
  if (polygon.geometryType === Geometry.POLYGON) {
    polygon2LinearRings = polygon2LinearRings[0]
  }
  
  let intersect = intersectsByLinearRings(lineLinearRings, polygon2LinearRings)
  
  // 两个多边形要做相互内含关系的判断
  
  // 正向检查
  if (!intersect) {
    for (let i = 0, len = lineLinearRings.length; i < len; ++i) {
      const point = lineLinearRings[i]
      intersect = polygon.containsXY(point[0], point[1])
      if (intersect) {
        break
      }
    }
  }
  
  // 反向检查
  if (!intersect) {
    for (let i = 0, len = polygon2LinearRings.length; i < len; ++i) {
      const point = polygon2LinearRings[i]
      intersect = poly.containsXY(point[0], point[1])
      if (intersect) {
        break
      }
    }
  }
  
  return intersect
}

const intersectsByLinearRings = function (LinearRing1, LinearRings2) {
  let intersect = false
  const segs1 = getSortedSegments(LinearRing1)
  const segs2 = getSortedSegments(LinearRings2)
  
  let seg1, seg1x1, seg1x2, seg1y1, seg1y2,
    seg2, seg2y1, seg2y2
  
  // sweep right
  for(let i = 0, len = segs1.length; i < len; ++i) {
    seg1 = segs1[i]
    seg1x1 = seg1.x1
    seg1x2 = seg1.x2
    seg1y1 = seg1.y1
    seg1y2 = seg1.y2
    
    for(let j = 0, jlen = segs2.length; j < jlen; ++j) {
      seg2 = segs2[j]
      if(seg2.x1 > seg1x2) {
        // seg1 still left of seg2
        break
      }
      
      if(seg2.x2 < seg1x1) {
        // seg2 still left of seg1
        continue
      }
      
      seg2y1 = seg2.y1
      seg2y2 = seg2.y2
      if (Math.min(seg2y1, seg2y2) > Math.max(seg1y1, seg1y2)) {
        // seg2 above seg1
        continue
      }
      
      if (Math.max(seg2y1, seg2y2) < Math.min(seg1y1, seg1y2)) {
        // seg2 below seg1
        continue
      }
      
      if (segmentsIntersect(seg1, seg2)) {
        intersect = true
        break
      }
    }
  }
  
  return intersect
}

const getSortedSegments = function (points) {
  const numSeg = points.length - 1
  let segments = new Array(numSeg), point1, point2
  
  for (let i = 0; i < numSeg; ++i) {
    point1 = points[i]
    point2 = points[i + 1]
    
    if (point1[0] < point2[0]) {
      segments[i] = {
        x1: point1[0],
        y1: point1[1],
        x2: point2[0],
        y2: point2[1]
      }
    } else {
      segments[i] = {
        x1: point2[0],
        y1: point2[1],
        x2: point1[0],
        y2: point1[1]
      }
    }
  }
  
  // more efficient to define this somewhere static
  function byX1(seg1, seg2) {
    return seg1.x1 - seg2.x1
  }
  
  return segments.sort(byX1)
}

const segmentsIntersect = function (seg1, seg2, options) {
  const point = options && options.point
  const tolerance = options && options.tolerance
  let intersection = false
  const x11_21 = seg1.x1 - seg2.x1
  const y11_21 = seg1.y1 - seg2.y1
  const x12_11 = seg1.x2 - seg1.x1
  const y12_11 = seg1.y2 - seg1.y1
  const y22_21 = seg2.y2 - seg2.y1
  const x22_21 = seg2.x2 - seg2.x1
  const d = (y22_21 * x12_11) - (x22_21 * y12_11)
  const n1 = (x22_21 * y11_21) - (y22_21 * x11_21)
  const n2 = (x12_11 * y11_21) - (y12_11 * x11_21)
  
  if (d == 0) {
    // parallel
    if (n1 == 0 && n2 == 0) {
      // coincident
      intersection = true
    }
  } else {
    const along1 = n1 / d
    const along2 = n2 / d
    if (along1 >= 0 && along1 <= 1 && along2 >=0 && along2 <= 1) {
      // intersect
      if (!point) {
        intersection = true
      } else {
        // calculate the intersection point
        const x = seg1.x1 + (along1 * x12_11)
        const y = seg1.y1 + (along1 * y12_11)
        intersection = { 'x':x, 'y':y }
      }
    }
  }
  
  if (tolerance) {
    let dist
    if (intersection) {
      if (point) {
        const segs = [seg1, seg2]
        let seg, x, y
        // check segment endpoints for proximity to intersection
        // set intersection to first endpoint within the tolerance
        for (let i = 0; i < 2; ++i) {
          seg = segs[i]
          for (let j = 1; j < 3; ++j) {
            x = seg['x' + j]
            y = seg['y' + j]
            
            dist = Math.sqrt(
              Math.pow(x - intersection.x, 2) +
              Math.pow(y - intersection.y, 2)
            )
            
            if (dist < tolerance) {
              intersection.x = x
              intersection.y = y
              break
            }
          }
        }
        
      }
    } else {
      // no calculated intersection, but segments could be within
      // the tolerance of one another
      const segs = [seg1, seg2]
      let source, target, p, result
      // check segment endpoints for proximity to intersection
      // set intersection to first endpoint within the tolerance
      for (let i = 0; i < 2; ++i) {
        source = segs[i]
        target = segs[(i + 1) % 2]
        for (let j = 1; j < 3; ++j) {
          p = {x: source['x' + j], y: source['y' + j]}
          result = distanceToSegment(p, target)
          if (result.distance < tolerance) {
            if (point) {
              intersection = { 'x':p.x, 'y':p.y }
            } else {
              intersection = true
            }
            
            break
          }
        }
      }
    }
  }
  return intersection
}


const distanceToSegment = function (point, segment) {
  let result = distanceSquaredToSegment(point, segment)
  result.distance = Math.sqrt(result.distance)
  return result
}

const distanceSquaredToSegment = function (point, segment) {
  const x0 = point.x
  const y0 = point.y
  const x1 = segment.x1
  const y1 = segment.y1
  const x2 = segment.x2
  const y2 = segment.y2
  const dx = x2 - x1
  const dy = y2 - y1
  const along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) / (Math.pow(dx, 2) + Math.pow(dy, 2))
  let x, y
  
  if(along <= 0.0) {
    x = x1
    y = y1
  } else if(along >= 1.0) {
    x = x2
    y = y2
  } else {
    x = x1 + along * dx
    y = y1 + along * dy
  }
  
  return {
    distance: Math.pow(x - x0, 2) + Math.pow(y - y0, 2),
    x: x, y: y,
    along: along
  }
}