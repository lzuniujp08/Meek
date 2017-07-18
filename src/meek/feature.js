/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/baseobject'
import Obj from '../utils/obj'
import {listen, unlistenByKey} from '../core/eventmanager'
import {EventType} from '../meek/eventtype'

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

  constructor(geometry, attributes = {}, style, displayText) {
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
     * 设置feature属性
     */
    this.initArribute(attributes)


    /**
     * 设置feature样式
     *
     */
    this.style = style

    /**
     * 设置feature文本
     *
     */
    this.displayText = displayText

    /**
     * 设置feature是否显示
     * @type {boolean}
     * @private
     */
    this.display = true

    /**
     * 设置feature的标签是否显示
     * @type {boolean}
     * @private
     */
    this.textDisplay = true

  }

  /**
   *
   * @private
   */
  _handleGeometryChanged() {
    this.changed()
  }

  /**
   * @method initArribute
   * @param attributes
   */
  initArribute(attributes) {
    this._attributesMap = Obj.objectToMap(attributes)
  }

  /**
   * @method get
   * @param property
   * @return {*}
   */
  get(property) {
    if (this._attributesMap.has(property)) {
      return this._attributesMap.get(property)
    }

    return undefined
  }

  /**
   *
   * @method set
   * @param property
   * @param value
   * @return {Map.<K, V>}
   */
  set(property, value) {
    return this._attributesMap.set(property, value)
  }

  /**
   * @method delete
   * @param property
   * @return {boolean}
   */
  delete(property) {
    return this._attributesMap.delete(property)
  }

  /**
   * @method forEachAttribute
   * @param callback
   */
  forEachAttribute(callback) {
    this._attributesMap.forEach(callback)
  }

  /**
   * @method has
   * @param property
   * @return {boolean}
   */
  has(property) {
    return this._attributesMap.has(property)
  }

  /**
   * @method geometry
   * @return {*}
   */
  get geometry() {
    return this._geometry
  }

  set geometry(value) {
    if (value) {
      this._geometry = value

      if (this._geometryChangeKey) {
        unlistenByKey(this._geometryChangeKey)
      }

      this._geometryChangeKey = listen(value,
        EventType.CHANGE, this._handleGeometryChanged, this)
    }
  }

  /**
   * @method styleFunction
   * @return {*|undefined}
   */
  get styleFunction() {
    return this._styleFunction
  }

  set styleFunction(value) {
    this._styleFunction = value
  }

  /**
   * @method style
   * @return {*}
   */
  get style() {
    return this._style
  }

  set style(value) {
    this._style = value
  }

  /**
   * @method text
   * @return {*}
   */
  get displayText() {
    return this._displayText
  }

  set displayText(value) {
    this._displayText = value
  }

  /**
   * 设置图层的透明度
   * 将会触发map的重绘事件
   *
   * @method display
   * @param value
   */
  get display() {
    return this._display
  }

  set display(value) {
    if (this._display !== value) {
      this._display = value
      // 需要触动绘制事件派发
      this.changed()
    }
  }

  /**
   * 设置标签是否显示
   * 将会触发map的重绘事件
   *
   * @method textDisplay
   * @param value
   */
  get textDisplay () { return this._textDisplay }
  set textDisplay (value) {
    if (this._textDisplay !== value) {
      this._textDisplay = value
      // 需要触动绘制事件派发
      this.changed()
    }
  }

  /**
   * Clone the attribute map and return a new map
   *
   * @method cloneAttributesMap
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
   *
   * @method clone
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
      this.cloneAttributesMap(), renderStyleArr, this.displayText.clone())
  }
}

