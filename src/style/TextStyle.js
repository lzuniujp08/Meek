/**
 * Created by zhangyong on 2017/6/12.
 */

import BaseObject from '../core/BaseObject'
import FillStyle from './FillStyle'

export default class TextStyle extends BaseObject {
  
  constructor (optOptions) {
    super()
  
    const options = optOptions || {}
  
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
    this.text = options.text
  
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
     * @private
     * @type {number}
     */
    this.offsetY = options.offsetY !== undefined ? options.offsetY : 0
    
  }
  
  get font () { return this._font }
  set font (value) { this._font = value }
  
  get rotation () { return this._rotation }
  set rotation (value) { this._rotation = value }
  
  get rotateWithView () { return this._rotateWithView }
  set rotateWithView (value) { this._rotateWithView = value }
  
  get scale () { return this._scale }
  set scale (value) { this._scale = value }
  
  get text () { return this._text }
  set text (value) { this._text = value }
  
  get textAlign () { return this._textAlign }
  set textAlign (value) { this._textAlign = value }
  
  get textBaseline () { return this._textBaseline }
  set textBaseline (value) { this._textBaseline = value }
  
  get fill () { return this._fill }
  set fill (value) { this._fill = value }
  
  get stroke () { return this._stroke }
  set stroke (value) { this._stroke = value }
  
  get offsetX () { return this._offsetX }
  set offsetX (value) { this._offsetX = value }
  
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