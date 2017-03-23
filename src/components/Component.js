/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import BrowserEvent from '../meek/BrowserEvent'

export default class Component extends BaseObject {
  constructor () {
    super()

    this.active = true
  }

  handleMouseEvent (browserEvent) {
    let type = browserEvent.type
    if (type === BrowserEvent.MOUSE_MOVE) {
      this._handleMouseMove(browserEvent)
    }
  }

  get workspace () { return this._ws }
  set workspace (value) {
    this._ws = value
    this._updateState()
  }

  get active () { return this._active }
  set active (value) {
    this._active = value
  }
}
