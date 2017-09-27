/**
 * Created by zhangyong on 2017/8/23.
 */

import Geometry from './geometry'
import Polygon from './polygon'
import {distance} from '../geometry/support/geometryutil'

import {getPointInExtendedLineByDistanceFromAB} from '../geometry/support/geometryutil'

export default class Parallelogram extends Polygon {
  
  constructor (coordinates) {
    super(coordinates)
  }
  
  get geometryType () {
    return Geometry.PARALLELOGRAM
  }
  
  
  getCoordinateIndex (coord) {
    return this.getCoordinates()[0].findIndex(function(points){
      return points[0] === coord[0] && points[1] === coord[1]
    })
  }
  
  clone () {
    return new Parallelogram(this.getCoordinates())
  }
  
  /**
   *
   * @param coordinates
   * @returns {Array}
   */
  static getTheLastPoint (coordinates) {
    const firstPoint = coordinates[0]
    const secondPoint = coordinates[1]
    const thirdPoint = coordinates[2]
    
    const dx = thirdPoint[0] - secondPoint[0]
    const dy = thirdPoint[1] - secondPoint[1]
    
    return [firstPoint[0] + dx, firstPoint[1] + dy]
  }
  
  
  /**
   * 用于计算和更新平行四边形的顶点
   *
   * @param p 平行四边形对象
   * @param vertex 新移动的点
   * @param oldVertex 上次移动的点
   * @param dragSegment 数据对象
   * @returns {*} 返回新的点集合（3维数组）
   */
  static updateCoordinatesForModification(p, vertex, oldVertex, dragSegment) {
    let dis = 0
    if (oldVertex) {
      dis = distance (oldVertex, vertex)
    }
    
    const oldRingsCoordinates = p.getCoordinates()
    if (dis === 0) {
      return oldRingsCoordinates
    }
    
    const oldCoordinates = oldRingsCoordinates[0]
    const segement = dragSegment[0]
    const edgeIndex = segement.index
  
    let firstCoord
    let nowCood
    let otherCood
    
    if (edgeIndex === 0 || edgeIndex === 4) {
      firstCoord = oldCoordinates[3]
      nowCood = oldCoordinates[0]
      otherCood = oldCoordinates[1]
    } else {
      firstCoord = oldCoordinates[edgeIndex - 1]
      nowCood = oldCoordinates[edgeIndex]
      otherCood = oldCoordinates[edgeIndex + 1]
    }
    
    // 计算延长线上的一点
    const newCood1 = getPointInExtendedLineByDistanceFromAB(firstCoord[0],
      firstCoord[1], nowCood[0], nowCood[1], dis)
    
    // 计算向量
    const tempXX = nowCood[0] - firstCoord[0]
    const tempYY = nowCood[1] - firstCoord[1]
    const tempX2 = vertex[0] - oldVertex[0]
    const tempY2 = vertex[1] - oldVertex[1]
    
    // 使用向量的点积，来计算两个向量的方向是否一致
    // 如果 <0 则表示异向
    const direction = ( tempX2 * tempXX ) + (tempY2 * tempYY)
    
    const dx = newCood1[0] - nowCood[0]
    const dy = newCood1[1] - nowCood[1]
    let newCood2
    
    // 不同方向
    if (direction < 0) {
      newCood1[0] = nowCood[0] - dx
      newCood1[1] = nowCood[1] - dy
  
      newCood2 = [otherCood[0] - dx, otherCood[1] - dy]
    } else {
      newCood2 = [otherCood[0] + dx, otherCood[1] + dy]
    }
    
    
    oldCoordinates[edgeIndex] = newCood1
    oldCoordinates[edgeIndex + 1] = newCood2
    
    if (edgeIndex === 0) {
      oldCoordinates[4] = oldCoordinates[0]
    } else if (edgeIndex === 4 || edgeIndex === 3) {
      oldCoordinates[0] = oldCoordinates[4]
    }
    
    return [oldCoordinates]
  }
  
  
}