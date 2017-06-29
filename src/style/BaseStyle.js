/**
 * Created by zhangyong on 2017/6/13.
 */

import BaseObject from '../core/BaseObject'

/**
 * Abstract base class; normally only used for createing subclasses and not
 * instantiated in apps.
 * Base class for styling geometries.
 *
 * <br/>定义基础样式类
 *
 * @class BaseStyle
 * @extends BaseObject
 * @module style
 * @constructor
 */
export default class BaseStyle extends BaseObject {

  /**
   *
   * @constructor
   * @param color
   * @param style
   * @param alpha
   */
  constructor (color, style, alpha) {
    
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
   * @protected
   * @property color
   */
  get color () { return this._color }
  set color (value) { this._color = value }
  
  /**
   * @protected
   * @property style
   */
  get style () { return this._style }
  set style (value) { this._style = value }
  
  /**
   * @protected
   * @property alpha
   */
  get alpha () { return this._alpha}
  set alpha (value) { return this._alpha = value }
  
  /**
   * @protected
   * @property textStyle
   */
  get textStyle () { return this._textStyle }
  set textStyle (value) { this._textStyle = value }
  
  /**
   * @method clone
   * @abstract
   */
  clone () {}
  
}
  