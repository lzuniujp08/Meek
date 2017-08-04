/**
 * Created by zhangyong on 2017/8/2.
 */

import Component from './component'
import BrowserEvent from '../meek/browserevent'
import {targetNotEditable} from '../utils/mousekey'

export default class KeyboardZoom extends Component {
  constructor (options = {}) {
    super()
  
    /**
     * @private
     */
    this._condition = options.condition ? options.condition : targetNotEditable
  
    /**
     * @private
     * @type {number}
     */
    this._delta = options.delta ? options.delta : 1
    
  }
  
  /**
   *
   * @param mapBrowserEvent
   * @returns {boolean}
   */
  handleMouseEvent (mapBrowserEvent) {
    let stopEvent = false
    if (mapBrowserEvent.type == BrowserEvent.KEYDOWN ||
        mapBrowserEvent.type == BrowserEvent.KEYPRESS) {
      const keyEvent = mapBrowserEvent.originalEvent
      const charCode = keyEvent.charCode
      if (this._condition(mapBrowserEvent) &&
        (charCode == '+'.charCodeAt(0) || charCode == '-'.charCodeAt(0))) {
        const map = mapBrowserEvent.map
        const delta = (charCode == '+'.charCodeAt(0)) ? this._delta : -this._delta
        const view = map.view
        super.zoomByDelta(view, delta, undefined, null)
        mapBrowserEvent.preventDefault()
        stopEvent = true
      }
    }
    
    return !stopEvent
  }
  
}