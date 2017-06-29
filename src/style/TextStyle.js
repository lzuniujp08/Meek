/**
 * Created by zhangyong on 2017/6/12.
 */

import BaseStyle from './BaseStyle'
import FillStyle from './FillStyle'

/**
 * The text style for geometrys
 *
 * <br/> 定义文本样式
 *
 * @class TextStyle
 * @extends BaseStyle
 * @module style
 * @constructor
 */
export default class TextStyle extends BaseStyle {
  
  /**
   *
   * @constructor
   * @param optOptions
   */
  constructor (optOptions) {
    super()
  
    const options = optOptions || {}
  
    /**
     *
     */
    this.text = options.text
    
    /**
     * @private
     * @type {string|undefined}
     */
    this.font = options.font
  
    /**
     * @private
     * @type {number|undefined}
     */
    this.rotation = options.rotation
  
    /**
     * @private
     * @type {boolean|undefined}
     */
    this.rotateWithView = options.rotateWithView
  
    /**
     * @private
     * @type {number|undefined}
     */
    this.scale = options.scale
  
    /**
     * @private
     * @type {string|undefined}
     */
    this.textAlign = options.textAlign
  
    /**
     * @private
     * @type {string|undefined}
     */
    this.textBaseline = options.textBaseline
  
    /**
     * @private
     * @type {ol.style.Fill}
     */
    this.fill = options.fill !== undefined ? options.fill :
      new FillStyle({color: TextStyle.DEFAULT_FILL_COLOR})
  
    /**
     * @private
     * @type {ol.style.Stroke}
     */
    this.stroke = options.stroke !== undefined ? options.stroke : null
  
    /**
     * @private
     * @type {number}
     */
    this.offsetX = options.offsetX !== undefined ? options.offsetX : 0
  
    /**
     * @property offsetY
     * @type {number}
     */
    this.offsetY = options.offsetY !== undefined ? options.offsetY : 0
    
  }
  
  /**
   * @property text
   * @type {Stirng}
   */
  get text () { return this._text }
  set text (value) { this._text = value }
  
  /**
   * @property font
   * @type {Stirng}
   */
  get font () { return this._font }
  set font (value) { this._font = value }
  
  /**
   * @property rotation
   * @type {Stirng}
   */
  get rotation () { return this._rotation }
  set rotation (value) { this._rotation = value }
  
  /**
   * @property rotateWithView
   * @type {Stirng}
   */
  get rotateWithView () { return this._rotateWithView }
  set rotateWithView (value) { this._rotateWithView = value }
  
  /**
   * @property scale
   * @type {Stirng}
   */
  get scale () { return this._scale }
  set scale (value) { this._scale = value }
  
  /**
   * @property textAlign
   * @type {Stirng}
   */
  get textAlign () { return this._textAlign }
  set textAlign (value) { this._textAlign = value }
  
  /**
   * @property textBaseline
   * @type {Stirng}
   */
  get textBaseline () { return this._textBaseline }
  set textBaseline (value) { this._textBaseline = value }
  
  /**
   * @property fill
   * @type {Stirng}
   */
  get fill () { return this._fill }
  set fill (value) { this._fill = value }
  
  /**
   * @property stroke
   * @type {Stirng}
   */
  get stroke () { return this._stroke }
  set stroke (value) { this._stroke = value }
  
  /**
   * @property offsetX
   * @type {Stirng}
   */
  get offsetX () { return this._offsetX }
  set offsetX (value) { this._offsetX = value }
  
  /**
   * @property offsetY
   * @type {Stirng}
   */
  get offsetY () { return this._offsetY }
  set offsetY (value) { this._offsetY = value }
  
  /**
   * Clone a text style
   * @returns {TextStyle}
   */
  clone () {
    return new TextStyle({
      font: this.font,
      rotation: this.rotation,
      rotateWithView: this.rotateWithView,
      scale: this.scale,
      text: this.text,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      fill: this.fill ? this.fill.clone : undefined,
      stroke: this.stroke ? this.stroke.clone : undefined,
      offsetX: this.offsetX,
      offsetY: this.offsetY
    })
  }
}

/**
 * Default fill color for text style
 * @type {string}
 * @private
 */
TextStyle.DEFAULT_FILL_COLOR = '#333'