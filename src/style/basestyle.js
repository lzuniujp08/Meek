/**
 * Created by zhangyong on 2017/6/13.
 */

import BaseObject from '../core/baseobject'
//
// Abstract base class; normally only used for createing subclasses and not
// instantiated in apps.
// Base class for styling geometries.

/**
 * 定义基础样式类，包括了一些基础的属性，如颜色、对象样式、透明度
 *
 * @class BaseStyle
 * @extends BaseObject
 * @module style
 */
export default class BaseStyle extends BaseObject {

  /**
   *
   * @constructor
   * @param color {Array}
   * @param style {Object}
   * @param alpha {Number}
   */
  constructor (color, style, alpha = 1) {
    
    super()
    
    /**
     * The color to fill or stroke geometry
     */
    this.color = color
    
    /**
     * Which style to style geometry
     */
    this.style = style
    
    /**
     *
     */
    this.alpha = alpha
    
    /**
     * The text displayed with geometry
     * @type {null}
     */
    this.textStyle = null
  }
  
  /**
   * 颜色
   *
   * @property color
   * @type {Array}
   */
  get color () { return this._color }
  set color (value) { this._color = value }
  
  /**
   * 样式对象
   *
   * @property style
   * @type {Datatang.Style}
   */
  get style () { return this._style }
  set style (value) { this._style = value }
  
  /**
   * 透明度
   *
   * @property alpha
   * @default 1
   * @type {Number}
   */
  get alpha () { return this._alpha}
  set alpha (value) { return this._alpha = value }
  
  /**
   * 文本样式对象
   *
   * @property textStyle
   */
  get textStyle () { return this._textStyle }
  set textStyle (value) { this._textStyle = value }
  
  /**
   * 克隆一个样式对象
   *
   * @method clone
   * @abstract
   */
  clone () {}
  
}
  