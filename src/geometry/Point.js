/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import Extent from './Extent'
import {ExtentUtil} from './support/ExtentUtil'
import {squaredDistance} from './support/GeometryUtil'


/**
 * Point geometry. <br/>
 *
 * 定义点类和数据结构
 *
 * @class Point
 * @extends Geometry
 * @module geometry
 * @constructor
 * @example
 *
 *  var point = new Datatang.Point(100, 100)
 */
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
   * @protected
   */
  get geometryType () { return Geometry.POINT }

  /**
   * 获取点的最小外接矩形
   * @note 点是没有最小外接矩形
   * @returns {null}
   */
  get extent () {
    if (!this._extent) {
      const extentObj = ExtentUtil.createScaleExtent(this, 8)
      this._extent = new Extent(extentObj[0], extentObj[1], extentObj[2], extentObj[3])
    }
    
    return this._extent
  }

  /**
   * 获取 X 坐标值
   * @property x
   * @type x {number}
   */
  get x () { return this._x }
  set x (value) { this._x = value }
  
  /**
   * 获取 Y 坐标值
   * @property y
   * @type {number}
   */
  get y () { return this._y }
  set y (value) { this._y = value }

  /**
   * 根据x,y的偏移量得到点
   * @method offset
   * @param nx x轴偏移量
   * @param ny y轴偏移量
   * @returns {Datatang.Point} 返回偏移以后的点对象
   */
  offset (nx, ny) {
    return new Point(this.x + nx, this.y + ny)
  }
  
  /**
   * @method containsXY
   * @param x
   * @param y
   * @param opt
   * @returns {boolean}
   */
  containsXY (x, y, opt) {
    const tolerance = opt.tolerance ? opt.tolerance : 2
    const pointA = this

    const distance = squaredDistance(pointA.x, pointA.y, x, y)
    if (Math.sqrt(distance/2) <= tolerance) {
      return true
    }

    return false
  }

  /**
   * 更新x,y坐标值
   * @method update
   * @param nx x新值
   * @param ny y新值
   */
  update (nx, ny) {
    this.x = nx
    this.y = ny
    
    this._extent = null
  }
  
  /**
   *
   * @method getFlatInteriorPoint
   * @returns {[]}
   */
  getFlatInteriorPoint () {
    return this.getCoordinates()
  }
  
  /**
   * Get the collection of geometry
   * @method getCoordinates
   * @returns {[]}
   */
  getCoordinates () {
    return [this.x, this.y]
  }

  /**
   * Get the position of geometry
   * @method formShowPosition
   * @return {[]}
   */
  formShowPosition (offsetX = 10, offsetY = 10) {
    return [this.x, this.y - offsetY]
  }

  
  /**
   * set coordinates to point
   * @method setCoordinates
   * @param coordinates
   */
  setCoordinates (coordinates) {
    this.update(coordinates[0], coordinates[1])
    this.changed()
  }
  
  /**
   * @method getCoordinateIndex
   * @returns {number}
   */
  getCoordinateIndex () {
    return 0
  }
  
  /**
   * Determine if two objects should be equal <br/>
   * 判断两个图形对象是否相等
   * 判断标准：该图形的所有顶点值是否一致
   * @method equal
   * @param geometry
   * @return {Boolean}
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
