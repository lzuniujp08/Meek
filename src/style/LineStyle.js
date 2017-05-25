/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'

export default class LineStyle extends BaseObject {

  constructor (color = [255,255,255], alpha = 1, width = 1,
        style = LineStyle.SOLID,lineCap = LineStyle.LineCap.BUTT,
        lineJion = LineStyle.LineJion.MITER,miterLimit = 10) {
    super()

    this.style = style
    this.color = color
    this.alpha = alpha
    this.width = width
    this.lineCap = lineCap
    this.lineJion = lineJion
    this.miterLimit = miterLimit
  }
  
  get style () { return this._style }
  set style (value) { this._style = value }
  
  get color () { return this._color }
  set color (value) { this._color = value }
  
  get alpha () { return this._alpha }
  set alpha (value) { this._alpha = value }
  
  get width () { return this._width }
  set width (value) { this._width = value }
  
  set lineCap (value) { this._lineCap = value }
  get lineCap () { return this._lineCap }
  
  set lineJion (value) { this._lineJion = value }
  get lineJion () { return this._lineJion }
  
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

