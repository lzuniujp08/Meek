
import SingleImageLayer from '../../lyr/singleimagelayer'
import FeatureLayer from '../../lyr/featurelayer'
import Renderer from '../renderer'
import FeatureLayerRenderer from '../canvas/featurelayerrenderer'
import ImageLayerRenderer from '../canvas/imagelayerrenderer'
import {createCanvasContext2D} from '../../utils/domutil'
import {Transform} from '../../data/matrix/transform'
import {RenderEventType} from '../rendereventtype'
import {stableSort} from '../../utils/array'

import RenderEvent from '../renderevent'


/**
 * 图形渲染调度器
 *
 */
export default class CanvasRenderer extends Renderer {

  constructor (container, map) {
    super(container, map)

    this._context = null
    this._canvas = null
  
    this._rendererVisible = true
    this._layerRenderers = []
    this._transform = Transform.create()
    
    this._addToContainer(container)
  }
  
  /**
   * Add the canvas dom to the container
   * @param container
   * @private
   */
  _addToContainer (container) {
    /**
     * 创建CANVAS元素，并将其添加到container中
     * 该canvas层作为图形绘制层
     */
    let _context = this.context
    this._canvas = _context.canvas
    this._canvas.style.width = '100%'
    this._canvas.style.height = '100%'
    this._canvas.className = 'dt-unselectable'
    container.insertBefore(this._canvas, container.childNodes[0] || null)
  }
  
  /**
   * Render frame
   * @param frameState
   */
  renderFrame (frameState) {
    if (this.map === null) {
      return
    }
    
    if (!frameState) {
      if (this._rendererVisible) {
        this._canvas.style.display = 'none'
        this._rendererVisible = false
    
        return
      }
    }
    
    const context = this.context
    
    const canvasWidth = frameState.size[0]
    const canvasHeight = frameState.size[1]
    
    if (this._canvas.width !== canvasWidth || this._canvas.height !== canvasHeight) {
      this._canvas.width = canvasWidth
      this._canvas.height = canvasHeight
    } else {
      context.clearRect(0,0,canvasWidth,canvasHeight)
    }

    const layers = this.map.layers
  
    // layers rendered in order
    stableSort(layers, this.sortByZIndex)
    
    // 更新转化运算矩阵
    this.updateTransform(frameState)
  
    this._dispatchComposeEvent(RenderEventType.PRERENDER, frameState)
    
    layers.forEach( layer => {
      if (layer.visible) {
        let layerRender = this.getLayerRenderer(layer)
  
        if (layerRender.prepareFrame(frameState)) {
          layerRender.composeFrame(frameState,context)
        }
      }
    })
  
    this._dispatchComposeEvent(RenderEventType.POSTRENDER, frameState)
  }
  
  /**
   * Get the layer renderer by the params layer object
   * @param layer
   * @returns {*}
   */
  getLayerRenderer (layer) {
    const layerKey = layer.id.toString()
    // 应用层缓存
    if (layerKey in this._layerRenderers) {
      return this._layerRenderers[layerKey]
    } else {
      const layerRenderer = this.createLayerRenderer(layer)
      this._layerRenderers[layerKey] = layerRenderer
      return layerRenderer
    }
  }
  
  /**
   * Create the layer renderer
   * @param layer
   * @returns {*}
   */
  createLayerRenderer(layer){
    if (layer instanceof SingleImageLayer) {
      return new ImageLayerRenderer(layer,this.context)
    } else if (layer instanceof FeatureLayer) {
      return new FeatureLayerRenderer(layer,this.context)
    } else {
      return null
    }
  }
  
  /**
   * Update the transform
   * @param frameState
   */
  updateTransform (frameState){
    const viewState = frameState.viewState
    const coordinateToPixelTransform = frameState.toPixelTransform
    const pixelToCoordinateTransform = frameState.toCoordinateTransform
    const size = frameState.size
    const resolution = viewState.resolution
    const center = viewState.center
    const rotation = viewState.rotation
  
    Transform.compose(coordinateToPixelTransform,
          size[0] / 2, size[1] / 2,
          1 / resolution,  1 / resolution,
          - rotation,
          - center[0], - center[1])
  
    Transform.invert(Transform.setFromArray(pixelToCoordinateTransform, coordinateToPixelTransform))
  }
  
  /**
   *
   * @param state1
   * @param state2
   * @returns {number}
   */
  sortByZIndex (state1, state2) {
    return state1.zIndex - state2.zIndex
  }
  
  get canvas(){ return this._canvas }
  
  get context(){
    if(!this._context){
      this._context = createCanvasContext2D()
    }
    
    return this._context
  }
  
  
  /**
   * 
   * @private
   */
  _dispatchComposeEvent (type, frameState) {
    const map = this.map
    const context = this.context
    if (map.hasListener(type)) {
    
      // const transform = this.getTransform(frameState)
    
      const composeEvent = new RenderEvent(type,
        frameState, context, null)
      
      map.dispatchEvent(composeEvent)
    }
  }
}
