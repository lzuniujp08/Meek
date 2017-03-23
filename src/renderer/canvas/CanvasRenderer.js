
import SingleImageLayer from '../../lyr/SingleImageLayer'
import FeatureLayer from '../../lyr/FeatureLayer'
import Renderer from '../Renderer'
import FeatureLayerRender from '../canvas/FeatureLayerRender'
import ImageLayerRender from '../canvas/ImageLayerRender'
import {createCanvasContext2D} from '../../utils/DomUtil'
import {transform} from '../../data/matrix/Transform'
import {Config} from '../../meek/Config'


/**
 *
 *
 */
export default class CanvasRenderer extends Renderer {

  constructor (container, ws) {
    super(container, ws)

    this._context = createCanvasContext2D()
    
    /**
     * 创建CANVAS元素，并将其添加到container中
     * 该canvas层作为图形绘制层
     */
    this._canvas = this._context.canvas
    this._canvas.style.width = '100%'
    this._canvas.style.height = '100%'
    container.insertBefore(this._canvas, container.childNodes[0] || null)
    
    this._rendererVisible = true
    this._layerRenderers = []
    this._transform = transform.create()
  }

  renderFrame (renderState) {
    if (this._ws === null) {
      return
    }
    
    if (this._rendererVisible) {
      this._canvas.style.display = 'none'
      this._rendererVisible = false
      
      return
    }
    
    const context = this._context
    context.clearRect()

    const layers = this._ws.layers
    let layerRender = undefined
    
    layers.forEach(function(layer){
      layerRender = this.getLayerRenderer(layer)
      if(layerRender.prepareFrame()){
        layerRender.composeFrame()
      }
    })
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
      return new ImageLayerRender(layer)
    // } else if (layer instanceof ol.layer.Tile) {
      //   return new ol.renderer.canvas.TileLayer(layer)
      // } else if (layer instanceof ol.layer.VectorTile) {
      //   return new ol.renderer.canvas.VectorTileLayer(layer)
    } else if (layer instanceof FeatureLayer) {
      return new FeatureLayerRender(layer)
    } else {
      Config.DEBUG && console.assert(false, 'unexpected layer configuration')
      return null
    }
  }

}
