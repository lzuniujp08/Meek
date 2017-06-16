/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import {listen, unlistenByKey} from '../core/EventManager'
import {EventType} from '../meek/EventType'

export default class BaseLayer extends BaseObject {

  constructor (options) {
    super()

    const baseOptions = Object.assign({},options)
    
    this._name = ''
    this.visible = true
    this.datasource = []
    this.opacity = baseOptions.opacity !== undefined ? options.opacity : 1
    this.dataExtent = null
    this.maxResolution = 0
    this.minResolution = 0
    this.zIndex = baseOptions.zIndex || 0

    this._mapRenderKey = null
    
  }

  // -------------------------------------------------
  // getter and setter
  // -------------------------------------------------
  get map () { return this._map }
  set map (value) {
    if (this._mapRenderKey) {
      unlistenByKey(this._mapRenderKey)
      this._mapRenderKey = null
    }

    if (value) {
      this._map = value
      this._mapRenderKey = listen(this, EventType.CHANGE, value.render, value)
      this._map.addLayer(this)
      this.changed()
    }
  }

  /**
   * 设置图层是否显示
   * 将会触发的重绘事件
   * @param value
   */
  get visible () { return this._visible }
  set visible (value) {
    if (this._visible !== value) {
      this._visible = value
    }
  }

  /**
   * 设置图层的透明度
   * 将会触发map的重绘事件
   * @param value
   */
  get opacity () { return this._opacity }
  set opacity (value) { this._opacity = value }

  get minResolution () { return this._minResolution }
  set minResolution (value) { this._minResolution = value }

  get maxResolution () { return this._maxResolution }
  set maxResolution (value) { this._maxResolution = value }

  get dataExtent () {}
  set dataExtent (value) {
    this._dataExtent = value
  }
  
  get datasouce () { return this._datasource }
  set datasource (value) {
    this._datasource = value
  }
  
  get zIndex () { return this._zIndex }
  set zIndex (value) {
    if (this._zIndex !== value) {
      this._zIndex = value
    }
  }
  
  loadFeature (extent) {
    return this.features
  }
}
