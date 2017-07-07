/**
 * Created by zypc on 2016/11/15.
 */

import BaseStyle from './baseStyle'

/**
 * The polygon style
 *
 * 定义多边形样式，多边形样式包括<b>填充样式</b>和<b>边框样式</b>，
 * 需要分别设置
 *
 * @class FillStyle
 * @extends BaseStyle
 * @module style
 * @constructor
 * @example
 *
 *     var fillStyle = new Datatang.FillStyle([255,255,255],
 *         new Datatang.LineStyle([0,0,255],1,1.25),0.5)
 *
 */
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
  
  /**
   * 边框样式对象
   * @property borderStyle
   * @type {Datatang.LineStyle}
   */
  get borderStyle () { return this._borderStyle}
  set borderStyle (value) { return this._borderStyle = value }
  
  /**
   *
   * @returns {FillStyle}
   */
  clone () {
    return new FillStyle(this.color, this.borderStyle.clone(),
      this.alpha, this.size, this.style)
  }
  
}

/**
 * 实体填充
 * @static
 * @final
 * @property SOLID
 * @type {string}
 */
FillStyle.SOLID = 'solid'