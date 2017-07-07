/**
 * Created by zhangyong on 2017/3/20.
 */

import LayerRenderer from '../../renderer/canvas/layerRenderer'

import {Transform} from '../../data/matrix/transform'
import {ExtentUtil} from '../../geometry/support/extentUtil'

export default class ImageLayerRenderer extends LayerRenderer {
  constructor (layer) {
    super(layer)
    
    this._image = null
    
    this._imageTransform = Transform.create()
  
    this.coordinateToCanvasPixelTransform = Transform.create()
  }
  
  /**
   * @inheritDoc
   */
  get image () {
    return !this._image ? null : this._image.getDomImage()
  }
  
  
  /**
   * @inheritDoc
   */
  get imageTransform () { return this._imageTransform }
  
  
  /**
   *
   * @param frameState
   * @param layerState
   * @returns {boolean}
   */
  prepareFrame (frameState) {
    const pixelRatio = frameState.pixelRatio
    const size = frameState.size
    const viewState = frameState.viewState
    const viewCenter = viewState.center
    const viewResolution = viewState.resolution
    
    let image
    const imageLayer = this.layer
    // const imageSource = imageLayer.getSource()
    
    // const hints = frameState.viewHints
    
    let renderedExtent = frameState.extent
    
    // TODO 需要加上图层范围数据的限制
    // if (imageLayer.dataExtent !== undefined) {
    //   renderedExtent = ExtentUtil.getIntersection(
    //     renderedExtent, layerState.extent)
    // }
    
    if (!ExtentUtil.isEmpty(renderedExtent)) {
      const projection = viewState.projection

      image = imageLayer.getImageInternal(renderedExtent,
        viewResolution, pixelRatio, projection)
      
      // Load the image
      if (image) {
        const loaded = this.loadImage(image)
        if (loaded) {
          this._image = image
        }
      }
    }
    
    if (this._image) {
      image = this._image
      const imageExtent = image.extent
      const imageResolution = image.resolution
      const imagePixelRatio = image.pixelRatio
      const scale = pixelRatio * imageResolution /
        (viewResolution * imagePixelRatio)
      
      const transform = Transform.compose(this.imageTransform,
        pixelRatio * size[0] / 2, pixelRatio * size[1] / 2,
        scale, -scale,
        0,
        imagePixelRatio * (imageExtent[0] - viewCenter[0]) / imageResolution,
        imagePixelRatio * (viewCenter[1] - imageExtent[3]) / imageResolution)
      
      Transform.compose(this.coordinateToCanvasPixelTransform,
        pixelRatio * size[0] / 2 - transform[4], pixelRatio * size[1] / 2 - transform[5],
        pixelRatio / viewResolution, -pixelRatio / viewResolution,
        0,
        -viewCenter[0], -viewCenter[1])
      
      // this.updateAttributions(frameState.attributions, image.getAttributions())
      // this.updateLogos(frameState, imageSource)
      this.renderedResolution = viewResolution * pixelRatio / imagePixelRatio
    }
    
    return !!this.image
  }
  
  /**
   *
   * @param frameState
   * @param layerState
   * @param context
   */
  composeFrame (frameState, context) {
    this.preCompose(context, frameState)
    const image = this.image
    if (image) {
      // clipped rendering if layer extent is set
      const extent = undefined
      const clipped = extent !== undefined &&
        !ExtentUtil.containsExtent(extent, frameState.extent) &&
         ExtentUtil.intersects(extent, frameState.extent)
      
      if (clipped) {
        this.clip(context, frameState, extent)
      }
  
      const imageLayer = this.layer
      const imageTransform = this.imageTransform
      const alpha = context.globalAlpha
      context.globalAlpha = imageLayer.opacity
      
      const dx = imageTransform[4]
      const dy = imageTransform[5]
      const dw = image.width * imageTransform[0]
      const dh = image.height * imageTransform[3]
      context.drawImage(image, 0, 0, +image.width, +image.height,
        Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh))
      
      context.globalAlpha = alpha
      
      if (clipped) {
        context.restore()
      }
    }
    
    this.postCompose(context, frameState)
  }
  
  
  
}