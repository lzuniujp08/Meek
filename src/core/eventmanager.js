/**
 * Created by zypc on 2016/11/17.
 */


import Obj from '../utils/obj'

/**
 * 根据事件标识和监听对象获取该对象上的事件监听函数列表
 *
 * @method getListeners
 * @param target
 * @param type
 * @returns {Undefined}
 */
export function getListeners (target, type) {
  const listenerMap = target.ol_lm
  return listenerMap ? listenerMap[type] : undefined
}

/**
 * 根据事件标示和事件对象，移除全部事件监听
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
 * 移除该事件标识下全部事件监听
 *
 * @method unlistenByKey
 * @param key {String} 事件标示
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
 * 监听事件
 *
 * @method listen
 * @param target {Object} 监听对象
 * @param type {String} 事件标识
 * @param listener {Array} 事件响应函数列表
 * @param optThis {This} 可选
 * @param optOnce
 * @returns {Array}
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

/**
 * 对事件只是监听一次
 *
 * @method listenOnce
 * @param target
 * @param type
 * @param listener
 * @param opt_this
 * @returns {*}
 */
export function listenOnce (target, type, listener, opt_this) {
  return listen(target, type, listener, opt_this, true)
}


/**
 * 定义关于事件的注册、注销、派发、监听的通用工具模块
 *
 * @module core
 * @class EventManager
 */
export default {
  getListeners,
  listen,
  listenOnce,
  unlistenByKey,
}