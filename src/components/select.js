/**
 * Created by zhangyong on 2017/5/23.
 */

import Component from './component'
import BrowserEvent from '../meek/browserevent'
import FeatureLayer from '../lyr/featurelayer'
import {listen, unlistenByKey} from '../core/eventmanager'
import {EventType} from '../meek/eventtype'
import {Style} from '../style/style'
import SelectEvent from '../components/selectevent'

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

    this._multiSelectMode = false
    
    /**
     * 初始化草稿图层，用于临时高亮显示绘制的图形
     *
     * @type {FeatureLayer}
     * @private
     */
    this._selectLayer = new FeatureLayer()

    if (options.style) {
      this._selectLayer.style = options.style
      this._hasSelectedStyle = true
    } else {
      this._hasSelectedStyle = false
    }

    this._selectFeatures = []

    this.selectMode = options.selectMode ? options.selectMode : BrowserEvent.CLICK

    this._selectMultiMode = options.selectMultiMode ?
      options.selectMultiMode : function () { return true }

    /**
     * listen Ctrl key envet
     */
    if (options.selectMultiMode) {
      listen(document, 'keydown', this._handleCtrlKeyDwon, this)
    }
    if (options.selectMultiMode) {
      listen(document, 'keyup', this._handleCtrlKeyUp, this)
    }

  }

  _condition (event) {
    return this.selectMode === event.type
  }

  _keyPress () {}

  /**
   * handle Ctrl key down event
   * @param event
   * @private
   */
  _handleCtrlKeyDwon (event) {
    if (this._selectMultiMode(event)) {
      this._multiSelectMode = true
    }
  }

  /**
   * handle Ctrl key up event
   * @param event
   * @private
   */
  _handleCtrlKeyUp (event) {
    // Ctrl button down
    if (this._selectMultiMode(event)) {
      this._multiSelectMode = false
    }
  }

  /**
   * Handler mouse event
   * @param browserEvent
   */
  handleMouseEvent (browserEvent) {
    if (!this._condition(browserEvent)) {
      return true
    }

    const map = browserEvent.map
    const pixel = browserEvent.pixel
    const hitTolerance = this._hitTolerance

    if (!this._multiSelectMode) {
      this.clear()
    }

    map.forEachFeatureAtPiexl(pixel, (function(features, layer) {
      if(features.length > 0){

        // 克隆样式
        features.forEach( feature => {
          let styles
          if (feature.style) {
            styles = feature.style
          } else {
            styles = layer.styleFunction(feature)
          }
          
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

    // 派发要素的选择事件
    this.dispatchEvent(
      new SelectEvent(SelectEvent.EventType.SELECT, this.selectFeatures,browserEvent))
  }
  
  /**
   * 清空选择的集合
   *
   * @method clear
   */
  clear () {
    this._selectLayer.clear()
    
    this.selectFeatures.forEach(feature => {
      feature.styleHighLight = false
      feature.delete('hasmutilselected')
    })

    this.selectFeatures = []
  }
  
  /**
   * 当前选中要素的集合
   *
   * @property selectFeatures
   * @type {Array}
   */
  get selectFeatures () { return this._selectFeatures }
  set selectFeatures (features) {
    if (features.length === 0 ) {
      this._selectFeatures = []
    } else {
      features.forEach( feature => {
        // 去掉重复的
        if (!this._isInSelectFeatures(feature)) {
          this._selectFeatures.push(feature)
        }
      })
    }
  }
  
  /**
   * 判断当前选中的集合中是否包含指定的feature
   *
   * @param feature 传入的feature对象
   * @returns {boolean} 有就返回true, 无就返回false
   * @private
   */
  _isInSelectFeatures (feature) {
    const features = this.selectFeatures
    
    const result = features.find(function(f){
      return f.id === feature.id
    })
    
    return result === undefined ? false : true
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
   * @private
   */
  _forEachStyle () {
    if (this._hasSelectedStyle) {
      return
    }

    const features = this.selectFeatures
    features.forEach ( feature => {
      if (!feature.get('hasmutilselected')) {
        feature.styleHighLight = true
        feature.set('hasmutilselected', true)
      }
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
      this.clear()
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