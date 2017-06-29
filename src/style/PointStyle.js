/**
 * Created by zypc on 2016/11/15.
 */

import BaseStyle from './BaseStyle'

/**
 * The point style
 *
 * <br/>定义一个点图形的样式
 *
 * @class PointStyle
 * @extends BaseStyle
 * @module style
 * @constructor
 */
export default class PointStyle extends BaseStyle {

  /**
   * 构建一个点样式对象
   * @param style 点样式，{circle|square|cross|x|triangle}其中的一种
   * @param size 点的大小，默认15
   * @param color
   * @param alpha
   * @param xoffset
   * @param yoffset
   * @param angle
   */
  constructor (size = 15, color = [255,0,0], alpha = 1,borderStyle = null,
               xoffset = 0, yoffset = 0, angle = 0, style = PointStyle.CIRCLE) {
    super(color, style, alpha)

    this._size = size
    this._xoffset = xoffset
    this._yoffset = yoffset
    this._angle = angle
    this._borderStyle = borderStyle
  }
  
  clone () {
    return new PointStyle(this.size, this.color, this.alpha,
       this.borderStyle.clone(), this.xoffset, this.yoffset, this.angle, this.style)
  }
  
  /**
   * @property size
   * @type {Number}
   */
  get size(){ return this._size }
  set size(value){ this._size = value}
  
  /**
   * @property xoffset
   * @type {Number}
   */
  get xoffset(){ return this._xoffset }
  set xoffset(value){ this._xoffset = value}
  
  /**
   * @property yoffset
   * @type {Number}
   */
  get yoffset(){ return this._yoffset }
  set yoffset(value){ this._yoffset = value}
  
  /**
   * @property angle
   * @type {Number}
   */
  get angle(){ return this._angle }
  set angle(value){ this._angle = value}
  
  /**
   * @property borderStyle
   * @type {LineStyle}
   */
  get borderStyle(){ return this._borderStyle }
  set borderStyle(value){ this._borderStyle = value}
  
}

/**
 * @static
 * @property CIRCLE
 * @type {string}
 */
PointStyle.CIRCLE = 'circle'

/**
 * @static
 * @property SQUARE
 * @type {string}
 */
PointStyle.SQUARE = 'square'

/**
 * @static
 * @property CROSS
 * @type {string}
 */
PointStyle.CROSS = 'cross'

/**
 * @static
 * @property X
 * @type {string}
 */
PointStyle.X = 'x'

/**
 * @static
 * @property TRIANGLE
 * @type {string}
 */
PointStyle.TRIANGLE = 'triangle'
