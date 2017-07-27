/**
 * Created by zhangyong on 2017/3/20.
 */

import BaseObject from '../../core/baseobject'
import {Transform} from '../../data/matrix/transform'
import {ExtentUtil} from '../../geometry/support/extentutil'
import {ImageState} from '../../lyr/image/imagestate'
import {EventType} from '../../meek/eventtype'
import {Canvas} from '../../utils/canvas'

import {listen} from '../../core/eventmanager'

export default class LayerRenderer extends BaseObject {
  
  constructor (layer,context) {
    super()
    
    this._context = context
    this._layer = layer
  
    this.renderedResolution = undefined
    
    this._transform = ExtentUtil.createEmpty()
  }
  
  /**
   *
   * @param frameState
   * @param offsetX
   * @returns {*|!Transform}
   */
  getTransform (frameState, offsetX) {
    const viewState = frameState.viewState
    const pixelRatio = 1
    const dx1 = pixelRatio * frameState.size[0] / 2
    const dy1 = pixelRatio * frameState.size[1] / 2
    const sx = pixelRatio / viewState.resolution
    const sy = sx
    const angle = -viewState.rotation
    const dx2 = -viewState.center[0] + offsetX
    const dy2 = -viewState.center[1]
    return Transform.compose(this._transform, dx1, dy1, sx, sy, angle, dx2, dy2)
  }
  
  /**
   * Load the image
   * @param image
   * @returns {boolean}
   */
  loadImage (image) {
    let imageState = image.state
    if (imageState !== ImageState.LOADED &&
        imageState !== ImageState.ERROR) {
      listen(image, EventType.CHANGE, this._handleImageChange, this)
    }
    
    if (imageState === ImageState.IDLE) {
      image.load()
      imageState = image.state
    }
    
    return imageState === ImageState.LOADED
  }
  
  /**
   *
   * @param event
   * @private
   */
  _handleImageChange (event) {
    const image = event.target
    if (image.state === ImageState.LOADED) {
      this.renderIfReadyAndVisible()
    }
  }
  
  /**
   *
   */
  renderIfReadyAndVisible () {
    const layer = this.layer
    // if (layer.visible && layer.getSourceState() == State.READY) {
    if (layer.visible) {
      layer.changed()
      // this.changed()
    }
  }
  
  /**
   *
   * @param context
   * @param frameState
   * @param extent
   */
  clip (context, frameState, extent) {
    const pixelRatio = frameState.pixelRatio
    const width = frameState.size[0] * pixelRatio
    const height = frameState.size[1] * pixelRatio
    const rotation = frameState.viewState.rotation
    const topLeft = ExtentUtil.getTopLeft((extent))
    const topRight = ExtentUtil.getTopRight((extent))
    const bottomRight = ExtentUtil.getBottomRight((extent))
    const bottomLeft = ExtentUtil.getBottomLeft((extent))
    
    Transform.apply(frameState.toPixelTransform, topLeft)
    Transform.apply(frameState.toPixelTransform, topRight)
    Transform.apply(frameState.toPixelTransform, bottomRight)
    Transform.apply(frameState.toPixelTransform, bottomLeft)
    
    context.save()
    Canvas.rotateAtOffset(context, -rotation, width / 2, height / 2)
    context.beginPath()
    context.moveTo(topLeft[0] * pixelRatio, topLeft[1] * pixelRatio)
    context.lineTo(topRight[0] * pixelRatio, topRight[1] * pixelRatio)
    context.lineTo(bottomRight[0] * pixelRatio, bottomRight[1] * pixelRatio)
    context.lineTo(bottomLeft[0] * pixelRatio, bottomLeft[1] * pixelRatio)
    context.clip()
    Canvas.rotateAtOffset(context, rotation, width / 2, height / 2)
  }
  
  
  /**
   *
   * @returns {*}
   */
  get layer () { return this._layer }
  get context () {return this._context}
  
  /**
   *
   * @param frameStateOpt
   */
  prepareFrame (frameStateOpt) {}// eslint-disable-line no-unused-vars
  
  /**
   *
   * @param frameStateOpt
   * @param context
   */
  composeFrame (frameStateOpt, context) {}// eslint-disable-line no-unused-vars
  
  /**
   *
   * @param context
   * @param frameState
   * @param optTransform
   */
  postCompose (context, frameState, optTransform){} // eslint-disable-line no-unused-vars
  
  /**
   *
   * @param context
   * @param frameState
   * @param optTransform
   */
  preCompose (context, frameState, optTransform){} // eslint-disable-line no-unused-vars
}