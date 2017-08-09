/**
 * Created by zhangyong on 2017/6/26.
 */

import BaseObject from '../core/baseobject'
import {listen} from '../core/eventmanager'
import {RenderEventType} from '../renderer/rendereventtype'
import {ExtentUtil} from '../geometry/support/extentutil'
import {outerWidth, outerHeight, removeChildren} from '../utils/domutil'

/**
 * Overlay类提供一个可以漂浮在map上的容器，
 * 凡是需要有和地图交互的表单，必须使用该容器承载
 *
 * @class Overlay
 * @extends BaseObject
 * @module meek
 * @constructor
 */
export default class Overlay extends BaseObject {

  /**
   * @constructor
   * @param options
   */
  constructor (options = {}) {
    super()
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._element = undefined
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._map = undefined
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._offset = undefined
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._position = undefined
  
    /**
     *
     * @type {undefined}
     * @private
     */
    this._positioning = undefined
    
    
    /**
     * @private
     * @type {number|string|undefined}
     */
    this._overlay = options.id
  
    /**
     * @private
     * @type {boolean}
     */
    this._insertFirst = options.insertFirst !== undefined ?
      options.insertFirst : true
  
    /**
     * @private
     * @type {boolean}
     */
    this._stopEvent = options.stopEvent !== undefined ?
      options.stopEvent : true
  
    /**
     * @private
     * @type {Element}
     */
    this._element = document.createElement('DIV')
    this._element.className = 'dt-overlay-container dt-selectable'
    this._element.style.position = 'absolute'
  
    /**
     * @protected
     * @type {boolean}
     */
    this.autoPan = options.autoPan !== undefined ? options.autoPan : false
  
    /**
     * @private
     */
    this._autoPanAnimation = options.autoPanAnimation || {}
  
    /**
     * @private
     * @type {number}
     */
    this._autoPanMargin = options.autoPanMargin !== undefined ?
      options.autoPanMargin : 20
  
    /**
     * @private
     * @type {{bottom_: string,
   *         left_: string,
   *         right_: string,
   *         top_: string,
   *         visible: boolean}}
     */
    this._rendered = {
      _bottom: '',
      _left: '',
      _right: '',
      _top: '',
      _visible: true
    }
  
    /**
     * @private
     * @type {EventsKey}
     */
    this._mapPostrenderListenerKey = null
  
    if (options.element !== undefined) {
      this.popupEelement = options.element
    }
  
    this.offset = options.offset !== undefined ?
      options.offset : [0, 0]
  
    this.positioning = options.positioning !== undefined ? options.positioning :
      OverlayPositioning.TOP_LEFT
  
    if (options.position !== undefined) {
      this.position = options.position
    }
  }
  
  /**
   * 执行渲染
   *
   * @method render
   */
  render () {
    this.updatePixelPosition()
  }
  
  /**
   * 更新鼠标点的位置信息
   *
   * @method updatePixelPosition
   */
  updatePixelPosition () {
    const map = this.map
    if (map) {
      const position = this.position
      if (!map || !map.isRendered() || !position) {
        this.setVisible(false)
        return
      }
  
      const pixel = map.getPixelFromCoordinate(position)
      const mapSize = map.size
      this.updateRenderedPosition(pixel, mapSize)
    }
  }
  
  /**
   * 更新渲染视图位置
   *
   * @param pixel {Array}
   * @param mapSize {Number}
   */
  updateRenderedPosition (pixel, mapSize) {
    const style = this._element.style
    const offset = this.offset
    const positioning = this.positioning
    
    this.setVisible(true)
    
    let offsetX = offset[0]
    let offsetY = offset[1]
    if (positioning == OverlayPositioning.BOTTOM_RIGHT ||
      positioning == OverlayPositioning.CENTER_RIGHT ||
      positioning == OverlayPositioning.TOP_RIGHT) {
      if (this._rendered.left_ !== '') {
        this._rendered.left_ = style.left = ''
      }
      
      const right = Math.round(mapSize[0] - pixel[0] - offsetX) + 'px'
      if (this._rendered.right_ != right) {
        this._rendered.right_ = style.right = right
      }
    } else {
      if (this._rendered.right_ !== '') {
        this._rendered.right_ = style.right = ''
      }
      
      if (positioning == OverlayPositioning.BOTTOM_CENTER ||
        positioning == OverlayPositioning.CENTER_CENTER ||
        positioning == OverlayPositioning.TOP_CENTER) {
        offsetX -= this._element.offsetWidth / 2
      }
      
      const left = Math.round(pixel[0] + offsetX) + 'px'
      if (this._rendered.left_ != left) {
        this._rendered.left_ = style.left = left
      }
    }
    if (positioning == OverlayPositioning.BOTTOM_LEFT ||
      positioning == OverlayPositioning.BOTTOM_CENTER ||
      positioning == OverlayPositioning.BOTTOM_RIGHT) {
      if (this._rendered.top_ !== '') {
        this._rendered.top_ = style.top = ''
      }
      
      const bottom = Math.round(mapSize[1] - pixel[1] - offsetY) + 'px'
      if (this._rendered.bottom_ != bottom) {
        this._rendered.bottom_ = style.bottom = bottom
      }
    } else {
      if (this._rendered.bottom_ !== '') {
        this._rendered.bottom_ = style.bottom = ''
      }
      
      if (positioning == OverlayPositioning.CENTER_LEFT ||
        positioning == OverlayPositioning.CENTER_CENTER ||
        positioning == OverlayPositioning.CENTER_RIGHT) {
        offsetY -= this._element.offsetHeight / 2
      }
      
      const top = Math.round(pixel[1] + offsetY) + 'px'
      if (this._rendered.top_ != top) {
        this._rendered.top_ = style.top = top
      }
    }
  }
  
