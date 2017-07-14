/**
 * Created by zypc on 2016/11/13.
 */
import BaseObject from '../core/baseobject'
import {ExtentUtil} from './support/extentutil'

/**
 *
 * Abstract base calss is for vector geometries.<br/>
 *
 * 图形基础类，不能直接实例化改类，只能继承和扩展，并实现该类定义的接口
 *
 * @class Geometry
 * @extends BaseObject
 * @module geometry
 * @constructor
 */
export default class Geometry extends BaseObject {

  /**
   * @constructor
   */
  constructor () {
    super()
    
    this._extent = null
  
    /**
     *
     * @type {number}
     */
    this.stride = 2
  }

  /**
   * return the type of goemetry <br/>
   *
   * 获取图形的类型
   *
   * @property geometryType
   * @type String
   */
  get geometryType () {return Geometry.UNDEFINED}

  /**
   * Get an extent of the geometry <br/>
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * 除去点意外，任何图形都有最小外接矩形
   * @property extent
   * @type {Datatang.Extent}
   */
  get extent () { return this._extent }
  
  /**
   * Check if the passed point is contained in extent <br/>
   *
   * 判断传入的点坐标是否在图形内
   *
   * @method pointInExtent
   * @param coordinate {Array} 包含x, y的点数组
   * @return {Boolean} ture returned if success, false otherwise.
   */
  pointInExtent (coordinate) {
    return ExtentUtil.containsPoint(this.extent, coordinate)
  }
  
  /**
   *
   * @method intersect
   * @param geomtry
   * @returns {boolean}
   */
  intersect (geomtry) { // eslint-disable-line no-unused-vars
    return false
  }
  
  /**
   * Get the geometry coordinates
   * <br/> 获取图形的坐标信息
   * @abstract
   * @method getCoordinates
   * @return {Array} 返回坐标数组
   */
  getCoordinates () { return [] }

  /**
   * 计算表单显示的坐标
   *
   *  Calculate a point for displaying Form
   *
   *  @method getFormShowPosition
   *  @param {Number} offsetX 表单显示的 x 偏移量, 默认为 0
   *  @param {Number} offsetY 表单显示的 y 偏移量, 默认为 0
   *  @return {Array} 返回点坐标的数组表达方式
   *  @example
   *
   *      var point = geometry.getFormShowPosition(10, 10)
   *      Form.position = point
   */
  getFormShowPosition (offsetX = 0, offsetY = 0) { return [] } // eslint-disable-line no-unused-vars
  
  /**
   * 计算线的平面内点
   * <br> Calcaluate the interior point
   * @method getFlatInteriorPoint
   * @returns {Array}
   */
  getFlatInteriorPoint () { return [] }
  
  /**
   * Check if contains a point
   * <br/> 判断当前图形是否包含一个点
   * @abstract
   * @method containsXY
   * @param x {Number} x 坐标信息
   * @param y {Number} y 坐标信息
   * @return {Boolean} ture returned if contains, false otherwise
   */
  containsXY (x, y) { return true } // eslint-disable-line no-unused-vars
  
  /**
   * Move the geometry
   * <br/> 移动改图形，移动图形，需要传递x，y的移动量
   * @method move
   * @abstract
   * @param x {Number} x 坐标信息
   * @param y {Number} y 坐标信息
   */
  move (x = 0,y = 0, opts) {} // eslint-disable-line no-unused-vars
  
  /**
   * 定义对图形本身的缩放方法
   * @method scale
   * @abstract
   * @param scale {Number} 缩放比率
   * @param origin {Array} 缩放参考点
   */
  scale(scale = 1,origin) {} // eslint-disable-line no-unused-vars
  
  /**
   * 定义图形本身的旋转方法
   * @method rotate
   * @abstract
   * @param angle {Number} 旋转的角度
    * @param anchor {Object}
   */
  rotate(angle,anchor) {} // eslint-disable-line no-unused-vars
  
  /**
   * 创建一个简化后的图形副本
   * @method simplify
   * @abstract
   * @param tolerance {Number} 阈值
   */
  simplify(tolerance = 1) {} // eslint-disable-line no-unused-vars
 
  /**
   * 将图形转换成json格式
   * @method toJSON
   * @abstrct
   */
  toJSON () {}
  
  /**
   * 克隆一个图形副本
   * @method clone
   * @abstract
   */
  clone () {}
}

/**
 * 点类型
 * @property POINT
 * @static
 * @final
 * @type {String}
 */
Geometry.POINT = 'point'

/**
 * 多点类型
 * @property MULTI_POINT
 * @static
 * @final
 * @type {String}
 */
Geometry.MULTI_POINT = 'multi_point'

/**
 * 线类型
 * @property LINE
 * @static
 * @final
 * @type {String}
 */
Geometry.LINE = 'line'

/**
 * 多线类型
 * @property MULTI_LINE
 * @static
 * @final
 * @type {String}
 */
Geometry.MULTI_LINE = 'multi_line'

/**
 * 多边形类型
 * @property POLYGON
 * @static
 * @final
 * @type {String}
 */
Geometry.POLYGON = 'polygon'

/**
 * 多个多边形类型
 * @property MULTI_POLYGON
 * @static
 * @final
 * @type {String}
 */
Geometry.MULTI_POLYGON = 'multi_polygon'

/**
 * 矩形类型
 * @property EXTENT
 * @static
 * @final
 * @type {String}
 */
Geometry.EXTENT = 'extent'

/**
 * 圆类型
 * @property CIRCLE
 * @static
 * @final
 * @type {String}
 */
Geometry.CIRCLE = 'circle'

/**
 * 未定义
 * @property UNDEFINED
 * @static
 * @final
 * @type {String}
 */
Geometry.UNDEFINED = 'undefined'
