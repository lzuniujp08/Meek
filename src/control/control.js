/**
 * Created by zhangyong on 2017/8/2.
 */

import BaseObject from '../core/baseobject'

import {removeNode} from '../utils/domutil'
import {unlistenByKey} from '../core/eventmanager'

export default class Control extends BaseObject {
  constructor (options = {}) {
    super()
    
    this._element = options.element ? options.element : null
    
    this._target = null
    
    this._map = null
    
    this._listenerKeys = []
    
    
    if (options.target) {
      this.target = options.target
    }
  }
  
  get map() { return this._map }
  set map(value) {
    if (this.map) {
      removeNode(this._element)
    }
    
    this._listenerKeys.forEach(listener => unlistenByKey(listener) )
    
    this._listenerKeys.length = 0
    this._map = value
    
    if (this._map) {
      const target = this._target ? this._target : value.overlayContainerStopEvent
      target.appendChild(this._element)
      
      value.render()
    }
  }
  
  set target(value) {
    this._target = typeof value === 'string' ?
      document.getElementById(value) :
      value
  }
}