/**
 * Created by zhangyong on 2017/5/23.
 */

import Component from './Component'
import BrowserEvent from '../meek/BrowserEvent'
import FeatureLayer from '../lyr/FeatureLayer'
import {listen, unlistenByKey} from '../core/EventManager'
import {EventType} from '../meek/EventType'
import {Style} from '../style/Style'

import FillStyle from '../style/FillStyle'
import LineStyle from '../style/LineStyle'
import PointStyle from '../style/PointStyle'

import SelectEvent from '../components/SelectEvent'

/**
 * The select component can be used for features selecting.
 * By default,selected features are styled differently, so this
 *
 *
 * @class Select
 * @extends Component
 * @module component
 * @constructor
 */
let hasSelectedStyle = true
let fillChanged = false
let pointChanged = false
let lineChanged = false
export default class Select extends Component {

  constructor (options = {}) {
    super()

    this._hitTolerance = options.hitTolerance ? options.hitTolerance : 6


    /**
     * 初始化草稿图层，用于临时高亮显示绘制的图形
     *
     * @type {FeatureLayer}
     * @private
     */
    if(options.style){
      this._selectLayer = new FeatureLayer({
        style: options.style
      })
    }else{
      hasSelectedStyle = false
      this._selectLayer = new FeatureLayer({})
    }

    this._selectFeatures = []

    this.selectMode = options.selectMode ? options.selectMode : BrowserEvent.CLICK
  }

  _condition (event) {
    return this.selectMode === event.type
  }

  /**
   * Handler mouse event
   * @param browserEvent
   */
  handleMouseEvent (browserEvent) {
    if (!this._condition(browserEvent)) {
      return true
    }

    if (this.active === false) {
      return true
    }

    const map = browserEvent.map
    const pixel = browserEvent.pixel
    const hitTolerance = this._hitTolerance

    this.selectClean()

    map.forEachFeatureAtPiexl(pixel, (function(features) {
      if(features.length > 0){
        this.selectFeatures = features
      }
    }).bind(this), hitTolerance)

    if (this.selectFeatures.length > 0 ) {

      this.forEachStyle()
      this._selectLayer.addFeatures(this.selectFeatures)

      // dispatch the select event after some features selected successfully
    }

    this.dispatchEvent(
      new SelectEvent(SelectEvent.EventType.SELECT, this.selectFeatures,browserEvent))
  }

  /**
   *
   */
  selectClean () {
    this._selectLayer.clear()
    this.selectFeatures = []
    Number
 /*   this.forEachStyleRS()*/
  }

  get selectFeatures () { return this._selectFeatures }
  set selectFeatures (features) {
    if (features.length === 0 ) {
      this._selectFeatures = []
    } else {
      features.forEach( feature =>
        this._selectFeatures.push(feature)
      )
    }
  }

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

  /**
   *
   */
  forEachStyle () {
    if(hasSelectedStyle){
      return
    }
    const layer = this.map.layers[1]
    const features = this.selectFeatures
    features.forEach (function(feature) {
      let styles = []
      if(feature.style){
        styles = feature.style
      }else{
        let styleFunction = layer.styleFunction
        if (styleFunction) {
          let oldStyle
          oldStyle = styleFunction(feature)
          let newStyle = oldStyle[0].clone()
          styles.push(newStyle)
        }
      }

      styles.forEach (function(style){
        if (style instanceof FillStyle) {
          if(fillChanged){return}
          style.alpha = style.alpha + 0.5
          style.borderStyle.width = style.borderStyle.width + 4
          fillChanged = true
        } else if (style instanceof LineStyle) {
          if(lineChanged){return}
          style.width = style.width + 5
          lineChanged = true
        } else if (style instanceof PointStyle) {
          if(pointChanged){return}
          style.size = style.size + 4
          pointChanged = true
        }
      })
    })
  }

  // restore style
  forEachStyleRS () {
    if(hasSelectedStyle){
      return
    }
    if(!this.map){
      return
    }
    const layer = this.map.layers[1]
    if(fillChanged){
      layer._style.extent[0].alpha = layer._style.extent[0].alpha - 0.2
      layer._style.extent[0].borderStyle._width = layer._style.extent[0].borderStyle._width  -2
      fillChanged = false
    }
    if(lineChanged){
      layer._style.line[0]._width = layer._style.line[0]._width - 5
      lineChanged = false
    }
    if(pointChanged){
      layer._style.point[0].size = layer._style.point[0].size - 4
      pointChanged = false
    }


  }

  get map (){ return this._map }
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

  get selectMode () { return this._selectMode }
  set selectMode (value) {
    if (this._selectMode !== value) {
      this._selectMode = value
      this.selectClean()
    }
  }

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