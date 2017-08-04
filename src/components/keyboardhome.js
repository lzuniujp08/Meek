/**
 * Created by zhangyong on 2017/8/3.
 */

import Component from './component'
import {targetNotEditable, noModifierKeys} from '../utils/mousekey'

/**
 *
 */
export default class KeyboardHome extends Component {
  
  constructor (options = {}) {
    super()
  
    this._defaultCondition = function(mapBrowserEvent) {
      const keyCode = mapBrowserEvent.originalEvent.keyCode
      return noModifierKeys(mapBrowserEvent) && targetNotEditable(mapBrowserEvent) && (
          (keyCode === 36))
    }
    
    /**
     * @private
     * @type {ol.EventsConditionType}
     */
    this._condition = options.condition ? options.condition : this._defaultCondition
  }
  
  /**
   *
   * @param mapBrowserEvent
   */
  handleMouseEvent (mapBrowserEvent) {
    let stopEvent = false
    if (this._condition(mapBrowserEvent)) {
      this._goToHome()
    }
  
    return !stopEvent
  }
  
  /**
   * 将视图还原到最初
   * @private
   */
  _goToHome () {
    const view = this.map.view
    if (view) {
      const orignalCenter = view.originalCenter
      const originalResolution = view.originalResolution
      
      view.center = orignalCenter
      view.resolution = originalResolution
    }
  }
}