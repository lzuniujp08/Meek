/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import Extent from './Extent'
import {ExtentUtil} from './support/ExtentUtil'
import {squaredDistance} from './support/GeometryUtil'

export default class Point extends Geometry {

  /**
   * 根据x和y构建一个点对象
   * @param x 默认值为0
   * @param y 默认值为0
   * @constructor
   */
  constructor (xValue, yValue) {
    super()

    this.x = xValue
    this.y = yValue
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  get geometryType () { return Geometry.POINT }

  /**
   * 获取点的最小外接矩形
   * @note 点是没有最小外接矩形
   * @returns {null}
   */
  get extent () {
    if (!this._extent) {
      const extentObj = ExtentUtil.createScaleExtent(this, 1)
      this._extent = new Extent(extentObj[0], extentObj[1], extentObj[2], extentObj[3])
    }
    
    return this._extent
  }

  /**
   * 获取X坐标值
   * @returns {number}
   */
  get x () { return this._x }
  set x (value) { this._x = value }

  /**
   * 获取y坐标值
   * @returns {number}
   */
  get y () { return this._y }
  set y (value) { this._y = value }

  /**
   * 根据x,y的偏移量得到点
   * @param nx x轴偏移量
   * @param ny y轴偏移量
   * @returns {*} 返回偏移以后的点对象
   */
  offset (nx, ny) {
    return new Point(this.x + nx, this.y + ny)
  }
  
  /**
   *
   * @param x
   * @param y
   * @param opt
   * @returns {boolean}
   */
  containsXY (x, y, opt) {
    const tolerance = opt.tolerance ? opt.tolerance : 2
    const pointA = this
    
    const distance = squaredDistance(pointA.x, pointA.y, x, y)
    if (distance <= tolerance) {
      return true
    }
  
    return false
  }
  
  /**
   * 更新x,y坐标值
   * @param nx x新值
   * @param ny y新值
   */
  update (nx, ny) {
    this.x = nx
    this.y = ny
  }

  /**
   * Determine if two objects should be equal
   * 判断两个图形对象是否相等
   * 判断标准：该图形的所有顶点值是否一致
   * @param geometry
   */
  equal (geom) {
    let equals = false
    if (geom !== null) {
      equals = ((this.x === geom.x && this.y === geom.x) ||
      (isNaN(this.x) && isNaN(this.y) && isNaN(geom.x) && isNaN(geom.y)))
    }
    return equals
  }
  
  /**
   * Clone a point
   * @returns {Point}
   */
  clone () {
    return new Point(this.x, this.y)
  }
}
