/**
 * Created by zypc on 2016/11/13.
 */

export default class Event {
  constructor () {
    this._pendingRemovals = {}

    this._listeners = {}
    this._dispatching = {}

    this.nullFunction = function () {}
  }

  /**
   * Get the listeners for a specified event type. Listeners are returned in the
   * order that they will be called in.
   *
   * @param {string} type Type.
   * @return {Array.<ol.EventsListenerFunctionType>} Listeners.
   */
  getListeners (type) {
    return this._listeners[type]
  }

  /**
   * @param {string=} opt_type Type. If not provided,
   *     `true` will be returned if this EventTarget has any listeners.
   * @return {boolean} Has listeners.
   */
  hasListener (optType) {
    return optType ? optType in this._listeners : Object.keys(this._listeners).length > 0
  }

  /**
   * @param {string} type Type.
   * @param {ol.EventsListenerFunctionType} listener Listener.
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
   * @param {string} type Type.
   * @param {ol.EventsListenerFunctionType} listener Listener.
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
   * @param {{type: string,
 *     target: (EventTarget|ol.events.EventTarget|undefined)}|ol.events.Event|
 *     string} event Event or event type.
   * @return {boolean|undefined} `false` if anyone called preventDefault on the
   *     event object or if any of the listeners returned false.
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
