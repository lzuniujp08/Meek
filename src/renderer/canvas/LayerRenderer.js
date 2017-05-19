/**
 * Created by zhangyong on 2017/3/20.
 */

import BaseObject from '../../core/BaseObject'

export default class LayerRenderer extends BaseObject {
  
  constructor (layer,context) {
    super()
    
    this._context = context
    this._layer = layer
  }
  
  /**
   *
   * @returns {*}
   */
  get layer () { return this._layer }
  get context () {return this._context}
  
  /**
   * 渲染准备工作
   * 1、找到渲染器
   * 2、转换坐标系统
   * 3、
   */
  prepareFrame () {}
  
  /**
   *
   */
  composeFrame () {}
  
}