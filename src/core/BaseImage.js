/**
 * Created by zhangyong on 2017/6/6.
 */


import BaseObject from '../core/BaseObject'

export default class BaseImage extends BaseObject {
  
  constructor (extent, resolution, pixelRatio,
               state, attributions) {
  
    super()
    
    this._attributions = attributions
  
    this.extent = extent
  
    this._pixelRatio = pixelRatio
  
    this.resolution = resolution
  
    this.state = state
    
  }
  
  
  /**
   * @return {Array.<ol.Attribution>} Attributions.
   */
  getAttributions () {
    return this._attributions
  }
  
  
  getExtent () {
    return this.extent
  }
  
  
  /**
   * @abstract
   * @param {Object=} opt_context Object.
   * @return {HTMLCanvasElement|Image|HTMLVideoElement} Image.
   */
  getImage (opt_context) {}
  
  
  /**
   * @return {number} PixelRatio.
   */
  getPixelRatio () {
    return this._pixelRatio
  }
  
  
  /**
   * @return {number} Resolution.
   */
  getResolution () {
    return this.resolution
  }
  
  getState () {
    return this.state
  }
  
  
  /**
   * Load not yet loaded URI.
   * @abstract
   */
  load () {}
  
}




