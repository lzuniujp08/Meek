/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import LineStyle from './LineStyle'

export default class FillStyle extends BaseObject {

  /**
   * 构建一个面样式
   * 面样式由填充样式和边框样式组成
   * @constructor
   * @param style 备有接口，以后扩充面的填充样式
   * @param color 面的填充颜色
   * @param alpha 免得填充透明度
   * @param borderStyle LineStyle对象，指定面样式的边框对象属性
   */
  constructor (color = [255,255,255], borderStyle = null,alpha = 1,size = 14,style = FillStyle.SOLID) {
    super()

    this._style = style
    this._color = color
    this._alpha = alpha
    this._size = size
    this._borderStyle = borderStyle
  }
  
  get style () { return this._style}
  set style (value) { return this._style = value }
  
  get color () { return this._color}
  set color (value) { return this._color = value }
  
  get alpha () { return this._alpha}
  set alpha (value) { return this._alpha = value }
  
  get borderStyle () { return this._borderStyle}
  set borderStyle (value) { return this._borderStyle = value }
  
  get size(){ return this._size }
  set size(value){ this._size = value}
  
  clone () {
    return new FillStyle(this.color, this.borderStyle.clone(),
      this.alpha, this.size, this.style)
  }
  
}

FillStyle.SOLID = 'solid'