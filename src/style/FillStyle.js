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
  constructor (style = 'solid', color = 0, alpha = 1, borderStyle = null) {
    super()

    this._style = style
    this._color = color
    this._alpha = alpha
    this._borderStyle = new LineStyle()
  }
}
