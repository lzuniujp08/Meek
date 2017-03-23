/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import MBR from './MBR'

export default class Polygon extends Geometry {

  constructor (rings = []) {
    super()

    this.rings = rings
    this._MBR = null
  }

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * 可用来对图形进行拖动、旋转、缩放
   * @abstrct function
   */
  getMBR () {
    if (this._MBR === null) {
      const rings = this._rings
      let xmin = Number.POSITIVE_INFINITY
      let ymin = Number.POSITIVE_INFINITY
      let xmax = Number.NEGATIVE_INFINITY
      let ymax = Number.NEGATIVE_INFINITY

      for (let ring of rings) {
        for (let point of ring) {
          xmin = Math.min(xmin, point.x)
          ymin = Math.min(ymin, point.y)
          xmax = Math.max(xmax, point.x)
          ymax = Math.max(ymax, point.y)
        }
      }

      this._MBR = new MBR(xmin, ymin, xmax, ymax)
    }

    return this._MBR
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  getGeomType () { return Geometry.POLYGON }

  /**
   * 设置多边形的边，如果设置了边，则需要重新计算
   * 外接矩形
   */
  get rings () { return this._rings }
  set rings (value) {
    this._rings = value
    this._MBR = null
  }
}
