/**
 * Created by zypc on 2016/11/13.
 */

/**
 *
 * The event processor for all subclasss, which can allow subclass
 * to handle event dispatching and listening <br/>
 *
 * 事件处理器,让所以子类具备事件的监听和派发
 *
 * @class Event
 * @module core
 * @constructor
 *
 */
export default class Event {
  
  /**
   *
   */
  constructor () {
    this._pendingRemovals = {}

    this._listeners = {}
    this._dispatching = {}

    this.nullFunction = function () {}
  }
  
  /**
   * @method getListeners
   * @param type
   */
  getListeners (type) {
    return this._listeners[type]
  }
  
  /**
   * @method hasListener
   * @param optType
   * @returns {boolean}
   */
  hasListener (optType) {
    return optType ? optType in this._listeners : Object.keys(this._listeners).length > 0
  }
  
  /**
   * @method removeEventListener
   * @param type
   * @param listener
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
   * @method addEventListener
   * @param type
   * @param listener
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
   * @method dispatchEvent
   * @param event
   * @returns {*}
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
