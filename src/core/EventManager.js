/**
 * Created by zypc on 2016/11/17.
 */


import {Obj} from '../utils/Obj'

/**
 *
 * @param target
 * @param type
 * @returns {undefined}
 */
export function getListeners (target, type) {
  const listenerMap = target.ol_lm
  return listenerMap ? listenerMap[type] : undefined
}

/**
 *
 * @param target
 * @param type
 */
const removeListeners = function (target, type) {
  const listeners = getListeners(target, type)
  if (listeners) {
    for (let i = 0, ii = listeners.length; i < ii; ++i) {
      target.removeEventListener(type, listeners[i].boundListener)
      Obj.clear(listeners[i])
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
 *
 * @param key
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
    
    Obj.clear(key)
  }
}

/**
 *
 * @param listenerObj
 * @returns {boundListener}
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
 *
 * @param listeners
 * @param listener
 * @param optThis
 * @param optSetDeleteIndex
 * @returns {*}
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
 *
 * @param target
 * @returns {{}|*}
 */
const getListenerMap = function (target) {
  let listenerMap = target.ol_lm
  if (!listenerMap) {
    listenerMap = target.ol_lm = {}
  }
  return listenerMap
}

/**
 *
 * @param target
 * @param type
 * @param listener
 * @param optThis
 * @param optOnce
 * @returns {*}
 */
export function listen (target, type, listener, optThis, optOnce) {
  const listenerMap = getListenerMap(target)
  let listeners = listenerMap[type]
  if (!listeners) {
    listeners = listenerMap[type] = []
  }
  
  let listenerObj = findListener(listeners, listener, optThis, false)

  if (listenerObj) {
    if (!optOnce) {
      listenerObj.callOnce = false // Turn one-off listener into a permanent one.
    }
  } else {
    listenerObj = {
      bindTo: optThis,
      callOnce: !!optOnce,
      listener: listener,
      target: target,
      type: type
    }
    
    target.addEventListener(type, bindListener(listenerObj))
    listeners.push(listenerObj)
  }

  return listenerObj
}

export function listenOnce (target, type, listener, opt_this) {
  return listen(target, type, listener, opt_this, true)
}
