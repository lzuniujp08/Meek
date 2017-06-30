/**
 * Created by zypc on 2016/11/13.
 */

/**
 *
 * The event processor for all subclasss, which can allow subclass
 * to handle event dispatching and listening.This is the top level class <br/>
 *
 * 顶层事件处理器类,让子类具备事件的监听和派发
 *
 * @class Event
 * @module core
 * @constructor new Event()
 *
 */
export default class Event {
  
  /**
   * Event's constructor
   * @method constructor
   */
  constructor () {
    this._pendingRemovals = {}

    this._listeners = {}
    this._dispatching = {}

    this.nullFunction = function () {}
  }
  
  /**
   * Get all listeners by the passed event type
   * <br/> 根据事件标识获取对应标识的方法列表
   * @method getListeners
   * @param type {String} event type 事件标识
   * @return Array | null 返回对应事件标示的函数数组
   */
  getListeners (type) {
    return this._listeners[type]
  }
  
  /**
   * Determine if exist the listeners by the event type
   * <br/> 判断是否含有对应事件标识的监听
   * @method hasListener
   * @param optType {Boolean} 可选
   * @returns {Boolean} ture if exsit ,false otherwise
   */
  hasListener (optType) {
    return optType ? optType in this._listeners : Object.keys(this._listeners).length > 0
  }
  
  /**
   * Remove the event listener
   * <br/>移除事件监听
   * @method removeEventListener
   * @param type {String} event type
   * @param listener {Array} 事件对应的监听函数数组
   */
  removeEventListener (type, listener) {
    const listeners = this._listeners[type]
    if (listeners) {
      let index = listeners.indexOf(listener)

      if (type in this._pendingRemovals) {
        listeners[index] = this.nullFunction
        ++this._pendingRemovals[type]
      } else {
        listeners.splice(index, 1)

        if (listeners.length === 0) {
          delete this._listeners[type]
        }
      }
    }
  }
  
  /**
   * Add the event listener by given event type and handler function
   * <br/> 添加事件监听,需要指定事件标示和处理方法
   *
   * @example
   *    map.addEventListener('singleclick', function(event) {})
   *
   * @method addEventListener
   * @param type {String} event type
   * @param listener {Array} listeners for event type
   */
  addEventListener (type, listener) {
    let listeners = this._listeners[type]
    if (!listeners) {
      listeners = this._listeners[type] = []
    }

    if (listeners.indexOf(listener) === -1) {
      listeners.push(listener)
    }
  }
  
  /**
   * Dispatch a event by the event type
   * <br/> 事件派发
   *
   * @example
   * this.dispatchEvent(EventType.CHANGE)
   *
   * @method dispatchEvent
   * @param event {String} event type string
   * @returns {Boolean} ture if success ,false otherwise.
   */
  dispatchEvent (event) {
    const evt = typeof event === 'string' ? {type: event} : event
    const type = evt.type
    evt.target = this
    const listeners = this._listeners[type]
    let propagate

    if (listeners) {
      if (!(type in this._dispatching)) {
        this._dispatching[type] = 0
        this._pendingRemovals[type] = 0
      }

      ++this._dispatching[type]

      for (let i = 0, ii = listeners.length; i < ii; ++i) {
        if (listeners[i].call(this, evt) === false || evt.propagationStopped) {
          propagate = false
          break
        }
      }

      --this._dispatching[type]

      if (this._dispatching[type] === 0) {
        let pendingRemovals = this._pendingRemovals[type]
        delete this._pendingRemovals[type]

        while (pendingRemovals--) {
          this.removeEventListener(type, this.nullFunction)
        }

        delete this._dispatching[type]
      }

      return propagate
    }
  }
}
