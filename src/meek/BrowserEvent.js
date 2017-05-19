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
  }
}

BrowserEvent.MOUSE_DOWN = 'mousedown'

BrowserEvent.MOUSE_MOVE = 'mousemove'

BrowserEvent.MOUSE_UP = 'mouseup'

BrowserEvent.MOUSE_OUT = 'mouseout'
