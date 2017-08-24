/**
 * Created by zhangyong on 2017/8/4.
 */

import Geometry from '../../geometry/geometry'
import Polygon from '../../geometry/polygon'

/**
 *
 * 判断多边形是否包含另外一个图形
 *
 * @method contains
 * @param polygon
 * @param geometry
 * @returns {*}
 */
export default function contains (polygon, geometry) {
  const polyGeometryType = polygon.geometryType
  let isContained = false
  
  if (polyGeometryType === Geometry.POLYGON ||
      polyGeometryType === Geometry.MULTI_POLYGON ||
      polyGeometryType === Geometry.EXTENT ) {
    const targetGeometryType = geometry.geometryType
    
    if (targetGeometryType === Geometry.POINT ) {
      return polygon.containsXY(geometry.x, geometry.y)
    } else if (targetGeometryType === Geometry.LINE ) {
      return polyContainsLine(polygon, geometry)
    } else if (targetGeometryType === Geometry.POLYGON ) {
      return polyContainsPoly(polygon, geometry)
    } else if (targetGeometryType === Geometry.PARALLELOGRAM) {
      return polyContainsPoly(polygon, new Polygon(geometry.getCoordinates()))
    }
  }
  
  return isContained
}


const polyContainsLine = function (poly, line) {
  const lineCoords = line.getCoordinates()
  return polygonContainsLinestring(poly, lineCoords)
}


const polyContainsPoly = function (poly, poly2) {
  const poly2Type = poly2.geometryType
  if (poly2Type === Geometry.POLYGON ) {
    const outRing = poly2.getCoordinates()[0]
    return polygonContainsLinestring(poly, outRing)
  } else if (poly2Type === Geometry.MULTI_POLYGON ) {
    return true
  }
  
  return false
}


const polygonContainsLinestring = function (poly, coords) {
  const hasOne = coords.some( coord => {
    return !poly.containsXY(coord[0], coord[1])
  })
  
  return !hasOne
}