/**
 * Created by zhangyong on 2017/6/12.
 */

import BaseStyle from './BaseStyle'
import FillStyle from './FillStyle'

/**
 * The text style for geometrys
 *
 * 定义文本样式
 *
 * @class TextStyle
 * @extends BaseStyle
 * @module style
 * @constructor
 * @example
 *
 *     new Datatang.TextStyle({
 *       textAlign: 'center',
 *       textBaseline: 'middle',
 *       font: 'Arial',
 *       text: '标注示例',
 *       fill: [255, 0, 0],
 *       stroke: new Datatang.LineStyle([255, 255, 255],1,3,
 *          Datatang.LineStyle.LineCap.ROUND,
 *          Datatang.LineStyle.LineJion.ROUND),
 *       offsetX: 0,
 *       offsetY: 0,
 *       rotation: 0
 *     });
 *
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
   * 要显示的文本
   * @property text
   * @type {Stirng}
   */
  get text () { return this._text }
  set text (value) { this._text = value }
  
  /**
   * 显示的字体
   * @property font
   * @type {Stirng}
   */
  get font () { return this._font }
  set font (value) { this._font = value }
  
  /**
   * 旋转的角度
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
   * 缩放比例
   * @property scale
   * @type {Stirng}
   */
  get scale () { return this._scale }
  set scale (value) { this._scale = value }
  
  /**
   * 字体
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
   * 字体颜色
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
   * 字体x轴偏移
   * @property offsetX
   * @type {Stirng}
   */
  get offsetX () { return this._offsetX }
  set offsetX (value) { this._offsetX = value }
  
  /**
   * 字体y轴偏移
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
 *
 * 默认字体颜色
 * @type {String}
 * @static
 * @final
 */
TextStyle.DEFAULT_FILL_COLOR = '#333'