/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'

export default class Feature extends BaseObject {

  constructor (geometry, attributes, style) {
    super()

    this.geometry = geometry
    this.attributes = attributes
    this.style = style

    /**
     * 设置feature是否显示
     * @type {boolean}
     * @private
     */
    this.display = true
    this._styleFunction = undefined
  }

  get geometry () { return this._geometry }
  set geometry (value) {
    this._geometry = value
  }

  get attributes () { return this._attributes }
  set attributes (value) {
    this._attributes = value
  }
  
  get styleFunction () { return this._styleFunction }
  set styleFunction (value) {
    this._styleFunction = value
  }
  
  get style () { return this._style }
  set style (value) { this._style = value }

  /**
   * 设置图层的透明度
   * 将会触发WS的重绘事件
   * @param value
   */
  get display () { return this._display }
  set display (value) {
    if (this._display !== value) {
      this._display = value
      // 需要触动绘制事件派发
    }
  }
}
