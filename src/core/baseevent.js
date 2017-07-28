/**
 * Created by zhangyong on 2017/5/22.
 */

/**
 * The BaseEvent is a base class, all event dinfined in library should inherit this.
 *
 * The sub event class can define it's own property ,
 *
 * which can be passed to other event Listener via event dispatch.
 *
 *
 * 定义事件模型基类，自定义事件必须继承该类。
 *
 * 事件类及其继承者用于事件传递、数据传送和信息通告。
 *
 * @class BaseEvent
 * @constructor
 * @module core
 *
 */
export default class BaseEvent {
  
  /**
   * Create a BaseEvent
   *
   * @constructor
   * @param type
   */
  constructor (type) {
  
    /**
     * 是否停止事件的冒泡
     *
     * @type {Boolean}
     * @property propagatinoStopped
     */
    this.propagatinoStopped = false
  
    /**
     * 事件标示
     *
     * @example'mousedown' | 'mousemove' | 'click'
     *
     * The event type.
     * @type {string}
     * @property type
     */
    this.type = type
  
    /**
     * The event target.
     *
     * 事件源
     *
     * @type {Object}
     * @property target
     */
    this.target = null
  }
  
}

/**
 * stop propagation from dom event
 *
 * 用于阻止事件的冒泡
 *
 * @param evt {Object} evt DOM event model
 * @static
 * @method stopPropagation
 */
BaseEvent.stopPropagation = function(evt) {
  evt.stopPropagation()
}


/**
 * Prevent the default action from browser
 *
 * 用于阻止浏览器的默认行为
 *
 * @static
 * @method preventDefault
 * @param evt {Object} evt DOM event model
 */
BaseEvent.preventDefault = function(evt) {
  evt.preventDefault()
}
