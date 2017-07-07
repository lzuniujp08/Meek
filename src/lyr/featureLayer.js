
import BaseLayer from './baseLayer'
import {Style} from '../style/style'
import {ExtentUtil} from '../geometry/support/extentUtil'
import FeatureEvent from '../meek/featureEvent'
import {EventType} from '../meek/eventType'
import {listen, unlistenByKey} from '../core/eventManager'

/**
 * @class FeatureLayer
 * @extends BaseObject
 * @module layer
 * @constructor
 */
export default class FeatureLayer extends BaseLayer {

  constructor (options = {}) {
    super(options)
  
    /**
     *
     * @type {Array}
     * @private
     */
    this._features = []
  
    /**
     *
     * @type {null}
     * @private
     */
    this._style = null
  
    /**
     *
     * @type {null}
     * @private
     */
    this._styleFunction = null
  
    /**
     *
     * @type {Map}
     * @private
     */
    this._featureChangeKeys = new Map()
  
    /**
     *
     */
    this.style = options.style
    
    // add features if passed by options
    if (options.features) {
      this.addFeatures(options.features)
    }
  
    /**
     *
     * @type {number}
     */
    this.zIndex = options.zIndex || 2
  
    /**
     * The rendering buffer will be used for building an extent that
     * limit geometries rendering
     * @type {number}
     * @private
     */
    this._renderBuffer = options.renderBufferValue !== undefined ?
      options.renderBufferValue : 100
  
  }
  
  /**
   * Clear all feature in collection
   */
  clear () {
    if (this._features.length !== 0) {
      this._features = []
      
      // remove the event listener from feature
      const unlistenByKeyFn = unlistenByKey
      
      this._featureChangeKeys.forEach((value) => {
        unlistenByKeyFn(value)
      })
      
      this._featureChangeKeys.clear()
      
      this.dispatchEvent(new FeatureEvent(FeatureEvent.EventType.CLEAR))
      this.changed()
    }
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
  
  /**
   *
   * @param feature
   * @returns {boolean}
   */
  hasFeature (feature) {
    if (feature === null || feature === undefined) {
      return false
    }
    
    const featureId = feature.id
    const features = this.features
    const findIndex = features.findIndex(f => {
      return f.id === featureId
    })
    
    return findIndex > -1
  }
  
  /**
   * Put features to the layer collection and then
   * dispacth a feature event.
   * @param features
   * @private
   */
  _addFeaturesInner (features) {
    features.forEach(feature => {
      if (!this.hasFeature(feature)) {
        this.features.push(feature)
        
        this._setupChangeEvents(feature.id, feature)
        this.dispatchEvent(new FeatureEvent(FeatureEvent.EventType.ADD_FEATURE, feature))
      }
    })
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
  
  /**
   *
   * @param frameState
   * @param piexl
   * @param callback
   * @param tolerance
   * @returns {*}
   */
  forEachFeatureAtPiexl (frameState,piexl,callback,tolerance) {
    // frameState 携带 view 信息
  
    // 1、计算当前屏幕内的feature
    const features = this._getCurrentExtentFeatures()
    
    // calculate features that their extent has intersected with a given point
    const extentFeatures = this._getIntersectedFeatures(piexl,features)
  
    const result = extentFeatures.filter(function(feature){
      return feature.geometry.containsXY(piexl[0],piexl[1],{tolerance : tolerance})
    })
    
    return result
  }
  
  /**
   *
   * @param point
   * @param features
   * @private
   */
  _getIntersectedFeatures (point, features) {
    return features.filter(function(feature){
      let geometry = feature.geometry
      return geometry.pointInExtent(point)
    })
  }
  
  /**
   *
   * @returns {*}
   * @private
   */
  _getCurrentExtentFeatures () {
    return this.features
  }
  
  /**
   * Remove a feature from features collection
   * @param feature
   * @returns {boolean}
   */
  removeFeature (feature) {
    const features = this.features
    if (features.length === 0) {
      return false
    }
    
    const featureId = feature.id
    const index = features.findIndex(function(f){
      return f.id === featureId
    })
    
    
    if (index > -1) {
      features.splice(index, 1)
      
      this._featureChangeKeys.delete(featureId)
      
      this.dispatchEvent(new FeatureEvent(FeatureEvent.EventType.REMOVE_FEATURE, feature))
      this.changed()
    }
  }
  
  /**
   *
   * @param featureKey
   * @param feature
   * @private
   */
  _setupChangeEvents (featureKey, feature) {
    this._featureChangeKeys.set(featureKey, listen(feature,
      EventType.CHANGE, this._handleFeatureChange, this))
  }
  
  /**
   *
   * @private
   */
  _handleFeatureChange () {
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
  
  /**
   * Getter and Setter for renderBuffer
   * @returns {*|number}
   */
  get renderBuffer() { return this._renderBuffer }
  set renderBuffer (renderBufferValue) {
    if (this._renderBuffer !== renderBufferValue) {
      this._renderBuffer = renderBufferValue
    }
  }
  
  /**
   *
   * @param extent
   * @returns {Array}
   */
  loadFeature (extent) {
    const features = this.features
    
    const intersects = ExtentUtil.intersects
    const createOrUpdate = ExtentUtil.createOrUpdate
    const newFeatures = []
    features.forEach(feature => {
      const geometryExtent = feature.geometry.extent
      const extentArr = createOrUpdate(geometryExtent.xmin,
        geometryExtent.ymin, geometryExtent.xmax, geometryExtent.ymax)
      
      if (intersects(extentArr, extent)) {
        newFeatures.push(feature)
      }
    })
    
    return newFeatures
  }
  
  get styleFunction () { return this._styleFunction }
}
