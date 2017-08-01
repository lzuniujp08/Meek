/**
 * Created by zhangyong on 2017/6/9.
 */

/**
 * 修改结束时，ModifyEvent将会被派发
 *
 * @class modifyevent
 * @extends BaseObject
 * @module component
 *
 */
import BaseEvent from '../core/baseevent'

export default class ModifyEvent extends BaseEvent {
  
  constructor (type, features, event) {
    super(type)
  
    /**
     * features being modified.
     */
    this.features = features
  
    /**
     * BrowserEvent
     */
    this.browserEvent = event
  }
  
}


ModifyEvent.EventType = {
  
  /**
   * Triggered on features modification start.
   */
  MODIFY_START: 'modifystart',
  
  /**
   * Triggered on features modification end
   */
  MODIFY_END: 'modifyend'
  
}