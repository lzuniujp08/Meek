/**
 * Created by zypc on 2016/11/21.
 */


import BaseObject from '../core/BaseObject'
import {listen} from '../core/EventManager'
import BrowserEvent from './BrowserEvent'

export default class BrowserEventHandler extends BaseObject {

  constructor (workspace, element) {
    super()

    this._ws = workspace

    this._element = element

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
    const events = this.getEvents()
    events.forEach(eventName =>
        listen(this._element, eventName, this._mapping[eventName], this))
  }

  getEvents () {
    return Object.keys(this._mapping)
  }

  _mousedown (e) {
    console.info('mouse down click')
    let event = new BrowserEvent(this._ws, e, 'movedown')
    this.dispatchEvent(event)
  }

  _mousemove (e) {
    console.info('mouse move click')
    let event = new BrowserEvent(this._ws, e, 'mousemove')
    this.dispatchEvent(event)
  }

  _mouseup (e) {
    let event = new BrowserEvent(this._ws, e, 'mouseup')
    this.dispatchEvent(event)
  }

  _mouseover (e) {
    let event = new BrowserEvent(this._ws, e)
    this.dispatchEvent(event)
  }

  _mouseout (e) {
    let event = new BrowserEvent(this._ws, e, 'mouseout')
    this.dispatchEvent(event)
  }

}

