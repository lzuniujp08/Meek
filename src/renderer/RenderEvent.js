/**
 * Created by zhangyong on 2017/6/27.
 */

import BaseEvent from '../core/BaseEvent'

export default class RenderEvent extends BaseEvent {
  
  constructor (type, frameState, context, trasform) {
    
    super(type)
  
  
    /**
     *
     */
    this.frameState = frameState
  
  
    /**
     *
     */
    this.trasform = trasform
  
    /**
     *
     */
    this.context = context
  }
  
}