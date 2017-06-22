/**
 * Created by zypc on 2016/11/13.
 */
import BaseObject from '../core/BaseObject'
import {ExtentUtil} from './support/ExtentUtil'

export default class Geometry extends BaseObject {

  /**
   * @constructor
   */
  constructor () {
    super()
    
    this._extent = null
  
    this.stride = 2
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  get geometryType () {return Geometry.UNDEFINED}

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * 除去点意外，任何图形都有最小外接矩形
   * @abstrct function
   */
  get extent () { return this._extent }
  
  /**
   * Check if the passed point is contained in extent
   * @param point
   */
  pointInExtent (coordinate) {
    return ExtentUtil.containsPoint(this.extent, coordinate)
  }
  
  /**
   *
   * @param geomtry
   * @returns {boolean}
   */
  intersect (geomtry) { // eslint-disable-line no-unused-vars
    return false
  }
  
  getCoordinates () {}
  
  /**
   *
   * @param x
   * @param y
   */
  containsXY (x, y) {} // eslint-disable-line no-unused-vars
  
  /**
   * 定义move方法
   */
  move (x = 0,y = 0, opts) {} // eslint-disable-line no-unused-vars
  
  /**
   * 定义对图形本身的缩放方法
   * @param scale 缩放比率
   * @param origin 缩放参考点
   */
  scale(scale = 1,origin) {} // eslint-disable-line no-unused-vars
  
  /**
   * 定义图形本身的旋转方法
   */
  rotate(angle,anchor) {} // eslint-disable-line no-unused-vars
  
  /**
   * 创建一个简化后的图形副本
   * @param tolerance
   */
  simplify(tolerance = 1) {} // eslint-disable-line no-unused-vars
 
  /**
   * 将图形转换成json格式
   * @abstrct
   */
  toJSON () {}
  
  /**
   * 克隆一个图形副本
   */
  clone () {}
}

/**
 * 定义几个类型
 * @type {string}
 */
Geometry.POINT = 'point'
Geometry.MULTI_POINT = 'multi_point'
Geometry.LINE = 'line'
Geometry.MULTI_LINE = 'multi_line'
Geometry.POLYGON = 'polygon'
Geometry.MULTI_POLYGON = 'multi_polygon'
Geometry.EXTENT = 'extent'
Geometry.CIRCLE = 'circle'
Geometry.UNDEFINED = 'undefined'
