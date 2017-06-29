/**
 * Created by zypc on 2016/11/13.
 */
import BaseObject from '../core/BaseObject'
import {ExtentUtil} from './support/ExtentUtil'

/**
 *
 * Abstract base calss is for vector geometries.<br/>
 *
 * 图形基础类
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
   * @type Extent
   */
  get extent () { return this._extent }
  
  /**
   * Check if the passed point is contained in extent <br/>
   *
   * 判断传入的点坐标是否在图形内
   *
   * @method pointInExtent
   * @param coordinate
   * @return ture returned if success, otherwise false.
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
   * @abstract
   * @method getCoordinates
   */
  getCoordinates () {}
  
  /**
   * @abstract
   * @method containsXY
   * @param x
   * @param y
   */
  containsXY (x, y) {} // eslint-disable-line no-unused-vars
  
  /**
   * Move the geometry
   * @method move
   * @abstract
   * @param x number
   * @param y number
   */
  move (x = 0,y = 0, opts) {} // eslint-disable-line no-unused-vars
  
  /**
   * 定义对图形本身的缩放方法
   * @method scale
   * @abstract
   * @param scale Number 缩放比率
   * @param origin Array 缩放参考点
   */
  scale(scale = 1,origin) {} // eslint-disable-line no-unused-vars
  
  /**
   * 定义图形本身的旋转方法
   * @method rotate
   * @abstract
   * @param angle Number
   * @param anchor
   */
  rotate(angle,anchor) {} // eslint-disable-line no-unused-vars
  
  /**
   * 创建一个简化后的图形副本
   * @method simplify
   * @abstract
   * @param tolerance
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
 * 定义图形的类型
 * @property POINT
 * @static
 * @type String
 */
Geometry.POINT = 'point'

/**
 * @property MULTI_POINT
 * @static
 * @type {string}
 */
Geometry.MULTI_POINT = 'multi_point'

/**
 * @property LINE
 * @static
 * @type {string}
 */
Geometry.LINE = 'line'

/**
 * @property MULTI_LINE
 * @static
 * @type {string}
 */
Geometry.MULTI_LINE = 'multi_line'

/**
 * @property POLYGON
 * @static
 * @type {string}
 */
Geometry.POLYGON = 'polygon'

/**
 * @property MULTI_POLYGON
 * @static
 * @type {string}
 */
Geometry.MULTI_POLYGON = 'multi_polygon'

/**
 * @property EXTENT
 * @static
 * @type {string}
 */
Geometry.EXTENT = 'extent'

/**
 * @property CIRCLE
 * @static
 * @type {string}
 */
Geometry.CIRCLE = 'circle'

/**
 * @property UNDEFINED
 * @static
 * @type {string}
 */
Geometry.UNDEFINED = 'undefined'
