/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import Obj from '../utils/Obj'
import {listen, unlistenByKey} from '../core/EventManager'
import {EventType} from '../meek/EventType'

/**
 * The feature class is intent to represent geographic features,with a geometry ,a style and
 * other attrubutes properties.
 * Feature provides a function named style that can be seted a style you want,
 * otherwise will use the style of feature layer.
 *
 * @class Feature
 * @extends BaseObject
 * @module meek
 * @constructor
 */
export default class Feature extends BaseObject {

  constructor (geometry, attributes = {}, style) {
    super()
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._styleFunction = undefined
  
    /**
     *
     * @type {null}
     * @private
     */
    this._geometryChangeKey = null
    
  
    /**
     *
     */
    this.geometry = geometry
  
    /**
     *
     */
    this.initArribute(attributes)
  
    /**
     *
     */
    this.style = style

    /**
     * 设置feature是否显示
     * @type {boolean}
     * @private
     */
    this.display = true
  
  }
  
  /**
   *
   * @private
   */
  _handleGeometryChanged () {
    this.changed()
  }
  
  initArribute (attributes) {
    this._attributesMap = Obj.objectToMap(attributes)
  }
  
  get (property) {
    if ( this._attributesMap.has(property)) {
      return this._attributesMap.get(property)
    }
    
    return undefined
  }
  
  set (property, value) {
    return this._attributesMap.set(property, value)
  }
  
  delete (property) {
    return this._attributesMap.delete(property)
  }
  
  forEachAttribute (callback) {
    this._attributesMap.forEach(callback)
  }
  
  has (property) {
    return this._attributesMap.has(property)
  }
  
  /**
   *
   * @returns {*}
   */
  get geometry () { return this._geometry }
  set geometry (value) {
    if (value) {
      this._geometry = value
  
      if (this._geometryChangeKey) {
        unlistenByKey(this._geometryChangeKey)
      }
  
      this._geometryChangeKey = listen(value,
        EventType.CHANGE, this._handleGeometryChanged, this)
    }
  }

  // get attributes () { return this._attributes }
  // set attributes (value) {
  //   this._attributes = value
  // }
  
  get styleFunction () { return this._styleFunction }
  set styleFunction (value) {
    this._styleFunction = value
  }
  
  get style () { return this._style }
  set style (value) { this._style = value }

  /**
   * 设置图层的透明度
   * 将会触发map的重绘事件
   * @param value
   */
  get display () { return this._display }
  set display (value) {
    if (this._display !== value) {
      this._display = value
      // 需要触动绘制事件派发
    }
  }
  
  /**
   * Clone the attribute map and return a new map
   * @returns {Map}
   */
  cloneAttributesMap () {
    const newMap = new Map()
    if (this._attributesMap.size !== 0) {
      const entries = this._attributesMap.entries()
      for (let [key, value] of entries()) {
        newMap.set(key, value)
      }
    }
    
    return newMap
  }
  
  /**
   * Clone a feature
   * @returns {Feature}
   */
  clone () {
    let renderStyleArr
    if (this.style) {
      let style
      if (Array.isArray(this.style)) {
        style = this.style[0].clone()
      } else {
        style = this.style.clone()
      }
      
      renderStyleArr = [style]
    }
    
    return new Feature(this.geometry.clone(),
      this.cloneAttributesMap(), renderStyleArr)
  }
}

