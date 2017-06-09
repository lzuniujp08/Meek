/**
 * Created by zhangyong on 2017/6/6.
 */

import BaseObject from '../core/BaseObject'

export default class BaseImage extends BaseObject {
  
  /**
   *
   * @param extent
   * @param resolution
   * @param pixelRatio
   * @param state
   * @param attributions
   */
  constructor (extent, resolution, pixelRatio,
               state, attributions) {
  
    super()
  
    this._attributions = attributions
  
    this._extent = extent
  
    this._pixelRatio = pixelRatio
  
    this.resolution = resolution
  
    this._state = state
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
  
  /**
   * Get the DOM image
   * @param optContext
   * @returns {*}
   */
  getDomImage (optContext) { return optContext }
  
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
    if (this._resolution !== value) {
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




