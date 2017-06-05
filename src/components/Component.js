/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import BrowserEvent from '../meek/BrowserEvent'
import {Obj} from '../utils/Obj'

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
  }

  _isPointerDraggingEvent (browserEvent) {
    const type = browserEvent.type
    return (
      type === BrowserEvent.MOUSE_DOWN ||
      type === BrowserEvent.MOUSE_DRAG ||
      type === BrowserEvent.MOUSE_UP)
  }

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

  get map () { return this._map }
  set map (value) { this._map = value }

  get active () { return this._active }
  set active (value) {
    this._active = value
  }
}
