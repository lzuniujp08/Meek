/**
 * Created by zhangyong on 2017/5/23.
 */

import Component from './Component'

import BrowserEvent from '../meek/BrowserEvent'
import FeaureLayer from '../lyr/FeatureLayer'
import {listen, unlistenByKey} from '../core/EventManager'
import {EventType} from '../meek/EventType'
import {Style} from '../style/Style'

import FillStyle from '../style/FillStyle'
import LineStyle from '../style/LineStyle'

import Feature from '../meek/Feature'


export default class SelectCpt extends Component {
  
  constructor (options) {
    super()
    
    
    const opt = options ? options : {}
    
    this.selectMode = opt.selectMode ? opt.selectMode : BrowserEvent.SINGLE_CLICK
    
    this._hitTolerance = opt.hitTolerance ? opt.hitTolerance : 2
  
  
    /**
     * 初始化草稿图层，用于临时高亮显示绘制的图形
     *
     * @type {FeatureLayer}
     * @private
     */
    this._selectLayer = new FeaureLayer()
    // this._selectLayer.style = this.getDefaultStyleFunction()
    
    this._selectFeatures = []
    
  }
  
  _condition (event) {
    return this.selectMode === event.type
  }
  
  handleMouseEvent (browserEvent) {
    if (!this._condition(browserEvent)) {
      return
    }
    
    const map = browserEvent.map
    const pixel = browserEvent.pixel
    const hitTolerance = this._hitTolerance
    
    this._selectLayer.clear()
    
    map.forEachFeatureAtPiexl(pixel, (function(features) {
      if(features.length > 0){
        this.selectFeatures = features
        this.getHightLighStyleForFeature()
        this._selectLayer.addFeatures(features)
      }
    }).bind(this), hitTolerance)
  }
  
  set selectFeatures (features) {
    features.forEach( feature =>
      this._selectFeatures.push(feature.clone())
    )
  }
  
  get selectFeatures () { return this._selectFeatures }
  
  /**
   * Update the drawing state for aborting drawing if active is false
   * @private
   */
  _updateState () {
    const map = this.map
    const active = this.active
    if (!map || !active){
      // this._abortDrawing()
    }
    
    this._selectLayer.map = active ? map : null
  }
  
  getHightLighStyleForFeature () {
    const features = this.selectFeatures
    features.forEach (function(feature) {
      const styles = feature.style
      styles.forEach (function(style){
        if (style instanceof FillStyle ) {
          style.alpha = style.alpha + 0.2
          style.borderStyle.width = style.borderStyle.width + 2
        } else if (style instanceof LineStyle) {
          style.width = style.width + 2
        }
      })
    })
  }
  
  set map (map) {
    if (this._mapRenderKey) {
      unlistenByKey(this._mapRenderKey)
      this._mapRenderKey = null
    }
    
    if (map) {
      this._map = map
      this._mapRenderKey = listen(this, EventType.CHANGE, map.render, map)
    }
    
    this._updateState()
  }
  
  get map (){ return this._map }
  
  /**
   * Get the default style which will be used while a feature is drawn
   * @returns {Function}
   */
  getDefaultStyleFunction () {
    const styles = Style.createDefaultEditing()
    return function (feature) {
      return styles[feature.geometry.geometryType]
    }
  }
}