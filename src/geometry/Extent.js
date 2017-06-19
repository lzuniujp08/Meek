/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import {ExtentUtil} from './support/ExtentUtil'

export default class Extent extends Geometry {

  /**
   * 构建一个extent对象
   * @param xmin
   * @param ymin
   * @param xmax
   * @param ymax
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
   * 获取对象的几何类型
   * @abstrct function
   */
  get geometryType () { return Geometry.EXTENT }

  /**
   * 计算最小外接矩形(MBR)的中心点
   * @returns {*} 返回一个Point对象
   */
  get centerPoint () {
    // return new Point(this.centerX, this.centerY)
  }

  /**
   * 计算X坐标的中心
   * @returns {number}
   */
  get centerX () { return (this.xmax + this.xmin) / 2 }

  /**
   * 计算Y坐标的中心
   * @returns {number}
   */
  get centerY () { return (this.ymax + this.ymin) / 2 }

  /**
   * 计算最小外接矩形的宽
   * @returns {number}
   */
  get width () { return Math.abs(this.xmax - this.xmin) }

  /**
   * 计算最小外接矩形的高
   * @returns {number}
   */
  get heigth () { return Math.abs(this.ymax - this.ymin) }

  /**
   * 获取最小外接矩形
   * 本对象
   * @returns {MBR}
   */
  get extent () { return this }

  get xmin () { return this._xmin }
  set xmin (value) { this._xmin = value }

  get ymin () { return this._ymin }
  set ymin (value) { this._ymin = value }

  get xmax () { return this._xmax }
  set xmax (value) { this._xmax = value }

  get ymax () { return this._ymax }
  set ymax (value) { this._ymax = value }
  
  
  /**
   * Check if contains a point
   * @param x
   * @param y
   */
  containsXY (x, y) {
    return ExtentUtil.containsPoint(this, [x, y])
  }
  
  getFlatInteriorPoint () {
    return [this.centerX, this.centerY]
  }
  
  /**
   * 设置多边形的边，如果设置了边，则需要重新计算
   * 外接矩形
   */
  get rings () {
    if (this._rings.length === 0) {
      if (this.xmin !== 0 && this.ymin !== 0 && this.xmax !== 0 && this.ymax !== 0) {
        this._rings = ExtentUtil.minMaxToRing(this.xmin, this.ymin, this.xmax, this.ymax)
      }
    }
    
    return this._rings
  }
  
  /**
   *
   * @param value
   */
  set rings (value) {
    this._rings = value
    let extentArr = ExtentUtil.boundingSimpleExtent(value[0])
    this.xmin = extentArr[0]
    this.ymin = extentArr[1]
    this.xmax = extentArr[2]
    this.ymax = extentArr[3]
  }
  
  /**
   * Get the collection of geometry
   * TODO 将来都需要换成这种线性的存储方式，并逐步替换成这种模式
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
   *
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
   * Get index in this coordinates by given coordinate
   * @param coord
   * @returns {*|number}
   */
  getCoordinateIndex (coord) {
    return this.getCoordinates().findIndex(function(points){
      return points[0] === coord[0] && points[1] === coord[1]
    })
  }
  
  /**
   * Clone an extent
   * @returns {Extent}
   */
  clone () {
    return new Extent(this.xmin, this.ymin, this.xmax, this.ymax)
  }
  
}

