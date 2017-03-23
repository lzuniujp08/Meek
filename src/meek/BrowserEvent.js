/**
 * Created by zypc on 2016/12/4.
 */

import BaseObject from '../core/BaseObject'

export default class BrowserEvent extends BaseObject {

  constructor (ws, oriEvent, eventTyle) {
    super()

    /**
     * 标示事件类型
     */
    this.type = eventTyle

    /**
     *
     */
    this.ws = ws

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
    this.coordinates = ws.getEventPixel(oriEvent)
  }
}

BrowserEvent.MOUSE_DOWN = 'mousedown'

BrowserEvent.MOUSE_MOVE = 'mousemove'

BrowserEvent.MOUSE_UP = 'mouseup'

BrowserEvent.MOUSE_OUT = 'mouseout'
