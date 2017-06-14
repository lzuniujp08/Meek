/**
 * Created by zypc on 2016/11/15.
 */

import BaseStyle from './BaseStyle'

export default class FillStyle extends BaseStyle {

  /**
   * 构建一个面样式
   * 面样式由填充样式和边框样式组成
   * @constructor
   * @param style 备有接口，以后扩充面的填充样式
   * @param color 面的填充颜色
   * @param alpha 免得填充透明度
   * @param borderStyle LineStyle对象，指定面样式的边框对象属性
   */
  constructor (color = [255,255,255], borderStyle = null,alpha = 1,style = FillStyle.SOLID) {
    super(color, style, alpha)

    this._borderStyle = borderStyle
  }
  
  
  get borderStyle () { return this._borderStyle}
  set borderStyle (value) { return this._borderStyle = value }
  
  clone () {
    return new FillStyle(this.color, this.borderStyle.clone(),
      this.alpha, this.size, this.style)
  }
  
}

FillStyle.SOLID = 'solid'