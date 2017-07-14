/**
 * Created by zhangyong on 2017/6/27.
 */

import BaseEvent from '../core/baseevent'

/**
 * @class RenderEvent
 * @extends BaseEvent
 * @module renderer
 * @constructor
 */
export default class RenderEvent extends BaseEvent {
  
  constructor (type, frameState, context, trasform) {
    
    super(type)
  
  
    /**
     * @property frameState
     * @type {Object}
     */
    this.frameState = frameState
  
  
    /**
     * @property trasform
     * @type {Object}
     */
    this.trasform = trasform
  
    /**
     *@property context
     *@type {HTML5.}
     */
    this.context = context
  }
  
}