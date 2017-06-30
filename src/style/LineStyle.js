/**
 * Created by zypc on 2016/11/15.
 */

import BaseStyle from './BaseStyle'

/**
 * The line style
 *
 * 定义一个线图形的样式
 *
 * @class LineStyle
 * @extends BaseStyle
 * @module style
 * @constructor
 * @example
 *
 *     var lineStye = new Datatang.LineStyle([0, 0, 255],1,3,
 *        Datatang.LineStyle.LineCap.ROUND,
 *        Datatang.LineStyle.LineJion.ROUND)
 */
export default class LineStyle extends BaseStyle {
  
  /**
   *
   * @param color
   * @param alpha
   * @param width
   * @param style
   * @param lineCap
   * @param lineJion
   * @param miterLimit
   */
  constructor (color = [255,255,255], alpha = 1, width = 1,
        style = LineStyle.SOLID,lineCap = LineStyle.LineCap.BUTT,
        lineJion = LineStyle.LineJion.MITER,miterLimit = 10) {
    super(color, style, alpha)

    this.width = width
    this.lineCap = lineCap
    this.lineJion = lineJion
    this.miterLimit = miterLimit
  }
  
  /**
   * 线宽
   * @property width
   * @type {Number}
   */
  get width () { return this._width }
  set width (value) { this._width = value }
  
  /**
   * 线的末端样式
   * @property lineCap
   * @type {Number}
   */
  set lineCap (value) { this._lineCap = value }
  get lineCap () { return this._lineCap }
  
  /**
   * 交叉线时的样式
   * @property lineJion
   * @type {Number}
   */
  set lineJion (value) { this._lineJion = value }
  get lineJion () { return this._lineJion }
  
  /**
   * @property miterLimit
   * @type {Number}
   */
  set miterLimit (value) { this._miterLimit = value }
  get miterLimit () { return this._miterLimit }
  
  clone () {
    return new LineStyle(this.color, this.alpha, this.width,
      this.style, this.lineCap, this.lineJion, this.miterLimit)
  }
}

/**
 * 定义线的样式
 * @type {string}
 */
LineStyle.SOLID = 'solid'

/**
 * TODO 由郭靖来处理，参考 PointStyle
 * @type {string}
 */
LineStyle.DASH = 'dash'

LineStyle.DOT = 'dot'

LineStyle.DASHDOT = 'dashdot'

LineStyle.DASHDOTDOT = 'dashdotdot'

LineStyle.NULL = 'none'

LineStyle.LineCap = {
  BUTT: 'butt',
  ROUND: 'round',
  SQUARE: 'square'
}

// visit http://www.w3school.com.cn/tags/canvas_linejoin.asp for more infomation
LineStyle.LineJion = {
  MITER: 'miter',// 默认，创建尖角
  BEVEL: 'bevel',
  ROUND: 'round'
}

