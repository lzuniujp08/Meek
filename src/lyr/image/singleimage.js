/**
 * Created by zhangyong on 2017/6/6.
 */

import BaseImage from '../../core/baseimage'
import {ImageState} from './imagestate'
import Obj from '../../utils/obj'
import {ExtentUtil} from '../../geometry/support/extentutil'
import {EventType} from '../../meek/eventtype'

import {listenOnce, unlistenByKey} from '../../core/eventmanager'
import {getUid} from '../../utils/counter'

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
    this.domImage = new Image()
    if (crossOrigin !== null) {
      this.getDomImage().crossOrigin = crossOrigin
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
  getDomImage (opt_context) {
    if (opt_context !== undefined) {
      let image
      let key = getUid(opt_context)
      
      if (key in this._imageByContext) {
        return this._imageByContext[key]
      } else if (Obj.isEmpty(this._imageByContext)) {
        image = this._domImage
      } else {
        image = this._domImage.cloneNode(false)
      }
      
      this._imageByContext[key] = image
      return image
    } else {
      return this._domImage
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
      this.resolution = ExtentUtil.getHeight(this.extent) / this.getDomImage().height
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
    if (this.state === ImageState.IDLE || this.state === ImageState.ERROR) {
      this.state = ImageState.LOADING
      this.changed()
      this._imageListenerKeys = [
        listenOnce(this.getDomImage(), EventType.ERROR,
          this._handleImageError, this),
        listenOnce(this.getDomImage(), EventType.LOAD,
          this._handleImageLoad, this)
      ]
      
      this._imageLoadFunction(this, this._src)
    }
  }
  
  
  /**
   * @param {HTMLCanvasElement|Image|HTMLVideoElement} image Image.
   */
  set domImage (value) {
    this._domImage = value
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

