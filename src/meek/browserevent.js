/**
 * Created by zypc on 2016/12/4.
 */

import BaseObject from '../core/baseobject'

/**
 * BrowserEvent
 *
 * @class BrowserEvent
 * @extends BaseObject
 * @module meek
 * @constructor
 */
export default class BrowserEvent extends BaseObject {

  /**
   * @constructor
   * @param map
   * @param oriEvent
   * @param eventTyle
   */
  constructor (map, oriEvent, eventTyle) {
    super()

    /**
     * 标示事件类型
     */
    this.type = eventTyle

    /**
     *
     */
    this.map = map

    /**
     * 记录事件源对象
     */
    this.originalEvent = oriEvent

    /**
     * 将浏览器坐标转换成canvas屏幕坐标
     * The pixel of the original browser event.
     * @type {ol.Pixel}
     * @api stable
     */
    this.pixel = map.getEventPixel(oriEvent)
  
  
    /**
     * 将canvas左边转换成地图坐标
     */
    this.coordinate = map.getCoordinateFromPixel(this.pixel)

    /**
     * @type {number}
     */
    this.pointerId = 0
  }

  /**
   * 取消事件的默认动作
   *
   * @method preventDefault
   */
  preventDefault () {
    this.originalEvent.preventDefault()
  }
  
  /**
   * 阻止当前事件在DOM树上冒泡
   *
   * @method stopPropagation
   */
  stopPropagation () {
    this.originalEvent.stopPropagation()
  }
  
}
// The single click is different form double click,which
// consider as two click heppen during 250ms.
/**
 * 鼠标在一段时间内单击标识
 *
 * @property SINGLE_CLICK
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.SINGLE_CLICK = 'singleclick'

/**
 *
 * 鼠标单击事件标识
 *
 * @property CLICK
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.CLICK = 'click'

/**
 *
 * 鼠标双击事件标识
 *
 * @property DBLCLICK
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.DBLCLICK = 'dblclick'

/**
 * 鼠标拖拽事件标识
 *
 * @property MOUSE_DRAG
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.MOUSE_DRAG = 'mousedrag'

/**
 * 鼠标按下事件标识
 *
 * @property MOUSE_DOWN
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.MOUSE_DOWN = 'mousedown'

/**
 * 鼠标移动事件标识
 *
 * @property MOUSE_MOVE
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.MOUSE_MOVE = 'mousemove'

/**
 * 鼠标抬起事件标识
 *
 * @property MOUSE_UP
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.MOUSE_UP = 'mouseup'

/**
 * 鼠标移入事件标识
 *
 * @property MOUSE_OVER
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.MOUSE_OVER = 'mouseover'

/**
 * 鼠标移开事件标识
 *
 * @property MOUSE_OUT
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.MOUSE_OUT = 'mouseout'

/**
 * 滚轮事件标识
 *
 * @property WHEEL
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.WHEEL = 'wheel'

/**
 * 鼠标滚轮事件标识
 *
 * @property MOUSE_WHEEL
 * @static
 * @final
 * @type {String}
 */
BrowserEvent.MOUSE_WHEEL = 'mousewheel'

/**
 *
 * @type {string}
 */
BrowserEvent.KEYDOWN = 'keydown'

/**
 *
 * @type {string}
 */
BrowserEvent.KEYPRESS = 'keypress'
