/**
 * Created by zhangyong on 2017/6/6.
 */

import BaseObject from '../core/baseobject'
 // The base class to represent a generic layer image,it has some basic properties.
 // such as extent,resolution,state
/**
 *
 * 基础图片图层类，定义了一些用于加载图片的必要信息
 *
 * @class BaseImage
 * @extends BaseObject
 * @module core
 * @constructor
 */
export default class BaseImage extends BaseObject {
  
  /**
   * 构造函数Create a BaseImage
   *
   * @constructor
   * @param extent the extent of layer
   * @param resolution the resolution of layer
   * @param pixelRatio the pixel ratio
   * @param state the image loading status
   * @param attributions
   */
  constructor (extent, resolution, pixelRatio,
               state, attributions) {
  
    super()
  
    /**
     * @type {Object}
     * @private
     */
    this._attributions = attributions
  
    /**
     * @type {Object}
     * @private
     */
    this._extent = extent
  
    /**
     * @type {Number}
     * @private
     */
    this._pixelRatio = pixelRatio
  
    /**
     * @type {Number}
     * @private
     */
    this._resolution = resolution
  
    /**
     * @type {Number}
     * @private
     */
    this._state = state
  }
  
  /**
   * 返回图层的属性
   *
   * @property attributions
   * @type {Object}
   */
  get attributions () {
    return this._attributions
  }
  
  /**
   * 返回图层的视图范围
   *
   * @property extent
   * @type {Object}
   */
  get extent () {
    return this._extent
  }
  
  /**
   * 返回DOM对象
   *
   * @param optContext {Object}
   * @method getDomImage
   * @abstract
   */
  getDomImage (optContext) { return optContext }
  
  /**
   * 返回像素因数
   *
   * @property pixelRatio
   * @type {Number}
   */
  get pixelRatio () {
    return this._pixelRatio
  }
  
  /**
   * 分辨率读写器,返回图层的分辨率
   *
   * @property resolution
   * @type {Number}
   */
  get resolution () {
    return this._resolution
  }
  set resolution (value) {
    if (this._resolution !== value) {
      this._resolution = value
    }
  }
  
  /**
   * 获取图片下载状态
   *
   * @property state
   * @type {Number}
   */
  get state () { return this._state }
  set state (value) {
    if (this.state !== value){
      this._state = value
    }
  }
  
  /**
   *
   * 抽象方法，下载图片
   *
   * @abstract
   * @method load
   */
  load () {}
  
}




