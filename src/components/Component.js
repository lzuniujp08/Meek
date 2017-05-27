/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import BrowserEvent from '../meek/BrowserEvent'



export default class Component extends BaseObject {
  constructor () {
    super()

    this.active = true
    this._mapRenderKey = null
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

  get map () { return this._map }
  set map (value) { this._map = value }

  get active () { return this._active }
  set active (value) {
    this._active = value
  }
}
