/**
 * Created by zypc on 2016/11/17.
 */

/**
 * @param {ol.EventTargetLike} target Target.
 * @param {string} type Type.
 * @return {Array.<ol.EventsKey>|undefined} Listeners.
 */
export function getListeners (target, type) {
  const listenerMap = target.ol_lm
  return listenerMap ? listenerMap[type] : undefined
}

/**
 * Clean up all listener objects of the given type.  All properties on the
 * listener objects will be removed, and if no listeners remain in the listener
 * map, it will be removed from the target.
 * @param {ol.EventTargetLike} target Target.
 * @param {string} type Type.
 * @private
 */
const removeListeners = function (target, type) {
  const listeners = getListeners(target, type)
  if (listeners) {
    for (let i = 0, ii = listeners.length; i < ii; ++i) {
      target.removeEventListener(type, listeners[i].boundListener)
      ol.obj.clear(listeners[i])
    }
    listeners.length = 0
    let listenerMap = target.ol_lm
    if (listenerMap) {
      delete listenerMap[type]
      if (Object.keys(listenerMap).length === 0) {
        delete target.ol_lm
      }
    }
  }
}

/**
 * Unregisters event listeners on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * The argument passed to this function is the key returned from
 * {@link ol.events.listen} or {@link ol.events.listenOnce}.
 *
 * @param {ol.EventsKey} key The key.
 */
export function unlistenByKey (key) {
  if (key && key.target) {
    key.target.removeEventListener(key.type, key.boundListener)
    const listeners = getListeners(key.target, key.type)
    if (listeners) {
      let i = 'deleteIndex' in key ? key.deleteIndex : listeners.indexOf(key)
      if (i !== -1) {
        listeners.splice(i, 1)
      }
      if (listeners.length === 0) {
        removeListeners(key.target, key.type)
      }
    }
    ol.obj.clear(key)
  }
}

/**
 * @param {ol.EventsKey} listenerObj Listener object.
 * @return {ol.EventsListenerFunctionType} Bound listener.
 */
const bindListener = function (listenerObj) {
  let boundListener = function (evt) {
    const listener = listenerObj.listener
    const bindTo = listenerObj.bindTo || listenerObj.target
    if (listenerObj.callOnce) {
      unlistenByKey(listenerObj)
    }
    return listener.call(bindTo, evt)
  }

  listenerObj.boundListener = boundListener
  return boundListener
}

/**
 * Finds the matching {@link ol.EventsKey} in the given listener
 * array.
 *
 * @param {!Array<!ol.EventsKey>} listeners Array of listeners.
 * @param {!Function} listener The listener function.
 * @param {Object=} optThis The `this` value inside the listener.
 * @param {boolean=} opt_setDeleteIndex Set the deleteIndex on the matching
 *     listener, for {@link ol.events.unlistenByKey}.
 * @return {ol.EventsKey|undefined} The matching listener object.
 * @private
 */
const findListener = function (listeners, listener, optThis, optSetDeleteIndex) {
  let listenerObj
  for (let i = 0, ii = listeners.length; i < ii; ++i) {
    listenerObj = listeners[i]
    if (listenerObj.listener === listener &&
      listenerObj.bindTo === optThis) {
      if (optSetDeleteIndex) {
        listenerObj.deleteIndex = i
      }
      return listenerObj
    }
  }
  return undefined
}

/**
 * Get the lookup of listeners.  If one does not exist on the target, it is
 * created.
 * @param {ol.EventTargetLike} target Target.
 * @return {!Object.<string, Array.<ol.EventsKey>>} Map of
 *     listeners by event type.
 * @private
 */
const getListenerMap = function (target) {
  let listenerMap = target.ol_lm
  if (!listenerMap) {
    listenerMap = target.ol_lm = {}
  }
  return listenerMap
}

/**
 * Registers an event listener on an event target. Inspired by
 * {@link https://google.github.io/closure-library/api/source/closure/goog/events/events.js.src.html}
 *
 * This function efficiently binds a `listener` to a `this` object, and returns
 * a key for use with {@link ol.events.unlistenByKey}.
 *
 * @param {ol.EventTargetLike} target Event target.
 * @param {string} type Event type.
 * @param {ol.EventsListenerFunctionType} listener Listener.
 * @param {Object=} optThis Object referenced by the `this` keyword in the
 *     listener. Default is the `target`.
 * @param {boolean=} optOnce If true, add the listener as one-off listener.
 * @return {ol.EventsKey} Unique key for the listener.
 */
export function listen (target, type, listener, optThis, optOnce) {
  const listenerMap = getListenerMap(target)
  let listeners = listenerMap[type]
  if (!listeners) {
    listeners = listenerMap[type] = []
  }
  var listenerObj = findListener(listeners, listener, optThis, false);

  if (listenerObj) {
    if (!optOnce) {
      // Turn one-off listener into a permanent one.
      listenerObj.callOnce = false
    }
  } else {
    listenerObj = /** @type {ol.EventsKey} */ ({
      bindTo: optThis,
      callOnce: !!optOnce,
      listener: listener,
      target: target,
      type: type
    })
    target.addEventListener(type, bindListener(listenerObj))
    listeners.push(listenerObj)
  }

  return listenerObj
}
