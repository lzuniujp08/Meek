/**
 * Created by zypc on 2016/11/21.
 */


import BaseObject from '../core/BaseObject'
import {listen} from '../core/EventManager'
import BrowserEvent from './BrowserEvent'
import {EventType} from './EventType'

export default class BrowserEventHandler extends BaseObject {

  constructor (map, element) {
    super()

    this.map = map

    
    this._element = element
  
    /**
     *
     * @type {boolean}
     * @private
     */
    this._dragging = false
  
    /**
     * The most recent "down" type event (or null if none have occurred).
     * @private
     */
    this._down = null
  
  
    /**
     *
     * @type {number}
     * @private
     */
    this._clickTimeoutId = 0
    

    // 事件和对应的处理方法
    // 映射关系
    this._mapping = {
      'mousedown': this._mousedown,
      'mousemove': this._mousemove,
      'mouseup': this._mouseup,
      'mouseover': this._mouseover,
      'mouseout': this._mouseout
    }

    this._registerSource()
  }

  _registerSource () {
    // console.log('注册鼠标事件')
    const events = this.getEvents()
    events.forEach(eventName =>
        listen(this._element, eventName, this._mapping[eventName], this))
  }

  getEvents () {
    return Object.keys(this._mapping)
  }

  _mousedown (e) {
    let event = new BrowserEvent(this.map, e, BrowserEvent.MOUSE_DOWN)
    this.dispatchEvent(event)
  
    this._dragging = false
    this._down = e
  }

  _mousemove (e) {
  
    let event = new BrowserEvent(this.map, e, BrowserEvent.MOUSE_MOVE)
  
    if (event.coordinate === null) {
      return
    }
    
    this.dispatchEvent(event)
    
    if (this._isMoving(e)) {
      this._dragging = true
  
      const newEvent = new BrowserEvent(this.map, e, BrowserEvent.MOUSE_DRAG, this._dragging)
      this.dispatchEvent(newEvent)
    }
  }

  _mouseup (e) {
    let event = new BrowserEvent(this.map, e, BrowserEvent.MOUSE_UP)
    this.dispatchEvent(event)
  
    if (!this._dragging) {
      this._emulateClick(this._down)
    }
    
    this._dragging = false
    this._down = null
  }

  _mouseover (e) {
    let event = new BrowserEvent(this.map, e,BrowserEvent.MOUSE_OVER)
    this.dispatchEvent(event)
  }

  _mouseout (e) {
    let event = new BrowserEvent(this.map, e, BrowserEvent.MOUSE_OUT)
    this.dispatchEvent(event)
  }
  
  _emulateClick (event) {
    let newEvent = new BrowserEvent(this.map,event,BrowserEvent.CLICK)
    this.dispatchEvent(newEvent)
  
    // double click
    if (this._clickTimeoutId !== 0) {
      clearTimeout(this._clickTimeoutId)
      this._clickTimeoutId = 0
      newEvent = new BrowserEvent(this.map,event,BrowserEvent.DBLCLICK)
      this.dispatchEvent(newEvent)
    } else {
      // single click
      this._clickTimeoutId = setTimeout(function() {
        this._clickTimeoutId = 0
        let newEvent = new BrowserEvent(this.map,event,BrowserEvent.SINGLE_CLICK)
        this.dispatchEvent(newEvent)
      }.bind(this), 250)
    }
  }
  
  _isMoving (event) {
    if (this._down === null) {
      return false
    }
    
    return event.clientX !== this._down.clientX ||
           event.clientY !== this._down.clientY
  }

}

