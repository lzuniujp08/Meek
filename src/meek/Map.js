/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
import CanvasRenderer from '../renderer/canvas/CanvasRenderer'
import BrowserEventHandler from './BrowserEventHandler'
import BrowserEvent from './BrowserEvent'
import View from './View'
import {BaseEvent} from '../core/BaseEvent'

import FeatureLayer from '../lyr/FeatureLayer'
import {listen} from '../core/EventManager'
import {Transform} from '../data/matrix/Transform'
import {EventType} from '../meek/EventType'
import {ExtentUtil} from '../geometry/support/ExtentUtil'
import {componentsDefaults} from '../components/ComponentDefaults'


/**
 * @class Map
 * @extends BaseObject
 * @module meek
 * @constructor
 */
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
     * The collection of components
     * @private
     */
    this._components = []
  
    // Create the viewport for map container
    this._createViewport()
  
    this._overlayContainer = document.createElement('DIV')
    this._overlayContainer.className = 'dt-overlaycontainer'
    this.viewport.appendChild(this._overlayContainer)
  
    this._overlayContainerStopEvent = document.createElement('DIV')
    this._overlayContainerStopEvent.className = 'dt-overlaycontainer-stopevent'
  
    // prevent event propagation from overlay
    const overlayEvents = [
      BrowserEvent.CLICK,
      BrowserEvent.DBLCLICK,
      BrowserEvent.MOUSE_DOWN,
      BrowserEvent.MOUSE_UP,
      BrowserEvent.MOUSE_WHEEL,
      BrowserEvent.WHEEL
    ]
    overlayEvents.forEach(overlayEvent => {
      listen(this._overlayContainerStopEvent, overlayEvent,
        function(evt) {
          evt.stopPropagation()
        })
    })
    
    this.viewport.appendChild(this._overlayContainerStopEvent)
  
    // Get the options inner
    const optionsInner = Map.parseOptionsInner(options)
  
    // Create the renderer
    this._renderer = new optionsInner.rendererClass(this.viewport, this)
    
    // Create the browser events handler
    this._createBrowserEventHandler()
  
    this._animationDelay = function () {
      this._animationDelayKey = undefined
      this._renderFrame(Date.now())
    }.bind(this)
    
    // Set up the properties for map
    this.layers = optionsInner.values['layers']
    this.target = optionsInner.values['target']
    this.view = optionsInner.values['view']
    
    // add default components to maps
    optionsInner.components.forEach(component =>
      this.addComponents(component))
  
    this._overlayIdIndex = {}
    this._overlays = optionsInner.overlays
    this._overlays.forEach(overlay => this._addOverlayInternal(overlay))
    
    
    //
    listen(this.view, EventType.CHANGE, this._handleViewChange, this)
    
    // add mouse wheel events listener
    listen(this.viewport, BrowserEvent.MOUSE_WHEEL, this._handleMouseWheelEvent, this)
    listen(this.viewport, BrowserEvent.WHEEL, this._handleMouseWheelEvent, this)
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
   * overlayContainer getter
   * @returns {Element|*}
   */
  get overlayContainer () { return this._overlayContainer }
  
  /**
   * overlayContainerStopEvent getter
   * @returns {Element|*}
   */
  get overlayContainerStopEvent () { return this._overlayContainerStopEvent }
  
  /**
   * viewport getter
   * @returns {Element|*}
   */
  get viewport () { return this._viewport }

  /**
   * 地图渲染器对象;默认渲染方式为canvas方式
   * @private
   */
  _createRenderer () {
    this._renderer = new CanvasRenderer(this.viewport, this)
  }

  /**
   * 创建浏览器事件的监听器
   * 浏览器事件包括{mousedown|mousemove|mouseup|mouseover|mouseup}
   * @private
   */
  _createBrowserEventHandler () {
    this._browserEventHandler = new BrowserEventHandler(this, this.viewport)

    /**
     * 监听浏览器上的鼠标事件 mousemove,mouseup,mousedown
     * 并处理浏览器事件
     */
    for (let key in BrowserEvent) {
      listen(this._browserEventHandler, BrowserEvent[key],
        this._handleBrowserEvent, this)
    }
  }
  
  /**
   * Handle the mouse wheel event
   * @param wheelEvent
   * @private
   */
  _handleMouseWheelEvent (wheelEvent) {
    const type = wheelEvent.type
    const browserEvent = new BrowserEvent(this, wheelEvent, type)
    this._handleBrowserEvent(browserEvent)
  }
  
  /**
   * Handle browser events
   * @param browserEvent
   * @private
   */
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
  
  /**
   * Render map frame
   * @private
   */
  _renderFrame () {
    const size = this.size
    const view = this.view
    let frameState = null

    const extent = ExtentUtil.createEmpty()
    const viewState = view.getViewState()
    frameState = {
      size: size,
      viewState: viewState,
      pixelRatio: 1,
      extent:extent,
      toPixelTransform: this._toPixelTransform,
      toCoordinateTransform: this._toCoordinateTransform,
    }
    
    if (frameState) {
      frameState.extent = ExtentUtil.getForViewAndSize(viewState.center,
        viewState.resolution, viewState.rotation, frameState.size, extent)
    }
    
    this._frameState = frameState
    this._renderer.renderFrame(frameState)
    
    
  }
  
  /**
   * Render function
   */
  render () {
    if (this._animationDelayKey === undefined) {
      this._animationDelayKey = window.requestAnimationFrame(this._animationDelay)
    }
  }
  
  /**
   * Render map while the view has been changed
   * @private
   */
  _handleViewChange () {
    this.render()
  }
  
  /**
   *
   * @returns {boolean}
   */
  isRendered () {
    return !!this._frameState
  }
  
  get size () { return this._size }
  set size (value) {
    this._size = value
  }
  
  get components () { return this._components }
  get layers () { return this._layers }
  set layers (value) {
    if (Array.isArray(value)) {
      value.forEach( layer => {
        layer.map = this
      })
    }
  }

  get target () { return this._target }
  set target (value) {
    this._target = value
    const targetElement = document.getElementById(this._target)
    targetElement.appendChild(this.viewport)
    
    this.updateSize()
    this.render()
  }
  
  /**
   *
   * @param cpt
   */
  addComponents (cpt) {
    this.components.push(cpt)
    cpt.map = this
  }

  addLayer (layer) {
    this.layers.push(layer)
  }
  
  /**
   * Get all the fetures layer from map.
   */
  getFeaturesLayer () {
    return this.layers.filter( layer => {
      return layer instanceof FeatureLayer
    })
  }
  
  /**
   *
   * @param overlay
   * @private
   */
  _addOverlayInternal (overlay) {
    const id = overlay.overlayId
    if (id !== undefined) {
      this._overlayIdIndex[id.toString()] = overlay
    }
    
    overlay.map = this
  }
  
  /**
   *
   * @returns {*}
   */
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
  
  /**
   *
   * @param piexl
   * @param callback
   * @param tolerance
   * @returns {*}
   */
  forEachFeatureAtPiexl (piexl,callback,tolerance) {
    if (!this._frameState) {
      return
    }
    
    const coordinate = this.getCoordinateFromPixel(piexl)
    const hitTolerance = tolerance
    
    const layers = this.getFeaturesLayer()
    let result = null
    for (let i = 0, ii = layers.length; i < ii; i++){
      let layer = layers[i]
      result = layer.forEachFeatureAtPiexl(this._frameState,coordinate,callback,hitTolerance)
      if(result){
        return callback(result, layer)
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
    const viewportPosition = this.viewport.getBoundingClientRect()
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
  
  
  /**
   * Parse the options passed inner
   * @param options
   * @returns {{rendererClass: CanvasRenderer, components: *, values: Map}}
   */
  static parseOptionsInner (options = {}) {
    
    const rendererClass = CanvasRenderer
    
    const values = {}
    
    values['view'] = options.view !== undefined ? options.view : new View()
    values['target'] = options.target
    values['layers'] = options.layers !== undefined ? options.layers : []
    
    let components
    if (options.components) {
      components = options.components
    } else {
      components = componentsDefaults()
    }
    
    
    let overlays
    if (options.overlays !== undefined) {
      if (Array.isArray(options.overlays)) {
        overlays = options.overlays.slice()
      }
    } else {
      overlays = []
    }
    
    return {
      rendererClass,
      components,
      values,
      overlays
    }
  }
}
