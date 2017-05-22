/**
 * Created by zhangyong on 2017/5/22.
 */


import BaseEvent from '../core/BaseEvent'

export default class DrawEvent extends BaseEvent {
  
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
 * @type {{DRAWSTART: string, DRAWEND: string}}
 */
DrawEvent.EventType = {
  /**
   * Triggered upon feature draw start
   * @api stable
   */
  DRAWSTART: 'drawstart',
  
  
  /**
   * Triggered upon feature draw end
   * @api stable
   */
  DRAWEND: 'drawend'
  
}