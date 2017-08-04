/**
 * Created by zhangyong on 2017/8/3.
 */


import Control from './control'
import {removeNode} from '../utils/domutil'
import {unlistenByKey, listen} from '../core/eventmanager'
import {EventType} from '../meek/eventtype'

export default class ZoomPercentage extends Control {
  constructor (options = {}) {
    super()
    
    this._map = undefined
    
    const className = options.className ? options.className : 'dt-scale-line'
    
    this._innerElement = document.createElement('DIV')
    this._innerElement.className = className + '-inner'
    
    this._element = document.createElement('DIV')
    this._element.className = className + ' ' + 'dt-unselectable'
    this._element.appendChild(this._innerElement)
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
      
      this._listenerKeys.push(listen(value, EventType.VIEW_CHANGED, this.render, this))
      
      this.render()
    }
  }
  
  render () {
    const view = this.map.view
    const resolution =  (1 / view.resolution).toFixed(2)
    const html = '&#8195;缩放比   ' + resolution * 100  + ' % &#8195;'
    this._innerElement.innerHTML = html
  }
}