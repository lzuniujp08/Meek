/**
 * Created by zhangyong on 2017/7/13.
 */

import Geometry from '../../geometry/geometry'
import {ExtentUtil} from '../support/extentUtil'

/**
 *
 * @param geometry1
 * @param geometry2
 * @returns {boolean}
 */
export default function intersects (geometry1, geometry2) {
  if ( (geometry1 === null || geometry1 === undefined ) ||
       (geometry2 === null || geometry2 === undefined )) {
    return false
  }
  
  
  const extent1 = geometry1.extent
  const extent2 = geometry2.extent
  if (!ExtentUtil.intersects([extent1.xmin, extent1.ymin,
                              extent1.xmax, extent1.ymax],
      [extent2.xmin, extent2.ymin,
       extent2.xmax, extent2.ymax])) {
    return false
  }
  
  const geometryType = geometry1.geometryType
  
  let result = false
  switch (geometryType) {
  case Geometry.POINT :
    result = pointIntersectsGeometry(geometry1, geometry2)
    break
  case Geometry.LINE :
  case Geometry.POLYGON:
  case Geometry.EXTENT:
    result = lineIntersectsGeometry(geometry1, geometry2)
  }
  
  return result
}


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


const lineIntersectsGeometry = function (line, geometry) {
  const geometryType = geometry.geometryType
  switch (geometryType) {
  case Geometry.POINT:
    return line.containsXY(geometry.x, geometry.y)
  case Geometry.LINE:
  case Geometry.POLYGON:
  case Geometry.EXTENT:
    return intersectsByPolygon(line.getCoordinates(), geometry.getCoordinates())
  }
}


const intersectsByPolygon = function (polygon1LinearRings, polygon2LinearRings) {
  let intersect = intersectsByLinearRings(polygon1LinearRings, polygon2LinearRings)
  if (!intersect) {
    // check if this poly contains points of the ring/linestring
    for (let i = 0, len = polygon2LinearRings.length; i < len; ++i) {
      const point = polygon2LinearRings[i]
      intersect = containsPointByLinearRing(point, polygon1LinearRings)
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
  for(let i = 0; i < numSeg; ++i) {
    point1 = points[i]
    point2 = points[i + 1]
    
    if (point1.x < point2.x) {
      segments[i] = {
        x1: point1.x,
        y1: point1.y,
        x2: point2.x,
        y2: point2.y
      }
    } else {
      segments[i] = {
        x1: point2.x,
        y1: point2.y,
        x2: point1.x,
        y2: point1.y
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

// LinearRing : array[pt]
// point : {x:1,y:2}
const containsPointByLinearRing = function (point, LinearRing) {
  
  //limitSigDigs
  function approx(num, sig) {
    let fig = 0
    if (sig > 0) {
      fig = parseFloat(num.toPrecision(sig))
    }
    return fig
  }
  
  const digs = 14
  const px = approx(point.x, digs)
  const py = approx(point.y, digs)
  function getX(y, x1, y1, x2, y2) {
    return (y - y2) * ((x2 - x1) / (y2 - y1)) + x2
  }
  
  const numSeg = LinearRing.length - 1
  let start, end, x1, y1, x2, y2, cx
  let crosses = 0
  
  for (let i = 0; i < numSeg; ++i) {
    start = LinearRing[i]
    x1 = approx(start.x, digs)
    y1 = approx(start.y, digs)
    end = LinearRing[i + 1]
    x2 = approx(end.x, digs)
    y2 = approx(end.y, digs)
    
    if (y1 == y2) {
      // horizontal edge
      if (py == y1) {
        // point on horizontal line
        if (x1 <= x2 && (px >= x1 && px <= x2) || // right or vert
          x1 >= x2 && (px <= x1 && px >= x2)) { // left or vert
          // point on edge
          crosses = -1
          break
        }
      }
      // ignore other horizontal edges
      continue
    }
    cx = approx(getX(py, x1, y1, x2, y2), digs)
    if (cx == px) {
      // point on line
      if (y1 < y2 && (py >= y1 && py <= y2) || // upward
        y1 > y2 && (py <= y1 && py >= y2)) { // downward
        // point on edge
        crosses = -1
        break
      }
    }
    
    if (cx <= px) {
      // no crossing to the right
      continue
    }
    
    if (x1 != x2 && (cx < Math.min(x1, x2) || cx > Math.max(x1, x2))) {
      // no crossing
      continue
    }
    
    if (y1 < y2 && (py >= y1 && py < y2) || // upward
      y1 > y2 && (py < y1 && py >= y2)) { // downward
      ++crosses
    }
  }
  
  const contained = (crosses == -1) ?
    // on edge
    1 :
    // even (out) or odd (in)
    !!(crosses & 1)
  
  return contained
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