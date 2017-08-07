/**
 * Created by zhangyong on 2017/3/20.
 */


import LayerRenderer from '../../renderer/canvas/layerrenderer'

import PointRender from '../render/pointrender'
import LineRender from '../render/linerender'
import PolygonRender from '../render/polygonrender'
import TextRender from '../render/textrender'

import {Transform} from '../../data/matrix/transform'
import {ExtentUtil} from '../../geometry/support/extentutil'

export default class FeatureLayerRenderer extends LayerRenderer {
  
  
  constructor (layer,context) {
    super(layer, context)
  
    /**
     *
     * @type {Map}
     * @private
     */
    this._geometryRenderGroup = new Map()
  
    /**
     *
     * @type {TextRender}
     * @private
     */
    this._textRender = new TextRender(this.context)
  
    /**
     *
     * @type {null}
     * @private
     */
    this._maxExtent = null
  
    /**
     *
     * @type {Array}
     * @private
     */
    this._renderFeatures = []
  
    /**
     *
     * @type {NaN}
     * @private
     */
    this._renderResolution = NaN
  
    /**
     *
     * @type {[*]}
     * @private
     */
    this._renderExtent = [Infinity, Infinity, -Infinity, -Infinity]
  
    /**
     *
     * @type {NaN}
     * @private
     */
    this._renderRevision = NaN
  
    /**
     *
     * @type {boolean}
     * @private
     */
    this._cacheableThisTime = true
  
  }
  
 
  /**
   * 1、对渲染对象需要做切割 （当前范围内）
   */
  prepareFrame (frameState) {
    const layer = this.layer
    const frameExtent = frameState.extent
    const viewState = frameState.viewState
    const resolution = viewState.resolution
    const layerRevision = layer.revision
    const featureLayerRenderBuffer = layer.renderBuffer
    
    const renderExtent = ExtentUtil.buffer(frameExtent,
      featureLayerRenderBuffer * resolution)
    
    if (this._renderResolution === resolution &&
        this._renderRevision === layerRevision &&
        ExtentUtil.containsExtent(this._renderExtent, renderExtent)) {
      // console.log(this.id + 'render cache')
      this._cacheableThisTime = true
      
      // return true
    }
  
    // 加载当前屏的图形
    const features = this.layer.loadFeature(renderExtent)
    
    // console.log(this.layer.name + 'the renderer geometry length is :' + features.length)
  
    this._cacheableThisTime = false
    this._renderFeatures = features
    this._maxExtent = renderExtent
    this._renderResolution = resolution
    this._renderExtent = renderExtent
    this._renderRevision = layerRevision
    
    return true
  }
  
  
  /**
   *  Get a renderer by geometry type
   * @param geometry
   * @returns {*}
   * @private
   */
  _getGeometryRender (geometry) {
    const type = geometry.geometryType
    
    if ( !this._geometryRenderGroup.has(type) ) {
      this._geometryRenderGroup.set(type, new FeatureLayerRenderer.GeometryRender[type](this.context))
    }
    
    return this._geometryRenderGroup.get(type)
  }
  
  
  /**
   *
   */
  composeFrame (frameStateOpt, context) {
    // console.log('featureLayer Render 开启渲染')
    const frameState = frameStateOpt
    const viewState = frameState.viewState
    const layer = this.layer
    const features = this._renderFeatures
    const resolution = viewState.resolution
  
    const transform = this.getTransform(frameState, 0)
  
    this.preCompose(context, frameState, transform)
    
    // Clip the current extent so that the parts of geometries
    // will not be rendered
    this._clipExtent(transform, context)
    
    features.forEach(feature => {
      let renderStyle
      
      if (feature.style) {
        renderStyle = feature.style
      } else {
        let styleFunction = layer.styleFunction
        if (styleFunction) {
          renderStyle = styleFunction(feature, resolution)
        }
      }
      
      // 应用图层样式
      feature.style = renderStyle
      
      let geomertyRender = this._getGeometryRender(feature.geometry)
      this._resetRender(geomertyRender)
      geomertyRender.render(feature, renderStyle, transform)
  
      /**
       * Render text
       */
      if (feature.textDisplay) {
        this._textRender.render(feature, renderStyle, transform)
      }
    })
  
    context.restore()
    
    this.postCompose(context, frameState, transform)
    
    return true
  }
  
  /**
   * Clip the context
   * @param transform
   * @private
   */
  _clipExtent (transform, context) {
    const flatClipCoords = this.getClipCoords(transform)
    
    context.save()
    context.beginPath()
    context.moveTo(flatClipCoords[0], flatClipCoords[1])
    context.lineTo(flatClipCoords[2], flatClipCoords[3])
    context.lineTo(flatClipCoords[4], flatClipCoords[5])
    context.lineTo(flatClipCoords[6], flatClipCoords[7])
    context.clip()
  }
  
  /**
   * Get clip coordinates
   * @param transform
   * @returns {[*,*,*,*,*,*,*,*]}
   */
  getClipCoords (transform) {
    const maxExtent = this._maxExtent
    const minX = maxExtent[0]
    const minY = maxExtent[1]
    const maxX = maxExtent[2]
    const maxY = maxExtent[3]
    const flatClipCoords = [minX, minY, minX, maxY, maxX, maxY, maxX, minY]
    Transform.transform2D(flatClipCoords, 0, 8, 2, transform, flatClipCoords)
    return flatClipCoords
  }
  
  /**
   *
   * @param geomertyRender
   * @private
   */
  _resetRender (geomertyRender) {
    if (!this._cacheableThisTime) {
      geomertyRender.resetRenderOption()
    }
  }
  
  preCompose () {
    
  }
  
  postCompose () {
    
  }
  
}

FeatureLayerRenderer.GeometryRender = {}

FeatureLayerRenderer.GeometryRender['point'] = PointRender
FeatureLayerRenderer.GeometryRender['line'] = LineRender
FeatureLayerRenderer.GeometryRender['polygon'] = PolygonRender
FeatureLayerRenderer.GeometryRender['multi_polygon'] = PolygonRender
FeatureLayerRenderer.GeometryRender['extent'] = PolygonRender