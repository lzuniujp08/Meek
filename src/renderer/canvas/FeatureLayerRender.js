/**
 * Created by zhangyong on 2017/3/20.
 */


import LayerRenderer from '../../renderer/canvas/LayerRenderer'

import PointRender from '../render/PointRender'
import LineRender from '../render/LineRender'
import PolygonRender from '../render/PolygonRender'
import TextRender from '../render/TextRender'

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
  
  }
  
  
  /**
   * 1、对渲染对象需要做切割 （当前范围内）
   */
  prepareFrame (frameState) {
    // const frameState = frameState
    // const layer = this.layer
    
    const frameExtent = frameState.extent
    
    const extent = frameExtent
  
  
    // 加载当前屏的图形
    // const features = this.layer.loadFeature(extent)
    // features.forEach(function(feature){
    //   let styles = null
    //   let styleFunction = feature.styleFunction()
    //   if(styleFunction){
    //     styles = styleFunction.call(feature)
    //   }else{
    //     styleFunction = this.layer.getStyleFunction()
    //     if(styleFunction){
    //       styles = styleFunction(feature)
    //     }
    //
    //   }
    //
    // },this)
    
    // 转换为canvas坐标
    
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
    const features = layer.features
    const resolution = viewState.resolution
  
    const transform = this.getTransform(frameState, 0)
  
    this.preCompose(context, frameState, transform)
    
    features.forEach(feature => {
      if(!feature.style){
        let styleFunction = layer.styleFunction
        if(styleFunction){
          feature.style = styleFunction(feature, resolution)
        }
      }
      
      let geomertyRender = this._getGeometryRender(feature.geometry)
      geomertyRender.render(feature, transform)
  
      /**
       * Render text
       */
      if (feature.style[0].textStyle ) {
        this._textRender.render(feature, transform)
      }
    })
  
    this.postCompose(context, frameState, transform)
    
    return true
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
FeatureLayerRenderer.GeometryRender['extent'] = PolygonRender