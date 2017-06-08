/**
 * Created by zypc on 2017/6/4.
 */

import Component from './Component'
import BrowserEvent from '../meek/BrowserEvent'


import {Config} from '../meek/Config'

import {mouseWheel} from '../utils/MouseKey'
import {clamp} from '../utils/Math'


export default class MouseWheelZoom extends Component {
  
  constructor (optionsObj){
    
    super()
    
    const options = optionsObj || {}
  
    this._delta = 0
  
    this._useAnchor = options.useAnchor !== undefined ?
      options.useAnchor : true
  
    this._duration = options.duration !== undefined ?
      options.duration : 250
  
    this._lastAnchor = null
  
    this._startTime = undefined
    
    this._timeout = options.timeout !== undefined ? options.timeout : 80
    
    this._timeoutId = undefined
    
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