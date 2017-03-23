/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import MBR from './MBR'

export default class Line extends Geometry {

  constructor (path) {
    super()
    this._paths = path
    this._MBR = null
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  get geomType () { return Geometry.LINE }

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * @returns {null} 返回对象的最小外接矩形
   */
  get MBR () {
    const me = this
    if (me._MBR === null) {
      let xmin = Number.POSITIVE_INFINITY
      let ymin = Number.POSITIVE_INFINITY
      let xmax = Number.NEGATIVE_INFINITY
      let ymax = Number.NEGATIVE_INFINITY

      for (let path of me._paths) {
        for (let point of path) {
          xmin = Math.min(xmin, point.x)
          ymin = Math.min(ymin, point.y)
          xmax = Math.max(xmax, point.x)
          ymax = Math.max(ymax, point.y)
        }
      }

      me._MBR = new MBR(xmin, ymin, xmax, ymax)
    }

    return me._MBR
  }

  get path () { return this._path }
  set path (value) {
    this._paths = value
    this._MBR = null
  }
}
