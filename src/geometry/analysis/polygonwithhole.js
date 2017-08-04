/**
 * Created by zhangyong on 2017/8/4.
 */

import Geometry from '../../geometry/geometry'
import {linearRingsAreOriented} from '../support/orient'
import contains from './contains'

/**
 *
 * @param polygon
 * @param holePolygon
 * @returns {*}
 */
export default function polygonWithHoles (polygon, holePolygon) {
  
  let resultPolygon = polygon
  const holeCoordinates = holePolygon.getCoordinates()
  const polygonCoordinates = polygon.getCoordinates()
  
  const type = polygon.geometryType
  // if (type === Geometry.POLYGON || type === Geometry.MULTI_POLYGON ) {
  if (type === Geometry.POLYGON ) {
    // 必须要被包含在多边形内
    if (contains(polygon, holePolygon)) {
      const holeOutRings = holeCoordinates[0]
      const polygonOutRings = polygonCoordinates[0]
      
      const holeOriented = linearRingsAreOriented(holeOutRings, 0, [holeOutRings.length], 2)
      const polygonOutRingOriented = linearRingsAreOriented(polygonOutRings, 0, [polygonOutRings.length], 2)
      
      // 带洞多边形
      if (polygon.getCoordinates().length > 1) {
        // 如果有带洞多边形，需要处理的更多
        // 这里只是简单的存储进去
  
        // 不同向
        if (holeOriented !== polygonOutRingOriented) {
          polygonCoordinates.push(holeCoordinates.slice())
        } else {
          polygonCoordinates.push(holeCoordinates.slice().reverse())
        }
        
      } else {
        // 不同向
        if (holeOriented !== polygonOutRingOriented) {
          polygonCoordinates.push(holeCoordinates.slice())
        } else {
          polygonCoordinates.push(holeCoordinates.slice().reverse())
        }
      }
    }
  }
  
  return resultPolygon
}