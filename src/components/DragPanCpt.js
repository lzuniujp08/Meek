/**
 * Created by zhangyong on 2017/6/2.
 */


import Component from './Component'

import BrowserEvent from '../meek/BrowserEvent'

// import {Style} from '../style/Style'
//
// import FeaureLayer from '../lyr/FeatureLayer'
// import Feature from '../meek/Feature'
// import Geometry from '../geometry/Geometry'
// import Point from '../geometry/Point'
// import Line from '../geometry/Line'
// import Polygon from '../geometry/Polygon'
// import Extent from '../geometry/Extent'
// import {ExtentUtil} from '../geometry/support/ExtentUtil'
// import {listen, unlistenByKey} from '../core/EventManager'
// import {EventType} from '../meek/EventType'
//
// import DrawEvent from './DrawEvent'

/**
 * DrawCpt class is resonsibility to draw geometries.
 */
export default class DragPanCpt extends Component {
  
  constructor (optOptions) {
    
    super()
    
    const options = optOptions ? optOptions : {}
  
  
    this.targetPointers = []
  
    this.lastCentroid = null
  
    /**
     * @private
     * @type {ol.Kinetic|undefined}
     */
    this._kinetic = options.kinetic
  
    /**
     * @type {ol.Pixel}
     */
    this.lastCentroid = null
  
    /**
     * @type {number}
     */
    this._lastPointersCount = null
  
    /**
     * @private
     * @type {ol.EventsConditionType}
     */
    this.condition_ = options.condition ?
      options.condition : ol.events.condition.noModifierKeys
  
    /**
     * @private
     * @type {boolean}
     */
    this._noKinetic = false
    
  }
  
  
  /**
   * Handles the browser event and then may call into the subclass functions.
   * @param browserEvent
   */
  handleMouseEvent (browserEvent) {
    let type = browserEvent.type
    if (type === BrowserEvent.MOUSE_MOVE) {
      this._handleMouseMove(browserEvent)
    } else if (type === BrowserEvent.MOUSE_DOWN) {
      this._handleDownEvent(browserEvent)
    } else if (type === BrowserEvent.MOUSE_UP){
      this._handleUpEvent(browserEvent)
    } else if (type === BrowserEvent.MOUSE_DRAG) {
      this._handleDragEvent(browserEvent)
    }
  }
  
  
  
  
  /**
   * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
   * @return {boolean} Start drag sequence?
   * @this {ol.interaction.DragPan}
   * @private
   */
  _handleDownEvent (browserEvent) {
    if (this.targetPointers.length > 0 && this.condition_(browserEvent)) {
      const map = browserEvent.map
      const view = map.view
      this.lastCentroid = null
      
      // if (!this.handlingDownUpSequence) {
      //   view.setHint(ol.ViewHint.INTERACTING, 1)
      // }
      
      // stop any current animation
      if (view.getHints()[ol.ViewHint.ANIMATING]) {
        view.setCenter(browserEvent.frameState.viewState.center)
      }
      
      if (this._kinetic) {
        this._kinetic.begin()
      }
      
      // No kinetic as soon as more than one pointer on the screen is
      // detected. This is to prevent nasty pans after pinch.
      this.noKinetic_ = this.targetPointers.length > 1
      return true
    } else {
      return false
    }
  }
  
  /**
   * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
   * @this {ol.interaction.DragPan}
   * @private
   */
  _handleDragEvent (mapBrowserEvent) {
    const targetPointers = this.targetPointers
    const centroid = this.centroid(targetPointers)
    if (targetPointers.length == this.lastPointersCount_) {
      if (this._kinetic) {
        this._kinetic.update(centroid[0], centroid[1])
      }
      
      if (this.lastCentroid) {
        const deltaX = this.lastCentroid[0] - centroid[0]
        const deltaY = centroid[1] - this.lastCentroid[1]
        const map = mapBrowserEvent.map
        const view = map.view()
        const viewState = view.getState()
        const center = [deltaX, deltaY]
        coordinate.scale(center, viewState.resolution)
        coordinate.rotate(center, viewState.rotation)
        coordinate.add(center, viewState.center)
        center = view.constrainCenter(center)
        view.center = center
      }
    } else if (this.kinetic_) {
      // reset so we don't overestimate the kinetic energy after
      // after one finger down, tiny drag, second finger down
      this._kinetic.begin()
    }
    this.lastCentroid = centroid
    this.lastPointersCount_ = targetPointers.length
  }
  
  centroid (pointerEvents) {
    const length = pointerEvents.length
    let clientX = 0
    let clientY = 0
    
    for (let i = 0; i < length; i++) {
      clientX += pointerEvents[i].clientX
      clientY += pointerEvents[i].clientY
    }
    
    return [clientX / length, clientY / length]
  }
  
  
  
}