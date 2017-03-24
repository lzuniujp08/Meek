/**
 * Created by zhangyong on 2017/3/20.
 */


import LayerRenderer from '../../renderer/canvas/LayerRenderer'

export default class FeatureLayerRenderer extends LayerRenderer {
  constructor (layer) {
    super(layer)
    
    this._geometryRender = null
  }
  
  /**
   *
   */
  prepareFrame () {
    
  }
  
  
}