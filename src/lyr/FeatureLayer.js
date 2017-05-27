
import BaseLayer from './BaseLayer'
import {Style} from '../style/Style'

export default class FeatureLayer extends BaseLayer {

  constructor (options) {
    const baseOptions = Object.assign({}, options)
    super(baseOptions)

    let optionsInner = options ? options : ({})
    this._features = []
  
  
    this._style = null
    this._styleFunction = null
    
    this.style = optionsInner.style
    
  }
  
  clear () {
    this._features = []
    this.changed()
  }

  get features () { return this._features }
  
  /**
   * Add features to the layer then the change event will be dispached
   * @param features
   * @returns {boolean}
   */
  addFeatures (features) {
    if (!Array.isArray(features)) {
      return false
    }
    
    this._addFeaturesInner(features)
    this.changed()
  }

  _addFeaturesInner (features) {
    features.map(feature => this.features.push(feature))
    
    // Should dispatch features adding event
    // this.dispatchEvent()
    
  }
  
  /**
   * Add a feature to collection
   * @param feature
   * @returns {boolean}
   */
  addFeature (feature) {
    if (!feature) {
      return false
    }
    
    this._addFeaturesInner([feature])
    this.changed()
  }
  
  
  forEachFeatureAtPiexl (frameState,piexl,callback,tolerance) {
    // frameState 携带 view 信息
  
    // 1、计算当前屏幕内的feature
    const features = this._getCurrentExtentFeatures()
    
    // calculate features that their extent has intersected with a given point
    const extentFeatures = this._getIntersectedFeatures(piexl,features)
  
    const result = extentFeatures.filter(function(feature){
      return feature.geometry.containsXY(piexl[0],piexl[1],{tolerance : tolerance})
    })
    
    return callback(result)
  }
  
  _getIntersectedFeatures (point, features) {
    return features.filter(function(feature){
      let geometry = feature.geometry
      return geometry.pointInExtent(point)
    })
  }
  
  _getCurrentExtentFeatures () {
    return this.features
  }
  
  /**
   * Remove a feature from collection
   * @param feature
   * @returns {boolean}
   */
  removeFeature (feature) {
    const features = this.features
    if (features.length === 0) {
      return false
    }
    
    const index = features.findIndex(function(f){
      return f.id === feature.id
    })
    
    if (index > -1) {
      features.splice(index, 1)
    }
    
    // dispatch feature removed event
    // this.dispatchEvent()
    this.changed()
  }
  
  set style (value) {
    this._style = value !== undefined ? value : Style.defaultFunction()
    this._styleFunction = value === null ? undefined :Style.createFunction(this._style)
  }
  
  get style () {
    if(this._style === null){
      this._style = Style.defaultFunction()
    }
    
    return this._style
  }
  
  get styleFunction () { return this._styleFunction }
}
