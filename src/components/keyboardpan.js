/**
 * Created by zhangyong on 2017/8/2.
 */

import Component from './component'
import BrowserEvent from '../meek/browserevent'

import {noModifierKeys, targetNotEditable} from '../utils/mousekey'

export default class KeyboardPan extends Component {
  constructor (options = {}) {
  
    super()
    
    this._defaultCondition = function(mapBrowserEvent) {
      const keyCode = mapBrowserEvent.originalEvent.keyCode
      return noModifierKeys(mapBrowserEvent) && targetNotEditable(mapBrowserEvent) && (
        (keyCode === 40 || keyCode === 37 || keyCode === 39 || keyCode === 38))
    }
  
    /**
     * @private
     */
    this._condition = options.condition !== undefined ?
      options.condition : this._defaultCondition
  
    /**
     * @private
     * @type {number}
     */
    this._duration = options.duration !== undefined ? options.duration : 100
  
    /**
     * @private
     * @type {number}
     */
    this._pixelDelta = options.pixelDelta !== undefined ?
      options.pixelDelta : 128
  }
  
  /**
   * 
   * @param event
   * @returns {boolean}
   */
  handleMouseEvent (mapBrowserEvent) {
    let stopEvent = false
    if (mapBrowserEvent.type === BrowserEvent.KEYDOWN) {
      const keyEvent = mapBrowserEvent.originalEvent
      const keyCode = keyEvent.keyCode
      if (this._condition(mapBrowserEvent) ) {
        const map = mapBrowserEvent.map
        const view = map.view
        const mapUnitsDelta = view.resolution * this._pixelDelta
        let deltaX = 0, deltaY = 0
        
        if (keyCode === 40) {
          deltaY = mapUnitsDelta
        } else if (keyCode === 37) {
          deltaX = -mapUnitsDelta
        } else if (keyCode === 39) {
          deltaX = mapUnitsDelta
        } else {
          deltaY = -mapUnitsDelta
        }
        
        const delta = [deltaX, deltaY]
        super.pan(view, delta, null)
        mapBrowserEvent.preventDefault()
        stopEvent = true
      }
    }
    return !stopEvent
  }
  
}