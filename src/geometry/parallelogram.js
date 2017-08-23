/**
 * Created by zhangyong on 2017/8/23.
 */

import Geometry from './geometry'
import Polygon from './polygon'
import Extent from './extent'

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
  
  // get extent () {
  //   if (this._extent === null) {
  //     let coordinates = this.getCoordinates()
  //     if (Array.isArray(coordinates)) {
  //       coordinates = coordinates[0]
  //     }
  //
  //     let xmin = Number.POSITIVE_INFINITY
  //     let ymin = Number.POSITIVE_INFINITY
  //     let xmax = Number.NEGATIVE_INFINITY
  //     let ymax = Number.NEGATIVE_INFINITY
  //
  //     for (let point of coordinates) {
  //       xmin = Math.min(xmin, point[0])
  //       ymin = Math.min(ymin, point[1])
  //       xmax = Math.max(xmax, point[0])
  //       ymax = Math.max(ymax, point[1])
  //     }
  //
  //     this._extent = new Extent(xmin, ymin, xmax, ymax)
  //   }
  //
  //   return this._extent
  // }
  
  
  // /**
  //  * Detemine if a point is contained in this polygon
  //  * @param x
  //  * @param y
  //  * @param opt
  //  * @returns {boolean}
  //  */
  // containsXY (x, y) {
  //   const px = x
  //   const py = y
  //   let flag = false
  //
  //   const ring = this.getCoordinates()
  //
  //   for (let i = 0, l = ring.length, j = l - 1; i < l; j = i, i++) {
  //     const sx = ring[i][0]
  //     const sy = ring[i][1]
  //     const tx = ring[j][0]
  //     const ty = ring[j][1]
  //
  //     // 点与多边形顶点重合
  //     if ((sx === px && sy === py) || (tx === px && ty === py)) {
  //       return true
  //     }
  //
  //     // 判断线段两端点是否在射线两侧
  //     if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
  //       // 线段上与射线 Y 坐标相同的点的 X 坐标
  //       let x = sx + (py - sy) * (tx - sx) / (ty - sy)
  //
  //       // 点在多边形的边上
  //       if (x === px) {
  //         // return 'on';
  //         return true
  //       }
  //
  //       // 射线穿过多边形的边界
  //       if (x > px) {
  //         flag = !flag
  //       }
  //     }
  //   }
  //
  //   // 射线穿过多边形边界的次数为奇数时点在多边形内
  //   return flag
  // }
  
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
  
  
}