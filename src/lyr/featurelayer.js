
import BaseLayer from './baselayer'
import {Style} from '../style/style'
import {ExtentUtil} from '../geometry/support/extentutil'
import FeatureEvent from '../meek/featureevent'
import {EventType} from '../meek/eventtype'
import {listen, unlistenByKey} from '../core/eventmanager'

/**
 * FeatureLayer
 *
 * class FeatureLayer
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
     * zIndex
     *
     * @property zIndex
     * @type {Number}
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
   * 清除所有features
   *
   * @method clear
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
      this.dispatchEvent(FeatureEvent.EventType.FEATURE_COLLECTION_CHANGED)
      this.changed()
    }
  }

  /**
   * 获取features
   *
   * @returns {Array}
   */
  get features () { return this._features }
  
  /**
   * 通过id查找feature
   *
   * @param id
   * @returns {Boolean}
   */
  findFeature (id) {
    const features = this.features
    return features.find(f => {
      return f.id === id
    })
  }
  
  /**
   * 向layer中添加features
   *
   * @method addFeatures
   * @param {Object} features
   * @returns {Boolean}
   */
  addFeatures (features) {
    if (!Array.isArray(features)) {
      return false
    }
    
    this._addFeaturesInner(features)
    this.dispatchEvent(FeatureEvent.EventType.FEATURE_COLLECTION_CHANGED)
    this.changed()
  }
  
  /**
   * 判断feature是否存在
   *
   * @param feature
   * @returns {Boolean}
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
   * 添加feature到layer的集合中，并派发feature事件
   *
   * addFeaturesInner
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
   * 添加feature到layer的集合中
   *
   * @method addFeature
   * @param feature
   * @returns {Boolean}
   */
  addFeature (feature) {
    if (!feature) {
      return false
    }
    
    this._addFeaturesInner([feature])
    this.dispatchEvent(FeatureEvent.EventType.FEATURE_COLLECTION_CHANGED)
    this.changed()
  }
  
  /**
   * 获取当前鼠标点的所有feature
   *
   * @method forEachFeatureAtPiexl
   * @param frameState
   * @param piexl {Array}
   * @param callback
   * @param tolerance {Number}
   * @returns {*}
   */
  forEachFeatureAtPiexl (frameState,piexl,callback,tolerance) {
    // frameState 携带 view 信息
  
    // 1、计算当前屏幕内的feature
    const features = this._getCurrentExtentFeatures()
    
    // calculate features that their extent has intersected with a given point
    const extentFeatures = this._getIntersectedFeatures(piexl,features)
  
    const piexlX = piexl[0]
    const piexlY = piexl[1]
    const options = {
      tolerance: tolerance * frameState.viewState.resolution
    }
    
    
    const result = extentFeatures.filter(function(feature){
      return feature.geometry.containsXY(piexlX, piexlY, options)
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
   * 从集合中移除feature
   *
   * @param feature
   * @returns {Boolean}
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
      this.dispatchEvent(FeatureEvent.EventType.FEATURE_COLLECTION_CHANGED)
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

  /**
   * 样式读写器
   *
   * @property style
   * @param value
   */
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
   * renderBuffer读写器
   *
   */
  get renderBuffer() { return this._renderBuffer }
  set renderBuffer (renderBufferValue) {
    if (this._renderBuffer !== renderBufferValue) {
      this._renderBuffer = renderBufferValue
    }
  }
  
  /**
   * 加载feature
   *
   * @method loadFeature
   * @param extent {Geometry}
   * @returns {feature}
   */
  loadFeature (extent) {
    const features = this.features
    
    const intersects = ExtentUtil.intersects
    const createOrUpdate = ExtentUtil.createOrUpdate
    const newFeatures = []
    features.forEach(feature => {
      // 判断图形是否显示
      if (feature.display) {
        const geometryExtent = feature.geometry.extent
        const extentArr = createOrUpdate(geometryExtent.xmin,
          geometryExtent.ymin, geometryExtent.xmax, geometryExtent.ymax)

        if (intersects(extentArr, extent)) {
          newFeatures.push(feature)
        }
      }
    })

    return newFeatures
  }

  /**
   * 获取样式
   *
   * @method styleFunction
   * @returns {null|undefined|*}
   */
  get styleFunction () { return this._styleFunction }
}
