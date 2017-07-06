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
export default class Select extends Component {

  constructor (options = {}) {
    super()

    this._hitTolerance = options.hitTolerance ? options.hitTolerance : 6

    /**
     * 选择图层是否配置了样式
     * @type {boolean}
     * @private
       */
    this._hasSelectedStyle = false

    /**
     * 初始化草稿图层，用于临时高亮显示绘制的图形
     *
     * @type {FeatureLayer}
     * @private
     */
    this._selectLayer = new FeatureLayer()

    if(options.style){
      this._selectLayer.style = options.style
      this._hasSelectedStyle = true
    }else{
      this._hasSelectedStyle = false
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

    map.forEachFeatureAtPiexl(pixel, (function(features, layer) {
      if(features.length > 0){

        // 克隆样式
        features.forEach( feature => {
          const styles = layer.styleFunction(feature)
          const newStyles = []
          styles.forEach(style => {
            newStyles.push(style.clone())
          })

          feature.style = newStyles
        })

        // 赋值并填充到selectFeatures中
        this.selectFeatures = features
      }
    }).bind(this), hitTolerance)

    if (this.selectFeatures.length > 0 ) {
      this._forEachStyle()
      this._selectLayer.addFeatures(this.selectFeatures)
    }

    this.dispatchEvent(
      new SelectEvent(SelectEvent.EventType.SELECT, this.selectFeatures,browserEvent))
  }

  /**
   *
   */
  selectClean () {
    this._selectLayer.clear()
    this.selectFeatures.forEach(feature => {
      feature.style = undefined
    })

    this.selectFeatures = []
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

  _forEachStyle () {
    if (this._hasSelectedStyle) {
      return
    }

    const features = this.selectFeatures
    features.forEach ( feature => {
      const styles = feature.style
      styles.forEach ( style => {
        if (style instanceof FillStyle) {
          style.alpha = style.alpha + 0.3
          style.borderStyle.width = style.borderStyle.width + 4
        } else if (style instanceof LineStyle) {
          style.width = style.width + 2
        } else if (style instanceof PointStyle) {
          style.size = style.size + 3
        }
      })
    })
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