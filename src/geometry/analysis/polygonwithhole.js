/**
 * Created by zhangyong on 2017/8/4.
 */

import Geometry from '../../geometry/geometry'
import {linearRingIsClockwise} from '../support/orient'
import contains from './contains'

/**
 *
 * @param polygon
 * @param holePolygon
 * @returns {*}
 */
export default function polygonWithHoles (polygon1, polygon2) {
  
  const polygon = polygon1.clone()
  const holePolygon = polygon2.clone()
  
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
      
      let tempHoleOutRings = []
      let tempPolygonOutRings = []
  
      holeOutRings.forEach( ring => {
        tempHoleOutRings.push(ring[0], ring[1])
      })
  
      polygonOutRings.forEach( ring => {
        tempPolygonOutRings.push(ring[0], ring[1])
      })
      
      const holeOriented = linearRingIsClockwise(tempHoleOutRings, 0, tempHoleOutRings.length, 2)
      const polygonOutRingOriented = linearRingIsClockwise(tempPolygonOutRings, 0, tempPolygonOutRings.length, 2)
      
      // 带洞多边形
      if (polygonCoordinates.length > 1) {
        // 如果有带洞多边形，需要处理的更多
        // 这里只是简单的存储进去
  
        // 不同向
        if (holeOriented !== polygonOutRingOriented) {
          polygonCoordinates.push(holeOutRings.slice())
        } else {
          polygonCoordinates.push(holeOutRings.slice().reverse())
        }
        
      } else {
        // 不同向
        if (holeOriented !== polygonOutRingOriented) {
          polygonCoordinates.push(holeOutRings.slice())
        } else {
          polygonCoordinates.push(holeOutRings.slice().reverse())
        }
      }
    }
  }
  
  return resultPolygon
}