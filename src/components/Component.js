/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import BrowserEvent from '../meek/BrowserEvent'
import Obj from '../utils/Obj'

export default class Component extends BaseObject {
  constructor () {
    super()

    this.active = true
    this._mapRenderKey = null
  
    this.targetPointers = null
    this._trackedPointers = {}
  }
  
  /**
   * Handles the browser event and then may call into the subclass functions.
   * @param browserEvent
   */
  handleMouseEvent (browserEvent) {
    
    if(this.active === false){
      return true
    }
  
    browserEvent.coordinate = this.coordinateBeyond(browserEvent.coordinate)
    
    let type = browserEvent.type
    if (type === BrowserEvent.MOUSE_MOVE) {
      this._handleMouseMove(browserEvent)
    } else if (type === BrowserEvent.MOUSE_DOWN) {
      let handled = this._handleDownEvent(browserEvent)
      // this.handlingDownUpSequence = handled;
      // stopEvent = this.shouldStopEvent(handled);
    } else if (type === BrowserEvent.MOUSE_UP){
      // this.handlingDownUpSequence = this._handleUpEvent_(browserEvent)
      this._handleUpEvent(browserEvent)
    }
    
    return true
  }
  
  /**
   *
   * @param browserEvent
   * @returns {boolean}
   * @private
   */
  _isPointerDraggingEvent (browserEvent) {
    const type = browserEvent.type
    return (
      type === BrowserEvent.MOUSE_DOWN ||
      type === BrowserEvent.MOUSE_DRAG ||
      type === BrowserEvent.MOUSE_UP)
  }
  
  /**
   *
   * @param browserEvent
   * @private
   */
  _updateTrackedPointers (browserEvent) {
    if (this._isPointerDraggingEvent(browserEvent)) {
      const event = browserEvent

      if (browserEvent.type == BrowserEvent.MOUSE_UP) {
        delete this._trackedPointers[event.pointerId]
      } else if (browserEvent.type == BrowserEvent.MOUSE_DOWN) {
        this._trackedPointers[event.pointerId] = event
      } else if (event.pointerId in this._trackedPointers) {
        this._trackedPointers[event.pointerId] = event
      }
      this.targetPointers = Obj.getValues(this._trackedPointers)
    }
  }
  
  /**
   *
   * @param view
   * @param delta
   * @param opt_anchor
   * @param opt_duration
   */
  zoomByDelta (view, delta, opt_anchor, opt_duration) {
    const currentResolution = view.resolution
    const resolution = view.constrainResolution(currentResolution, delta, 0)
    
    if (opt_anchor && resolution !== undefined && resolution !== currentResolution) {
      const currentCenter = view.center
      let center = view.calculateCenterZoom(resolution, opt_anchor)
      center = view.constrainCenter(center)
      
      opt_anchor = [
        (resolution * currentCenter[0] - currentResolution * center[0]) /
        (resolution - currentResolution),
        (resolution * currentCenter[1] - currentResolution * center[1]) /
        (resolution - currentResolution)
      ]
    }
    
    this.zoomWithoutConstraints(view, resolution, opt_anchor, opt_duration)
  }
  
  /**
   *
   * @param view
   * @param resolution
   * @param opt_anchor
   * @param opt_duration
   */
  zoomWithoutConstraints (view, resolution, opt_anchor, opt_duration) {
    if (resolution) {
      const currentResolution = view.resolution
      const currentCenter = view.center
      
      if (currentResolution !== undefined && currentCenter &&
          resolution !== currentResolution && opt_duration) {
        // view.animate({
        //   resolution: resolution,
        //   anchor: opt_anchor,
        //   duration: opt_duration,
        //   // easing: 1 - ol.easing.easeIn(1 - t)
        // })
  
        view.resolution = resolution
      } else {
        if (opt_anchor) {
          const center = view.calculateCenterZoom(resolution, opt_anchor)
          view.center = center
        }
        view.resolution = resolution
      }
    }
  }
  
  /**
   *
   * @returns {*|null}
   */
  getViewDataExtent () {
    if (!this._dataExtent) {
      this._dataExtent = this.map.view.dataExtent
    }
    
    return this._dataExtent
  }
  
  /**
   *
   * @param coordinate
   * @returns {Array}
   */
  coordinateBeyond (coordinate) {
    let newCoordinate = new Array(2)
    
    const x = coordinate[0]
    const y = coordinate[1]
  
    newCoordinate[0] = x
    newCoordinate[1] = y
  
    if (x <= 0) {
      newCoordinate[0] = 0
    }
    
    if (y <= 0) {
      newCoordinate[1] = 0
    }
    
    const extent = this.getViewDataExtent()
    
    if (extent) {
      if (x >= extent[2]) {
        newCoordinate[0] = extent[2]
      }
      
      if (y >= extent[3]) {
        newCoordinate[1] = extent[3]
      }
    }
    
    return newCoordinate
  }

  get map () { return this._map }
  set map (value) { this._map = value }

  get active () { return this._active }
  set active (value) {
    this._active = value
  }
}
