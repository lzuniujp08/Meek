/**
 * Created by zypc on 2016/11/15.
 */

import BaseLayer from './baselayer'
import SingleImage from '../lyr/image/singleimage'

import {listen} from '../core/eventmanager'
import {createCanvasContext2D} from '../utils/domutil'
import ImageEvent from '../lyr/image/imageevent'

import {EventType} from '../meek/eventtype'
import {ImageState} from '../lyr/image/imagestate'
import {ExtentUtil} from '../geometry/support/extentutil'

/**
 * SingleImageLayer
 *
 * @class SingleImageLayer
 * @extends BaseObject
 * @module layer
 * @constructor
 */
export default class SingleImageLayer extends BaseLayer {
  
  /**
   * @constructor
   * @param options
   */
  constructor (options = {}) {
    super(options)
  
    const imageExtent = options.imageExtent
    this.dataExtent = imageExtent
  
    const crossOrigin = options.crossOrigin !== undefined ?
      options.crossOrigin : null
  
    const imageLoadFunction =
      options.imageLoadFunction !== undefined ?
      options.imageLoadFunction : this.defaultImageLoadFunction
    
    this.attributions = options.attributions
  
    /**
     * @private
     */
    this._singleImage = new SingleImage(imageExtent, undefined, 1, this.attributions,
      options.url, crossOrigin, imageLoadFunction)
    
    /**
     * @private
     * @type {ol.Size}
     */
    this._imageSize = options.imageSize ? options.imageSize : null
  
    /**
     * Listen the change event for SingleImage
     */
    listen(this.singleImage, EventType.CHANGE, this.handleImageChange, this)
  
    /**
     *
     * @type {number}
     */
    this.zIndex = 0
  }
  
  /**
   * 设置图片链接
   *
   * @method imageSrc
   * @param url {String}
   *
   */
  set imageSrc (url) {
    this._singleImage._src = url
    this._singleImage.domImage = new Image()
    this._singleImage.state = ImageState.IDLE
  }

  /**
   * 获取singleImage
   *
   * @property singleImage
   * @returns {SingleImage}
   */
  get singleImage () { return this._singleImage }

  /**
   * 属性读写器
   *
   * @property attributions
   * @param value
   */
  set attributions(value){
    this._attributes = value
  }
  
  get attributions(){
    return this._attributes || null
  }
  
  /**
   *
   * @param image
   * @param src
   */
  defaultImageLoadFunction (image, src) {
    image.getDomImage().src = src
  }
  
  /**
   * 获取图片的Dom
   * @inheritDoc
   */
  getImageInternal (extent) {
    if (ExtentUtil.intersects(extent, this.singleImage.extent)) {
      return this.singleImage
    }
    
    return null
  }
  
  /**
   * Handle the image change event
   * @param evt
   */
  handleImageChange (evt) {
    if (this.singleImage.state === ImageState.LOADED) {
      const imageExtent = this.singleImage.extent
      const image = this.singleImage.getDomImage()
      let imageWidth, imageHeight
      if (this._imageSize) {
        imageWidth = this._imageSize[0]
        imageHeight = this._imageSize[1]
      } else {
        imageWidth = image.width
        imageHeight = image.height
      }
      
      const resolution = ExtentUtil.getHeight(imageExtent) / imageHeight
      const targetWidth = Math.ceil(ExtentUtil.getWidth(imageExtent) / resolution)
      
      if (targetWidth !== imageWidth) {
        const context = createCanvasContext2D(targetWidth, imageHeight)
        const canvas = context.canvas
        context.drawImage(image, 0, 0, imageWidth, imageHeight,
          0, 0, canvas.width, canvas.height)
        // Pre-load image
        this.singleImage.domImage = canvas
      }
    }
  
    this._dispatchImageEvent(evt)
  }
  
  /**
   *
   * @param event
   * @private
   */
  _dispatchImageEvent (event) {
    const image = event.target
    switch (image.state) {
    case ImageState.LOADING:
      this.dispatchEvent(
        new ImageEvent(ImageEvent.Type.IMAGELOADSTART,
          image))
      break
    case ImageState.LOADED:
      this.dispatchEvent(
        new ImageEvent(ImageEvent.Type.IMAGELOADEND,
          image))
      break
    case ImageState.ERROR:
      this.dispatchEvent(
        new ImageEvent(ImageEvent.Type.IMAGELOADERROR,
          image))
      break
    default:
      // pass
    }
  }
  
  
  
  

}
