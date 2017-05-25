/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import Extent from './Extent'

export default class Polygon extends Geometry {

  constructor (rings = []) {
    super()

    this._rings = []
    
    this.rings = rings
  }

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * 可用来对图形进行拖动、旋转、缩放
   * @abstrct function
   */
  get extent () {
    if (this._extent === null) {
      const rings = this._rings
      let xmin = Number.POSITIVE_INFINITY
      let ymin = Number.POSITIVE_INFINITY
      let xmax = Number.NEGATIVE_INFINITY
      let ymax = Number.NEGATIVE_INFINITY

      for (let ring of rings) {
        for (let point of ring) {
          xmin = Math.min(xmin, point[0])
          ymin = Math.min(ymin, point[1])
          xmax = Math.max(xmax, point[0])
          ymax = Math.max(ymax, point[1])
        }
      }

      this._extent = new Extent(xmin, ymin, xmax, ymax)
    }

    return this._extent
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  get geometryType () { return Geometry.POLYGON }

  /**
   * 设置多边形的边，如果设置了边，则需要重新计算
   * 外接矩形
   */
  get rings () { return this._rings }
  set rings (value) {
    this._rings = value
    this._extent = null
  }
  
  addRing (ring) {
    this.rings.push(ring)
    this._extent = null
  }
  
  /**
   * Detemine if a point is contained in this polygon
   * @param x
   * @param y
   * @param opt
   * @returns {boolean}
   */
  containsXY (x, y, opt) {
    const px = x
    const py = y
    let flag = false
  
    const ring = this.rings[0]
    
    for (let i = 0, l = ring.length, j = l - 1; i < l; j = i, i++) {
      const sx = ring[i][0]
      const sy = ring[i][1]
      const tx = ring[j][0]
      const ty = ring[j][1]
    
      // 点与多边形顶点重合
      if ((sx === px && sy === py) || (tx === px && ty === py)) {
        return true
      }
    
      // 判断线段两端点是否在射线两侧
      if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
        // 线段上与射线 Y 坐标相同的点的 X 坐标
        let x = sx + (py - sy) * (tx - sx) / (ty - sy)
      
        // 点在多边形的边上
        if (x === px) {
          // return 'on';
          return true
        }
      
        // 射线穿过多边形的边界
        if (x > px) {
          flag = !flag
        }
      }
    }
  
    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag
    
  }
  
  clone () {
    return new Polygon(this.rings)
  }
}
