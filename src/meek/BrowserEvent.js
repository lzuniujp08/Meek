/**
 * Created by zypc on 2016/12/4.
 */

import BaseObject from '../core/BaseObject'

export default class BrowserEvent extends BaseObject {

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
  
  
    this.pointerId = 0
  }
}


/**
 * The single click is different form double click,which
 * consider as two click heppen during 250ms.
 * @type {string}
 */
BrowserEvent.SINGLE_CLICK = 'singleclick'

/**
 * A click with no draging.
 * @type {string}
 */
BrowserEvent.CLICK = 'click'

/**
 * A real double click
 * @type {string}
 */
BrowserEvent.DBLCLICK = 'dblclick'


/**
 *
 * @type {string}
 */
BrowserEvent.MOUSE_DRAG = 'mousedrag'


BrowserEvent.MOUSE_DOWN = 'mousedown'

BrowserEvent.MOUSE_MOVE = 'mousemove'

BrowserEvent.MOUSE_UP = 'mouseup'

BrowserEvent.MOUSE_OVER = 'mouseover'

BrowserEvent.MOUSE_OUT = 'mouseout'
