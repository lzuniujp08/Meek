/**
 * Created by zhangyong on 2017/5/22.
 */

import BaseEvent from '../core/baseevent'

/**
 * The DrawEvent will emitted while geometrys on drawing end.
 *
 * @class drawevent
 * @extends BaseObject
 * @module component
 *
 *
 */
export default class DrawEvent extends BaseEvent {
  
  /**
   * @constructor
   * @param type
   * @param feature
   */
  constructor (type, feature) {
  
    super(type)
  
    /**
     * The feature being drawn
     */
    this.feature = feature
  }
  
}

/**
 * 定义绘制工具的事件类型
 * @type {{DRAW_START: string, DRAW_END: string}}
 */
DrawEvent.EventType = {
  /**
   * Triggered upon feature draw start
   */
  DRAW_START: 'drawstart',
  
  
  /**
   * Triggered upon feature draw end
   */
  DRAW_END: 'drawend'
}