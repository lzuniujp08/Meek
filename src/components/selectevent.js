/**
 * Created by zhangyong on 2017/5/25.
 */
/**
 * 选择结束时，SelectEvent将会被派发
 *
 * @class selectevent
 * @extends BaseObject
 * @module component
 *
 *
 */

import BaseEvent from '../core/baseevent'

export default class SelectEvent extends BaseEvent {
  
  constructor (type, features, event) {
    
    super(type)
    
    /**
     * The feature being selected
     */
    this.selectedFeatures = features
  
    /**
     *
     */
    this.browserEvent = event
  }
  
}

/**
 * The select event
 * @type {{SELECT: string}}
 */
SelectEvent.EventType = {
  /**
   * Triggered upon features select
   * @api stable
   */
  SELECT: 'select',
  
}