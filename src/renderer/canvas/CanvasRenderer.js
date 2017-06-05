
import SingleImageLayer from '../../lyr/SingleImageLayer'
import FeatureLayer from '../../lyr/FeatureLayer'
import Renderer from '../Renderer'
import FeatureLayerRender from '../canvas/FeatureLayerRender'
import ImageLayerRender from '../canvas/ImageLayerRender'
import {createCanvasContext2D} from '../../utils/DomUtil'
import {Transform} from '../../data/matrix/Transform'
import {RenderEventType} from '../RenderEventType'


/**
 *
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

  renderFrame (frameState) {
    if (this.map === null) {
      return
    }
    
    if(!frameState){
      if (this._rendererVisible) {
        this._canvas.style.display = 'none'
        this._rendererVisible = false
    
        return
      }
    }
    
    const context = this.context
    
    const canvasWidth = frameState.size[0]
    const canvasHeight = frameState.size[1]
    
    if(this._canvas.width !== canvasWidth || this._canvas.height !== canvasHeight){
      this._canvas.width = canvasWidth
      this._canvas.height = canvasHeight
    }else{
      context.clearRect(0,0,canvasWidth,canvasHeight)
    }

    const layers = this.map.layers
    let layerRender = undefined
    
    // 更新转化运算矩阵
    this.updateTranceform(frameState)
  
    this._dispatchComposeEvent(RenderEventType.PRERENDER, frameState)
    
    layers.forEach(layer => {
      layerRender = this.getLayerRenderer(layer)
      if(layerRender.prepareFrame(frameState)){
        layerRender.composeFrame(frameState,context)
      }
    })
  
    this._dispatchComposeEvent(RenderEventType.POSTRENDER, frameState)
  }
  
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
  
  createLayerRenderer(layer){
    if (layer instanceof SingleImageLayer) {
      return new ImageLayerRender(layer,this.context)
    // } else if (layer instanceof ol.layer.Tile) {
      //   return new ol.renderer.canvas.TileLayer(layer)
      // } else if (layer instanceof ol.layer.VectorTile) {
      //   return new ol.renderer.canvas.VectorTileLayer(layer)
    } else if (layer instanceof FeatureLayer) {
      return new FeatureLayerRender(layer,this.context)
    } else {
      return null
    }
  }
  
  updateTranceform (frameState){
    const viewState = frameState.viewState
    const coordinateToPixelTransform = frameState.toPixelTransform
    const pixelToCoordinateTransform = frameState.toCoordinateTransform
  
    Transform.compose(coordinateToPixelTransform,
          frameState.size[0] / 2, frameState.size[1] / 2,
          1 / viewState.resolution, -1 / viewState.resolution,
          -viewState.rotation,
          -viewState.center[0], -viewState.center[1])
  
    Transform.invert(Transform.setFromArray(pixelToCoordinateTransform, coordinateToPixelTransform))
  }
  
  get canvas(){ return this._canvas }
  
  get context(){
    if(!this._context){
      this._context = createCanvasContext2D()
    }
    
    return this._context
  }
  
  
  _dispatchComposeEvent () {
    
  }
}
