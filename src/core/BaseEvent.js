/**
 * Created by zhangyong on 2017/5/22.
 */

/**
 * The BaseEvent is a base class, all event dinfined in library should inherit this. <br/>
 * The sub event class can define it's own property , <br/>
 * which can be passed to other event Listener via event dispatch.<br/>
 *
 * 定义事件模型基类，自定义事件必须继承该类
 *
 * @class BaseEvent
 * @constructor
 * @module core
 *
 */
export default class BaseEvent {
  
  /**
   * Create a BaseEvent
   * @param type
   */
  constructor (type) {
  
    /**
     * 是否停止事件的冒泡
     * @type {boolean}
     * @property propagatinoStopped
     */
    this.propagatinoStopped = false
  
    /**
     * The event type.
     * @type {string}
     * @property type
     */
    this.type = type
  
    /**
     * The event target.
     * @type {Object}
     * @property target
     */
    this.target = null
  }
  
}

/**
 * stop propagation from dom event
 * @param {Event|Event} evt Event
 * @static
 * @method stopPropagation
 * @param {Object} evt DOM event model
 */
BaseEvent.stopPropagation = function(evt) {
  evt.stopPropagation()
}


/**
 * Prevent the default action from browser
 * @param {Event|Event} evt Event
 * @static
 * @method preventDefault
 * @param {Object} evt DOM event model
 */
BaseEvent.preventDefault = function(evt) {
  evt.preventDefault()
}
