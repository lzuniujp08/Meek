/**
 * Created by zhangyong on 2017/3/20.
 */


import LayerRenderer from '../../renderer/canvas/LayerRenderer'

import PointRender from '../render/PointRender'
import LineRender from '../render/LineRender'
import PolygonRender from '../render/PolygonRender'

export default class FeatureLayerRenderer extends LayerRenderer {
  constructor (layer,context) {
    super(layer,context)
    
    this._geometryRenderGroup = {}
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
  
  _getGeometryRender (geometry) {
    const type = geometry.geometryType
    
    if(!this._geometryRenderGroup[type]){
      this._geometryRenderGroup[type] = new FeatureLayerRenderer.GeometryRender[type](this.context)
    }
    
    // if (type === 'point'){
    //   this._geometryRenderGroup[type] = new PointRender(this.context)
    // } else if ( type === 'line'){
    //   this._geometryRenderGroup[type] = new LineRender(this.context)
    // }
    
    return this._geometryRenderGroup[type]
  }
  
  
  /**
   *
   */
  composeFrame (frameStateOpt) {
    // console.log('featureLayer Render 开启渲染')
    const frameState = frameStateOpt
    const layer = this.layer
    const features = layer.features
    features.forEach(feature => {
      if(!feature.style){
        let styleFunction = layer.styleFunction
        if(styleFunction){
          feature.style = styleFunction(feature)
        }
      }
      
      // console.log('找到point geometry 的render')
      let geomertyRender = this._getGeometryRender(feature.geometry)
      geomertyRender.render(feature)
    })
  
    return true
  }
  
}

FeatureLayerRenderer.GeometryRender = {}

FeatureLayerRenderer.GeometryRender['point'] = PointRender
FeatureLayerRenderer.GeometryRender['line'] = LineRender
FeatureLayerRenderer.GeometryRender['polygon'] = PolygonRender