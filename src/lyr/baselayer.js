/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/baseobject'
import {listen, unlistenByKey} from '../core/eventmanager'
import {EventType} from '../meek/eventtype'

/**
 * Layer基础类
 *
 * @class BaseLayer
 * @extends BaseObject
 * @module layer
 * @constructor
 */
export default class BaseLayer extends BaseObject {

  constructor (options) {
    super()

    const baseOptions = Object.assign({},options)
    
    this.name = baseOptions.name || ''
    this.visible = true
    this.datasource = []
    this.opacity = baseOptions.opacity !== undefined ? options.opacity : 1
    this.dataExtent = null
    this.maxResolution = 0
    this.minResolution = 0
    this.zIndex = baseOptions.zIndex || 0

    this._mapRenderKey = null
    
  }

  /**
   * map读写器, 读取设置当前map
   *
   * @type {Function}
   * @property map
   * @param mapValue {Object} Datatang.map
   */
  get map () { return this._map }
  set map (value) {
    if (this._mapRenderKey) {
      unlistenByKey(this._mapRenderKey)
      this._mapRenderKey = null
    }

    if (value) {
      this._map = value
      this._mapRenderKey = listen(this, EventType.CHANGE, value.render, value)
      this.changed()
    }
  }

  /**
   * 设置图层是否显示(将会触发的重绘事件)
   *
   * @property visible
   * @param value
   */
  get visible () { return this._visible }
  set visible (value) {
    if (this._visible !== value) {
      this._visible = value
    }
  }

  /**
   * 设置图层的透明度(将会触发map的重绘事件)
   *
   * @property opacity
   * @param value
   */
  get opacity () { return this._opacity }
  set opacity (value) { this._opacity = value }

  /**
   * 设置图层的最小分辨率
   *
   * @property minResolution
   * @returns {*}
   */
  get minResolution () { return this._minResolution }
  set minResolution (value) { this._minResolution = value }

  /**
   * 设置图层的最大分辨率
   *
   * @property maxResolution
   * @returns {*}
   */
  get maxResolution () { return this._maxResolution }
  set maxResolution (value) { this._maxResolution = value }

  /**
   * dataExtent读取器
   *
   * @property dataExtent
   * @returns {*}
   */
  get dataExtent () {}
  set dataExtent (value) {
    this._dataExtent = value
  }

  /**
   * datasouce 读取器
   *
   * @property datasouce
   * @returns {*}
   */
  get datasouce () { return this._datasource }
  set datasource (value) {
    this._datasource = value
  }

  /**
   * zIndex读取器
   *
   * @property maxResolution
   * @returns {*}
   */
  get zIndex () { return this._zIndex }
  set zIndex (value) {
    if (this._zIndex !== value) {
      this._zIndex = value
    }
  }

  /**
   * 加载Feature
   *
   * @method loadFeature
   * @returns {Object} features
   */
  loadFeature () {
    return this.features
  }
}
