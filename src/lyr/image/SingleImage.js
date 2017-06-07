/**
 * Created by zhangyong on 2017/6/6.
 */

import BaseImage from '../core/BaseImage'
import {ImageState} from '../core/ImageState'
import {Obj} from '../utils/Obj'
import {ExtentUtil} from '../geometry/support/ExtentUtil'
import {EventType} from '../meek/EventType'

import {listenOnce, unlistenByKey} from '../core/EventManager'
import {getUid} from '../utils/Counter'

export default class SingleImage extends BaseImage {
  constructor (extent, resolution, pixelRatio, attributions, src,
               crossOrigin, imageLoadFunction) {
    
    super(extent, resolution, pixelRatio, ImageState.IDLE,
      attributions)
  
    /**
     * @private
     * @type {string}
     */
    this._src = src
  
    /**
     * @private
     * @type {HTMLCanvasElement|Image|HTMLVideoElement}
     */
    this._image = new Image()
    if (crossOrigin !== null) {
      this._image.crossOrigin = crossOrigin
    }
  
    /**
     * @private
     * @type {Object.<number, (HTMLCanvasElement|Image|HTMLVideoElement)>}
     */
    this._imageByContext = {}
  
    /**
     * @private
     * @type {Array.<EventsKey>}
     */
    this._imageListenerKeys = null
  
    /**
     * @protected
     * @type {ImageState}
     */
    this.state = ImageState.IDLE
  
    /**
     * @private
     * @type {ImageLoadFunctionType}
     */
    this._imageLoadFunction = imageLoadFunction
  }
  
  /**
   * @inheritDoc
   * @api
   */
  getImage (opt_context) {
    if (opt_context !== undefined) {
      let image
      let key = getUid(opt_context)
      if (key in this._imageByContext) {
        return this._imageByContext[key]
      } else if (Obj.isEmpty(this._imageByContext)) {
        image = this._image
      } else {
        image = /** @type {Image} */ (this._image.cloneNode(false))
      }
      this._imageByContext[key] = image
      return image
    } else {
      return this._image
    }
  }
  
  
  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  _handleImageError () {
    this.state = ImageState.ERROR
    this._unlistenImage()
    this.changed()
  }
  
  
  /**
   * Tracks successful image load.
   *
   * @private
   */
  _handleImageLoad () {
    if (this.resolution === undefined) {
      this.resolution = ExtentUtil.getHeight(this.extent) / this._image.height
    }
    this.state = ImageState.LOADED
    this._unlistenImage()
    this.changed()
  }
  
  
  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @override
   * @api
   */
  load () {
    if (this.state == ImageState.IDLE || this.state == ImageState.ERROR) {
      this.state = ImageState.LOADING
      this.changed()
      this._imageListenerKeys = [
        listenOnce(this._image, EventType.ERROR,
          this._handleImageError, this),
        listenOnce(this._image, EventType.LOAD,
          this._handleImageLoad, this)
      ]
      this._imageLoadFunction(this, this._src)
    }
  }
  
  
  /**
   * @param {HTMLCanvasElement|Image|HTMLVideoElement} image Image.
   */
  setImage (image) {
    this._image = image
  }
  
  
  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  _unlistenImage () {
    this._imageListenerKeys.forEach(unlistenByKey)
    this._imageListenerKeys = null
  }
}

