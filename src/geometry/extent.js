/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './geometry'
import {ExtentUtil} from './support/extentutil'

/**
 * 矩形类和数据结构
 *
 * @class Extent
 * @extends Geometry
 * @module geometry
 * @constructor
 * @example
 *
 *  var rect = new Datatang.Extent(10, 10, 500, 500)
 */
export default class Extent extends Geometry {

  /**
   * 构造函数，构建一个extent对象
   *
   * @param xmin {Number}
   * @param ymin {Number}
   * @param xmax {Number}
   * @param ymax {Number}
   *
   */
  constructor (xmin = 0, ymin = 0, xmax = 0, ymax = 0) {
    super()

    this._xmin = xmin
    this._ymin = ymin
    this._xmax = xmax
    this._ymax = ymax
  
    this._rings = []
  }

  /**
   * 获取Geometry的类型
   *
   * @property geometryType
   * @returns {String}
   */
  get geometryType () { return Geometry.EXTENT }

  /**
   * 计算x轴的中心坐标
   *
   * @property centerX
   * @type {Number}
   */
  get centerX () { return (this.xmax + this.xmin) / 2 }

  /**
   * 计算Y轴的中心坐标
   *
   * @property centerY
   * @type {Number}
   */
  get centerY () { return (this.ymax + this.ymin) / 2 }

  /**
   * 计算最小外接矩形的宽
   *
   * @property width
   * @returns {Number}
   */
  get width () { return Math.abs(this.xmax - this.xmin) }

  /**
   * 计算最小外接矩形的高
   *
   * @property height
   * @returns {Number}
   */
  get heigth () { return Math.abs(this.ymax - this.ymin) }

  /**
   * 获取最小外接矩形本对象
   *
   * @property extent
   * @returns {Object} extent
   */
  get extent () { return this }
  
  /**
   * X 轴最小值
   *
   * @property xmin
   * @type {Number}
   */
  get xmin () { return this._xmin }
  set xmin (value) { this._xmin = value }
  
  /**
   * Y 轴最小值
   *
   * @property ymin
   * @type {Number}
   */
  get ymin () { return this._ymin }
  set ymin (value) { this._ymin = value }
  
  /**
   * X 轴最大值
   *
   * @property xmax
   * @type {Number}
   */
  get xmax () { return this._xmax }
  set xmax (value) { this._xmax = value }
  
  /**
   * X 轴最大值
   *
   * @property ymax
   * @type {Number}
   */
  get ymax () { return this._ymax }
  set ymax (value) { this._ymax = value }
  
  
  /**
   * 判断点是否在矩形内
   *
   * @method containsXY
   * @param x {Number}
   * @param y {Number}
   */
  containsXY (x, y) {
    return ExtentUtil.containsPoint(this, [x, y])
  }
  
  /**
   * getFlatInteriorPoint
   * @returns {[*,*]}
   */
  getFlatInteriorPoint () {
    return [this.centerX, this.centerY]
  }
  
  /**
   * 移动矩形通过x，y值
   *
   * @method move
   * @param x {Number}
   * @param y {Number}
   */
  move (x = 0, y = 0, opts) {
    const coordinate = this.getCoordinates()
  
    let beyond
    if (opts) {
      if (opts.beyond) {
        beyond = opts.beyond
      }
    }
    let minPoint
    const width = this.width
    const height = this.heigth

    if(coordinate[0][1] > coordinate[3][1]){
      minPoint = coordinate[3]
    }else {
      minPoint = coordinate[0]
    }

    const newMinPoint = new Array(2)
    
    newMinPoint[0] = minPoint[0] + x
    newMinPoint[1] = minPoint[1] + y
    
    if (beyond) {
      if (minPoint[0] < beyond.xmin) {
        minPoint[0] = beyond.xmin
        newMinPoint[0] = minPoint[0]
      }
      
      if (minPoint[0] + width + x >= beyond.xmax) {
        newMinPoint[0] = minPoint[0]
      }
  
      if (minPoint[1] < beyond.ymin) {
        minPoint[1] = beyond.ymin
        newMinPoint[1] = minPoint[1]
      }
  
      if (minPoint[1] + height + y >= beyond.ymax) {
        newMinPoint[1] = minPoint[1]
      }
    }
  
    const newCoordiante = [
      newMinPoint,
      [newMinPoint[0] + width, newMinPoint[1]],
      [newMinPoint[0] + width, newMinPoint[1] + height],
      [newMinPoint[0], newMinPoint[1] + height],
      newMinPoint]
    
    this.setCoordinates(newCoordiante)
  }
  
  /**
   * 设置多边形的边，如果设置了边，则需要重新计算
   * 外接矩形
   *
   * @method rings
   * @returns {Array}
   */
  get rings () {
    if (this._rings.length === 0) {
      if (this.xmin !== 0 && this.ymin !== 0 && this.xmax !== 0 && this.ymax !== 0) {
        this._rings = ExtentUtil.minMaxToRing(this.xmin, this.ymin, this.xmax, this.ymax)
      }
    }
    
    return this._rings
  }

  set rings (value) {
    this._rings = value
    let extentArr = ExtentUtil.boundingSimpleExtent(value)
    this.xmin = extentArr[0]
    this.ymin = extentArr[1]
    this.xmax = extentArr[2]
    this.ymax = extentArr[3]
  }
  
  /**
   * 获取图形的坐标数据
   *
   * @method getCoordinates
   * @returns {[*,*]}
   */
  getCoordinates () {
    if (this._rings.length === 0) {
      if (this.xmin !== 0 && this.ymin !== 0 && this.xmax !== 0 && this.ymax !== 0) {
        this._rings = ExtentUtil.minMaxToRing(this.xmin, this.ymin, this.xmax, this.ymax)
      }
    }
  
    return this._rings
  }

  /**
   * 根据得到的坐标点，计算出表单显示的位置
   *
   * @param {Number} offsetX x的偏移量
   * @param {Number} offsetY y的偏移量
   * @returns {[*,*]}
   */
  getFormShowPosition (offsetX = 0, offsetY = 0) {
    return [( this.xmin + this.xmax ) / 2 - offsetX, this.ymin - offsetY]
  }
  
  /**
   * 设置坐标数据
   *
   * @method setCoordinates
   * @param coordinates
   */
  setCoordinates (coordinates) {
    this.rings = coordinates
  
    let extentArr = ExtentUtil.boundingSimpleExtent(coordinates)
    this.xmin = extentArr[0]
    this.ymin = extentArr[1]
    this.xmax = extentArr[2]
    this.ymax = extentArr[3]
  }
  
  /**
   * 获取点位于图形坐标点的下标
   *
   * @method getCoordinateIndex
   * @param coord {Array}
   * @returns {Number}
   */
  getCoordinateIndex (coord) {
    return this.getCoordinates().findIndex(function(points){
      return points[0] === coord[0] && points[1] === coord[1]
    })
  }
  
  /**
   * 克隆矩形框
   *
   * @method clone
   * @returns {Extent}
   */
  clone () {
    return new Extent(this.xmin, this.ymin, this.xmax, this.ymax)
  }
  
}

