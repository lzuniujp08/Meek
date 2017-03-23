/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import CanvasRenderer from '../renderer/CanvasRenderer'
import BrowserEventHandler from './BrowserEventHandler'
import BrowserEvent from './BrowserEvent'
import {listen} from '../core/EventManager'

export default class Workspace extends BaseObject {

  constructor (options) {
    super()

    /**
     * 添加到map中的layers集合
     * @private
     */
    this._layers = []

    /**
     *
     * @private
     */
    this._animationDelayKey = undefined

    /**
     * 添加到map中的cpts集合;例如：DrawCpt、EditCpt、NavCpt等
     * @private
     */
    this._components = []

    this._viewport = null

    this._animationDelay = function () {
      this._animationDelayKey = undefined
      this._renderFrame(Date.now())
    }.bind(this)

    this._createViewport()

    this.target = options.target

    this._createRenderer()

    this._createBrowserEventHandler()
  }

  /**
   * 设置WS的父容器
   * 所有的图层对象、组件对象的父容器
   * @private
   */
  _createViewport () {
    const viewport = document.createElement('DIV')
    viewport.className = 'dt-viewport'
    viewport.style.position = 'relative'
    viewport.style.overflow = 'hidden'
    viewport.style.width = '100%'
    viewport.style.height = '100%'

    this._viewport = viewport
  }

  /**
   * 地图渲染器对象;默认渲染方式为canvas方式
   * @private
   */
  _createRenderer () {
    this._renderer = new CanvasRenderer(this._viewport, this)
  }

  /**
   * 创建浏览器事件的监听器
   * 浏览器事件包括{mousedown|mousemove|mouseup|mouseover|mouseup}
   * @private
   */
  _createBrowserEventHandler () {
    this._browserEventHandler = new BrowserEventHandler(this, this._viewport)

    /**
     * 监听浏览器上的鼠标事件 mousemove,mouseup,mousedown
     * 并处理浏览器事件
     */
    for (var key in BrowserEvent) {
      listen(this._browserEventHandler, BrowserEvent[key],
        this._handleBrowserEvent, this)
    }
  }

  _handleBrowserEvent (browserEvent) {
    const cpts = this.components
    let i

    if (this.dispatchEvent(browserEvent) !== false) {
      for (i = cpts.length - 1; i >= 0; i--) {
        var cpt = cpts[i]

        if (!cpt.active) {
          continue
        }

        let cont = cpt.handleMouseEvent(browserEvent)
        if (!cont) {
          break
        }
      }
    }
  }

  // _animationDelay () {
  //   this._animationDelayKey = undefined
  //   this._renderFrame(Date.now())
  // }.bind(this)

  _renderFrame () {
    this._renderer.renderFrame()
  }

  render () {
    if (this._animationDelayKey === undefined) {
      this._animationDelayKey = window.requestAnimationFrame(this._animationDelay)
    }
  }

  get components () { return this._components }
  get layers () { return this._layers }

  get target () { return this._target }
  set target (value) {
    this._target = value
    const targetElement = document.getElementById(this._target)
    targetElement.appendChild(this._viewport)
  }
  
  addComponents (cpt) {
    this.components.push(cpt)
    cpt.workspace = this
  }

  addLayer (layer) {
    this.layers.push(layer)
  }

  /**
   * Returns the map pixel position for a browser event relative to the viewport.
   * @param {Event} event Event.
   * @return {ol.Pixel} Pixel.
   * @api stable
   */
  getEventPixel (event) {
    // 获取viewport元素在浏览器视图窗口总的位置(left,top,bottom,right)
    var viewportPosition = this._viewport.getBoundingClientRect()
    var eventPosition = event.changedTouches ? event.changedTouches[0] : event
    return [
      eventPosition.clientX - viewportPosition.left,
      eventPosition.clientY - viewportPosition.top
    ]
  }

  getCoordinateFromPixel () {
  }
}
