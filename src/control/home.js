/**
 * Created by zhangyong on 2017/8/3.
 */

import Control from './control'
import BrowserEvent from '../meek/browserevent'

import {listen} from '../core/eventmanager'

/**
 *
 */
export default class Home extends Control {
  constructor (options = {}) {
    const className = options.className ? options.className : 'dt-zoom-extent'
    const homeLabel = options.homeLabel ? options.homeLabel : 'H'
    const homeLabelTip = options.homeLabelTip ? options.homeLabelTip : '全图'
  
    const homeElement = document.createElement('button')
    homeElement.setAttribute('type', 'button')
    homeElement.title = homeLabelTip
    homeElement.appendChild(
      typeof homeLabel === 'string' ? document.createTextNode(homeLabel) : homeLabel
    )
  
    const cssClasses = className + ' dt-unselectable ' + 'dt-control'
    const element = document.createElement('div')
    element.className = cssClasses
    element.appendChild(homeElement)
  
    super({
      element: element,
      target: options.target
    })
  
    listen(homeElement, BrowserEvent.CLICK, this._handleClick, this)
  }
  
  /**
   * 处理按钮点击事件
   * @param event
   * @private
   */
  _handleClick ( event) {
    event.preventDefault()
    this._goToHome()
  }
  
  /**
   * 将视图还原到最初
   * @private
   */
  _goToHome () {
    const view = this.map.view
    if (view) {
      const orignalCenter = view.originalCenter
      const originalResolution = view.originalResolution
      
      view.center = orignalCenter
      view.resolution = originalResolution
    }
  }
  
}