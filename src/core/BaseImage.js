/**
 * Created by zhangyong on 2017/6/6.
 */


import BaseObject from '../core/BaseObject'
import {EventType} from '../meek/EventType'

export default class BaseImage extends BaseObject {
  
  constructor (extent, resolution, pixelRatio,
               state, attributions) {
  
    super()
  
    this._attributions = attributions
  
    this._extent = extent
  
    this._pixelRatio = pixelRatio
  
    this._resolution = resolution
  
    this._state = state
  }
  
  changed () {
    this.dispatchEvent(EventType.CHANGE)
  }
  
  /**
   *
   * @returns {*}
   */
  get attributions () {
    return this._attributions
  }
  
  /**
   *
   * @returns {*}
   */
  get extent () {
    return this._extent
  }
  
  getDomImage (optContext) {}
  
  
  /**
   * @return {number} PixelRatio.
   */
  get pixelRatio () {
    return this._pixelRatio
  }
  
  
  /**
   * @return {number} Resolution.
   */
  get resolution () {
    return this._resolution
  }
  
  set resolution (value) {
    if (this.resolution !== value) {
      this._resolution = value
    }
  }
  
  get state () { return this._state }
  set state (value) {
    if (this.state !== value){
      this._state = value
    }
  }
  
  /**
   * Load not yet loaded URI.
   * @abstract
   */
  load () {}
  
}




