/**
 * Created by zhangyong on 2017/5/25.
 */

import BaseEvent from '../core/baseEvent'

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