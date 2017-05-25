/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import CanvasRenderer from '../renderer/canvas/CanvasRenderer'
import BrowserEventHandler from './BrowserEventHandler'
import BrowserEvent from './BrowserEvent'
import View from './View'
import {listen} from '../core/EventManager'
import {Transform} from '../data/matrix/Transform'

export default class Map extends BaseObject {

  constructor (options) {
    super()

    this._frameState = null
    
    /**
     * 添加到map中的layers集合
     * @private
     */
    this._layers = []
  
    /**
     * 初始化矩阵转换器
     * @type {*}
     * @private
     */
    this._toPixelTransform = Transform.create()
    this._toCoordinateTransform = Transform.create()

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
    
    this._createViewport()
  
    this._createRenderer()
  
    this._createBrowserEventHandler()
  
    this._animationDelay = function () {
      this._animationDelayKey = undefined
      this._renderFrame(Date.now())
    }.bind(this)
    
    this.layers = options.layers || []
    
    this.target = options.target

    this.view = options.view || new View()
  }

  /**
   * 设置map的父容器
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
    for (let key in BrowserEvent) {
      listen(this._browserEventHandler, BrowserEvent[key],
        this._handleBrowserEvent, this)
    }
  }

  _handleBrowserEvent (browserEvent) {
    const cpts = this.components
    let i

    if (this.dispatchEvent(browserEvent) !== false) {
      for (i = cpts.length - 1; i >= 0; i--) {
        let cpt = cpts[i]

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

  _renderFrame () {
    const size = this.size
    const view = this.view
    let frameState = null

    const viewState = view.getViewState()
    frameState = {
      size: size,
      viewState: viewState,
      toPixelTransform: this._toPixelTransform,
      toCoordinateTransform: this._toCoordinateTransform,
    }
    
    this._frameState = frameState
    
    // console.log('map接受渲染命令，调动render渲染')
    this._renderer.renderFrame(frameState)
  }

  render () {
    if (this._animationDelayKey === undefined) {
      this._animationDelayKey = window.requestAnimationFrame(this._animationDelay)
    }
  }

  get size () { return this._size }
  set size (value) {
    this._size = value
  }
  
  get components () { return this._components }
  get layers () { return this._layers }
  set layers (value) {
    if (Array.isArray(value)) {
      for(let layer of value){
        this._layers.push(layer)
      }
    }
  }

  get target () { return this._target }
  set target (value) {
    this._target = value
    const targetElement = document.getElementById(this._target)
    targetElement.appendChild(this._viewport)
    
    this.updateSize()
    this.render()
  }
  
  addComponents (cpt) {
    this.components.push(cpt)
    cpt.map = this
  }

  addLayer (layer) {
    this.layers.push(layer)
  }
  
  getTargetElement () {
    const target = this.target
    if(target !== undefined) {
      return typeof target === 'string' ?
        document.getElementById(target) :
        target
    }else{
      return null
    }
  }
  
  forEachFeatureAtPiexl (piexl,callback,tolerance) {
    if (!this._frameState) {
      return
    }
    
    const coordinate = this.getCoordinateFromPixel(piexl)
    const hitTolerance = tolerance
    
    const layers = this.layers
    let result = null
    for (let i = 0, ii = layers.length; i < ii; i++){
      let layer = layers[i]
      result = layer.forEachFeatureAtPiexl(this._frameState,coordinate,callback,hitTolerance)
      if(result){
        return callback(result)
      }
    }
    
    return result
  }
  
  /**
   * Update the map viewport size,this is a recalculation.
   */
  updateSize () {
    const targetElement = this.getTargetElement()
    if (!targetElement) {
      this.size = undefined
    } else {
      const computedStyle = getComputedStyle(targetElement)
      this.size = [
        targetElement.offsetWidth -
        parseFloat(computedStyle['borderLeftWidth']) -
        parseFloat(computedStyle['paddingLeft']) -
        parseFloat(computedStyle['paddingRight']) -
        parseFloat(computedStyle['borderRightWidth']),
        targetElement.offsetHeight -
        parseFloat(computedStyle['borderTopWidth']) -
        parseFloat(computedStyle['paddingTop']) -
        parseFloat(computedStyle['paddingBottom']) -
        parseFloat(computedStyle['borderBottomWidth'])
      ]
    }
  }

  /**
   * Returns the map pixel position for a browser event relative to the viewport.
   * @param {Event} event Event.
   * @return
   * @api stable
   */
  getEventPixel (event) {
    // 获取viewport元素在浏览器视图窗口总的位置(left,top,bottom,right)
    const viewportPosition = this._viewport.getBoundingClientRect()
    const eventPosition = event.changedTouches ? event.changedTouches[0] : event
    return [
      eventPosition.clientX - viewportPosition.left,
      eventPosition.clientY - viewportPosition.top
    ]
  }
  
  /**
   * Gets the coordinate for a given pixel.
   * @param pixelPoint
   * @returns {*}
   */
  getCoordinateFromPixel (pixelPoint) {
    // console.log('转换到标准坐标')
    const frameState = this._frameState
    if (!frameState) {
      return null
    } else {
      return Transform.apply( frameState.toCoordinateTransform, pixelPoint.slice())
    }
  }
  
  /**
   * Get the pixel for a coordinate.  This takes a coordinate in the map view
   * projection and returns the corresponding pixel.
   * @param coordinate
   * @returns {*}
   */
  getPixelFromCoordinate (coordinate) {
    const frameState = this._frameState
    if (!frameState) {
      return null
    } else {
      return Transform.apply(frameState.toPixelTransform, coordinate.slice(0, 2))
    }
  }
}
