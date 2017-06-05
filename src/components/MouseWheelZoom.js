/**
 * Created by zypc on 2017/6/4.
 */

import Component from './Component'


export default class MouseWheelZoom extends Component {
  
  constructor (options){
    
    super()
    
    const iOptions = options || {}
    
    
    
    
    
  }
  
  
  
  handleMouseEvent (mapBrowserEvent){
    const type = mapBrowserEvent.type
    if (type !== BrowserEvent.WHEEL && type !== BrowserEvent.MOUSEWHEEL) {
      return true
    }
  
    mapBrowserEvent.preventDefault()
  
    const map = mapBrowserEvent.map
    const wheelEvent = /** @type {WheelEvent} */ (mapBrowserEvent.originalEvent)
  
    if (this.useAnchor_) {
      this.lastAnchor_ = mapBrowserEvent.coordinate
    }
  
    // Delta normalisation inspired by
    // https://github.com/mapbox/mapbox-gl-js/blob/001c7b9/js/ui/handler/scroll_zoom.js
    let delta
    if (mapBrowserEvent.type == BrowserEvent.WHEEL) {
      delta = wheelEvent.deltaY
      if (ol.has.FIREFOX &&
        wheelEvent.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
        delta /= ol.has.DEVICE_PIXEL_RATIO
      }
      if (wheelEvent.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= 40
      }
    } else if (mapBrowserEvent.type == BrowserEvent.MOUSEWHEEL) {
      delta = -wheelEvent.wheelDeltaY
      if (ol.has.SAFARI) {
        delta /= 3
      }
    }
  
    if (delta === 0) {
      return false
    }
  
    const now = Date.now()
  
    if (this.startTime_ === undefined) {
      this.startTime_ = now
    }
  
    if (!this.mode_ || now - this.startTime_ > this.trackpadEventGap_) {
      this.mode_ = Math.abs(delta) < 4 ?
        ol.interaction.MouseWheelZoom.Mode_.TRACKPAD :
        ol.interaction.MouseWheelZoom.Mode_.WHEEL
    }
  
    if (this.mode_ === ol.interaction.MouseWheelZoom.Mode_.TRACKPAD) {
      const view = map.getView()
      if (this.trackpadTimeoutId_) {
        clearTimeout(this.trackpadTimeoutId_)
      } else {
        view.setHint(ol.ViewHint.INTERACTING, 1)
      }
      this.trackpadTimeoutId_ = setTimeout(this.decrementInteractingHint_.bind(this), this.trackpadEventGap_)
      let resolution = view.getResolution() * Math.pow(2, delta / this.trackpadDeltaPerZoom_)
      const minResolution = view.getMinResolution()
      const maxResolution = view.getMaxResolution()
      let rebound = 0
      if (resolution < minResolution) {
        resolution = Math.max(resolution, minResolution / this.trackpadZoomBuffer_)
        rebound = 1
      } else if (resolution > maxResolution) {
        resolution = Math.min(resolution, maxResolution * this.trackpadZoomBuffer_)
        rebound = -1
      }
      if (this.lastAnchor_) {
        const center = view.calculateCenterZoom(resolution, this.lastAnchor_)
        view.setCenter(view.constrainCenter(center))
      }
      view.setResolution(resolution)
    
      if (rebound === 0 && this.constrainResolution_) {
        view.animate({
          resolution: view.constrainResolution(resolution, delta > 0 ? -1 : 1),
          easing: ol.easing.easeOut,
          anchor: this.lastAnchor_,
          duration: this.duration_
        })
      }
    
      if (rebound > 0) {
        view.animate({
          resolution: minResolution,
          easing: ol.easing.easeOut,
          anchor: this.lastAnchor_,
          duration: 500
        })
      } else if (rebound < 0) {
        view.animate({
          resolution: maxResolution,
          easing: ol.easing.easeOut,
          anchor: this.lastAnchor_,
          duration: 500
        })
      }
      this.startTime_ = now
      return false
    }
  
    this.delta_ += delta
  
    const timeLeft = Math.max(this.timeout_ - (now - this.startTime_), 0)
  
    clearTimeout(this.timeoutId_)
    this.timeoutId_ = setTimeout(this.handleWheelZoom_.bind(this, map), timeLeft)
  
    return false
    
  }
}