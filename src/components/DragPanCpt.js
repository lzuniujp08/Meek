/**
 * Created by zhangyong on 2017/6/2.
 */

import Component from './Component'

import BrowserEvent from '../meek/BrowserEvent'
import {noModifierKeys} from '../utils/MouseKey'
import {Coordinate} from '../utils/Coordinate'

/**
 * @class DragPan
 * @extends Component
 * @module component
 * @constructor
 */
export default class DragPan extends Component {
  
  constructor (options = {}) {
    super()
  
  
    this.applyHandleEventOption({
      handleDownEvent: this._handleDownEvent,
      handleDragEvent: this._handleDragEvent
    })
    
    /**
     *
     * @type {Array}
     */
    this.targetPointers = []
  
    /**
     *
     * @type {null}
     */
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
    this._condition = options.condition ?
      options.condition : noModifierKeys
  
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
  // handleMouseEvent (browserEvent) {
  //   if (!(browserEvent instanceof BrowserEvent)) {
  //     return true
  //   }
  //
  //   this._updateTrackedPointers(browserEvent)
  //
  //   let type = browserEvent.type
  //   if (type === BrowserEvent.MOUSE_DOWN) {
  //     this._handleDownEvent(browserEvent)
  //   } else if (type === BrowserEvent.MOUSE_UP){
  //     // this._handleUpEvent(browserEvent)
  //   } else if (type === BrowserEvent.MOUSE_DRAG) {
  //     this._handleDragEvent(browserEvent)
  //   }
  //
  //   return true
  // }
  
  
  /**
   * @param {ol.MapBrowserPointerEvent} mapBrowserEvent Event.
   * @return {boolean} Start drag sequence?
   * @this {ol.interaction.DragPan}
   * @private
   */
  _handleDownEvent (browserEvent) {
    if (this.targetPointers.length > 0 && this._condition(browserEvent)) {
      const map = browserEvent.map
      const view = map.view
      this.lastCentroid = null
      
      // if (!this.handlingDownUpSequence) {
      //   view.setHint(ol.ViewHint.INTERACTING, 1)
      // }
      
      // stop any current animation
      // if (view.getHints()[ol.ViewHint.ANIMATING]) {
      //   view.setCenter(browserEvent.frameState.viewState.center)
      // }
      
      if (this._kinetic) {
        this._kinetic.begin()
      }
      
      // No kinetic as soon as more than one pointer on the screen is
      // detected. This is to prevent nasty pans after pinch.
      this._noKinetic = this.targetPointers.length > 1
      return true
    } else {
      return false
    }
  }
  
  /**
   * Handle the drag event
   * Center of the view will be changed
   * @param browserEvent
   * @private
   */
  _handleDragEvent (browserEvent) {
    const targetPointers = this.targetPointers
    const centroid = this.centroid(targetPointers)

    if (targetPointers.length === this._lastPointersCount) {
      if (this._kinetic) {
        this._kinetic.update(centroid[0], centroid[1])
      }
      
      if (this.lastCentroid) {
        const deltaX = this.lastCentroid[0] - centroid[0]
        const deltaY = this.lastCentroid[1] - centroid[1]
        const map = browserEvent.map
        const view = map.view
        const viewState = view.getViewState()
        const center = [deltaX, deltaY]
        Coordinate.scale(center, viewState.resolution)
        Coordinate.rotate(center, viewState.rotation)
        Coordinate.add(center, viewState.center)
        // center = view.constrainCenter(center)
        view.center = center
      }
    } else if (this._kinetic) {
      this._kinetic.begin()
    }

    this.lastCentroid = centroid
    this._lastPointersCount = targetPointers.length
  }
  
  /**
   * Calculate a center point
   * @param pointerEvents
   * @returns {[*,*]}
   */
  centroid (pointerEvents) {
    const length = pointerEvents.length
    let clientX = 0
    let clientY = 0
    
    for (let i = 0; i < length; i++) {
      clientX += pointerEvents[i].originalEvent.clientX
      clientY += pointerEvents[i].originalEvent.clientY
    }
    
    return [clientX / length, clientY / length]
  }
  
  
  
}