  /**
   * 设置浮云框是否可见
   *
   * @method setVisible
   * @param visible
   */
  setVisible (visible) {
    if (this._rendered.visible !== visible) {
      this._element.style.display = visible ? '' : 'none'
      this._rendered.visible = visible
    }
  }
  
  /**
   * 表单自动适应视图范围
   * 如果当前表单出现的位置不全在地图中，则会平移至地图
   * 可视范围内
   *
   * @private
   */
  _panIntoView () {
    const map = this.map
    
    if (!map || !map.getTargetElement()) {
      return
    }
    
    const mapRect = this._getRect(map.getTargetElement(), map.size)
    const element = this.popupEelement

    if(element.clientHeight === 0 && element.clientWidth === 0){
      return
    }
    const overlayRect = this._getRect(element,
      [outerWidth(element), outerHeight(element)])
    
    const margin = this._autoPanMargin
    if (!ExtentUtil.containsExtent(mapRect, overlayRect)) {
      // the overlay is not completely inside the viewport, so pan the map
      const offsetLeft = overlayRect[0] - mapRect[0]
      const offsetRight = mapRect[2] - overlayRect[2]
      const offsetTop = overlayRect[1] - mapRect[1]
      const offsetBottom = mapRect[3] - overlayRect[3]
      
      const delta = [0, 0]
      if (offsetLeft < 0) {
        // move map to the left
        delta[0] = offsetLeft - margin
      } else if (offsetRight < 0) {
        // move map to the right
        delta[0] = Math.abs(offsetRight) + margin
      }
      
      if (offsetTop < 0) {
        // move map up
        delta[1] = offsetTop - margin
      } else if (offsetBottom < 0) {
        // move map down
        delta[1] = Math.abs(offsetBottom) + margin
      }
      
      if (delta[0] !== 0 || delta[1] !== 0) {
        const center = map.view.center
        const centerPx = map.getPixelFromCoordinate(center)
        const newCenterPx = [
          centerPx[0] + delta[0],
          centerPx[1] + delta[1]
        ]
        
        map.view.center = map.getCoordinateFromPixel(newCenterPx)
      }
    }
  }

  /**
   *
   * @param element
   * @param size
   * @return {*[]}
   * @private
   */
  _getRect (element, size) {
    const box = element.getBoundingClientRect()
    const offsetX = box.left + window.pageXOffset
    const offsetY = box.top + window.pageYOffset
    return [
      offsetX,
      offsetY,
      offsetX + size[0],
      offsetY + size[1]
    ]
  }

  /**
   * 获取当前浮云框对象的 ID
   *
   * @property overlayId
   * @type {number|string|undefined}
   */
  get overlayId () { return this._overlayId }

  /**
   * 获取表单元素
   *
   * @property popupEelement
   * @type {DOM}
   */
  get popupEelement () { return this._popupEelement }
  set popupEelement (value) {
    this._popupEelement = value
  
    this._setElement()
  }

  /**
   *
   * @private
   */
  _setElement () {
    removeChildren(this._element)
    const pelement = this.popupEelement
    if (pelement) {
      this._element.appendChild(pelement)
    }
  }


  /**
   * map读写器, 读取设置当前map
   *
   * @property map
   * @type {Datatang.map}
   */
  get map () { return this._map }
  set map (value) {
    this._map = value
    if (this._map) {
      const map = this._map
      this._mapPostrenderListenerKey = listen(map,
        RenderEventType.POSTRENDER, this.render, this)
      this.updatePixelPosition()
      const container = this._stopEvent ?
        map.overlayContainerStopEvent : map.overlayContainer
      if (this._insertFirst) {
        container.insertBefore(this._element, container.childNodes[0] || null)
      } else {
        container.appendChild(this._element)
      }
    }
  }

  /**
   * 偏移量读写器
   *
   * @property offset
   * @return {*|undefined}
   */
  get offset () { return this._offset }
  set offset (value) {
    this._offset = value
    this.updatePixelPosition()
  }

  /**
   * 鼠标点位置读写器
   *
   * @property position
   * @return {undefined|*}
   */
  get position () { return this._position }
  set position (value) {
    this._position = value
    
    this.updatePixelPosition()
    
    if (this._position && this.autoPan) {
      this._panIntoView()
    }
  }

  /**
   *
   *
   * positioning
   * @return {undefined|*}
   */
  get positioning () { return this._positioning }
  set positioning (value) {
    this._positioning = value
    this.updatePixelPosition()
  }
}


const OverlayPositioning = {
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right',
  CENTER_LEFT: 'center-left',
  CENTER_CENTER: 'center-center',
  CENTER_RIGHT: 'center-right',
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right'
}