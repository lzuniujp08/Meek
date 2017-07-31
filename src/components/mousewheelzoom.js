/**
 * Created by zypc on 2017/6/4.
 */

import Component from './component'
import BrowserEvent from '../meek/browserevent'


import {Config} from '../meek/config'

import {mouseWheel} from '../utils/mousekey'
import {clamp} from '../utils/math'

/**
 * 鼠标滚轮缩放基类
 *
 *
 * @class MouseWheelZoom
 * @extends Component
 * @module component
 * @constructor
 */
export default class MouseWheelZoom extends Component {

  /**
   * 构造函数
   *
   * @constructor
   * @param options
   */
  constructor (options = {}){
    
    super()
  
    /**
     * 私有属性Delta，默认为0
     *
     * @property delta
     * @type {Number}
     * @private
     */
    this._delta = 0
  
    /**
     * 私有属性useAnchor
     *
     * @property useAnchor
     * @type {Boolean}
     * @private
     */
    this._useAnchor = options.useAnchor !== undefined ?
      options.useAnchor : true
  
    /**
     * 私有属性duration
     *
     * @property duration
     * @type {Boolean}
     * @private
     */
    this._duration = options.duration !== undefined ?
      options.duration : 250
  
    /**
     * 私有属性lastAnchor
     *
     * @property lastAnchor
     * @type {null}
     * @private
     */
    this._lastAnchor = null
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._startTime = undefined
  
    /**
     *
     * @type {number}
     * @private
     */
    this._timeout = options.timeout !== undefined ? options.timeout : 80
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._timeoutId = undefined
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._mode = undefined
  }
  
  
  /**
   *
   * @param mapBrowserEvent
   * @returns {boolean}
   */
  handleMouseEvent (mapBrowserEvent){
    if (!mouseWheel(mapBrowserEvent)) {
      return true
    }
  
    mapBrowserEvent.preventDefault()
  
    const map = mapBrowserEvent.map
    const wheelEvent = mapBrowserEvent.originalEvent
  
    if (this._useAnchor) {
      this._lastAnchor = mapBrowserEvent.coordinate
    }
  
    // Delta normalisation inspired by
    // https://github.com/mapbox/mapbox-gl-js/blob/001c7b9/js/ui/handler/scroll_zoom.js
    let delta
    if (mapBrowserEvent.type == BrowserEvent.WHEEL) {
      delta = wheelEvent.deltaY
    } else if (mapBrowserEvent.type == BrowserEvent.MOUSE_WHEEL) {
      delta = -wheelEvent.wheelDeltaY
    }
  
    if (delta === 0) {
      return false
    }
  
    const now = Date.now()
  
    if (this._startTime === undefined) {
      this._startTime = now
    }
  
    this._delta += delta
  
    const timeLeft = Math.max(this._timeout - (now - this._startTime), 0)
  
    clearTimeout(this._timeoutId)
    this._timeoutId = setTimeout(() => this._handleWheelZoom(map), timeLeft)
  
    return false
  }
  
  /**
   * Zoom to the map
   *
   * handleWheelZoom
   * @param map
   * @private
   */
  _handleWheelZoom (map) {
    const view = map.view
    // if (view.getAnimating()) {
    //   view.cancelAnimations()
    // }
    
    const maxDelta = Config.MOUSE_WHEEL_ZOOM_MAXDELTA
    const delta = clamp(this._delta, -maxDelta, maxDelta)
    
    this.zoomByDelta(view, -delta, this._lastAnchor, this._duration)
    
    this._mode = undefined
    this._delta = 0
    this._lastAnchor = null
    this._startTime = undefined
    this._timeoutId = undefined
  }
}