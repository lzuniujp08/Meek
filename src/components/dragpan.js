/**
 * Created by zhangyong on 2017/6/2.
 */

import Component from './component'
import {noModifierKeys} from '../utils/mousekey'
import {Coordinate} from '../utils/coordinate'

/**
 * 拖动事件基础类
 *
 * @class DragPan
 * @extends Component
 * @module component
 * @constructor
 */
export default class DragPan extends Component {

  /**
   * 构造函数
   *
   * @constructor
   * @param options
   */
  constructor (options = {}) {
    super()

    this.applyHandleEventOption({
      handleDownEvent: this._handleDownEvent,
      handleDragEvent: this._handleDragEvent
    })
    
    /**
     * @property tragetPointers
     * @type {Array}
     */
    this.targetPointers = []
  
    /**
     * @property lastCentroid
     * @type {null}
     */
    this.lastCentroid = null
  
    /**
     * kinetic
     * @private
     * @type {ol.Kinetic|undefined}
     */
    this._kinetic = options.kinetic
  
    /**
     * @property lastCentroid
     * @type {ol.Pixel}
     */
    this.lastCentroid = null
  
    /**
     * @property lastPointersCount
     * @private
     * @type {number}
     */
    this._lastPointersCount = null
  
    /**
     * @property conidtion
     * @private
     * @type {ol.EventsConditionType}
     */
    this._condition = options.condition ?
      options.condition : noModifierKeys
  
    /**
     * @property noKinetic
     * @private
     * @type {boolean}
     */
    this._noKinetic = false
    
  }
  
  /**
   * 处理browserEvent
   *
   * @param browserEvent {BrowserPointerEvent} mapBrowserEvent Event.
   * @return {boolean} Start drag sequence?
   * @this {DragPan}
   * @private
   */
  _handleDownEvent (browserEvent) {
    if (this.targetPointers.length > 0 && this._condition(browserEvent)) {
      this.lastCentroid = null
      
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
   * handleDragEvent
   * @param browserEvent {browserEvent}
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
   * 计算视图的中心点
   *
   * @method centroid
   * @param pointerEvents {pointerEvents}
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