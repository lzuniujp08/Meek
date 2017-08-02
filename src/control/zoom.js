/**
 * Created by zhangyong on 2017/8/2.
 */

import Control from './control'
import BrowserEvent from '../meek/browserevent'

import {listen} from '../core/eventmanager'

export default class Zoom extends Control {
  
  constructor (options = {}) {
  
    const className = options.className !== undefined ? options.className : 'dt-zoom'
  
    const delta = options.delta !== undefined ? options.delta : 1
  
    const zoomInLabel = options.zoomInLabel !== undefined ? options.zoomInLabel : '+'
    const zoomOutLabel = options.zoomOutLabel !== undefined ? options.zoomOutLabel : '\u2212'
  
    const zoomInTipLabel = options.zoomInTipLabel !== undefined ?
      options.zoomInTipLabel : '放大'
    
    const zoomOutTipLabel = options.zoomOutTipLabel !== undefined ?
      options.zoomOutTipLabel : '缩小'
  
    const inElement = document.createElement('button')
    inElement.className = className + '-in'
    inElement.setAttribute('type', 'button')
    inElement.title = zoomInTipLabel
    inElement.appendChild(
      typeof zoomInLabel === 'string' ? document.createTextNode(zoomInLabel) : zoomInLabel
    )
  
    const outElement = document.createElement('button')
    outElement.className = className + '-out'
    outElement.setAttribute('type', 'button')
    outElement.title = zoomOutTipLabel
    outElement.appendChild(
      typeof zoomOutLabel === 'string' ? document.createTextNode(zoomOutLabel) : zoomOutLabel
    )
  
    const cssClasses = className + ' dt-unselectable ' + 'dt-control'
    const element = document.createElement('div')
    element.className = cssClasses
    element.appendChild(inElement)
    element.appendChild(outElement)
  
    super({
      element: element,
      target: options.target
    })
  
    this._delta = delta
    
    listen(inElement, BrowserEvent.CLICK, this._handleClick, this)
    listen(outElement, BrowserEvent.CLICK, this._handleClickIn, this)
    
    /**
     * @type {number}
     * @private
     */
    // this.duration_ = options.duration !== undefined ? options.duration : 250
  }
  
  _handleClickIn (event) {
    event.preventDefault()
    this._zoomByDelta(-this._delta)
  }
  
  /**
   * @param {number} delta Zoom delta.
   * @param {Event} event The event to handle
   * @private
   */
  _handleClick ( event) {
    event.preventDefault()
    this._zoomByDelta(this._delta)
  }
  
  
  /**
   * @param {number} delta Zoom delta.
   * @private
   */
  _zoomByDelta (delta) {
    const map = this.map
    const view = map.view
    if (!view) {
      // the map does not have a view, so we can't act
      // upon it
      return
    }
    
    const currentResolution = view.resolution
    if (currentResolution) {
      const newResolution = view.constrainResolution(currentResolution, delta)
      // if (this.duration_ > 0) {
      //   if (view.getAnimating()) {
      //     view.cancelAnimations()
      //   }
      //   view.animate({
      //     resolution: newResolution,
      //     duration: this.duration_,
      //     easing: ol.easing.easeOut
      //   })
      // } else {
      view.resolution = newResolution
      // }
    }
  }
  
} 



