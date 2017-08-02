/**
 * Created by zypc on 2016/12/6.
 */
export const EventType = {}

/**
 * Triggered when map is needed to render
 *
 * @property CHANGE
 * @static
 * @final
 * @type {String}
 */
EventType.CHANGE = 'change'


/**
 * Triggered when view has been changed
 *
 * 当地图视图发生变化时将会派发改事件
 *
 * @property VIEW_CHANGED
 * @static
 * @final
 * @type {String}
 */
EventType.VIEW_CHANGED = 'viewchanged'

/**
 * Triggered when a image download error
 *
 * @property ERROR
 * @static
 * @final
 * @type {String}
 */
EventType.ERROR = 'error'

/**
 * Triggered when a image finish load
 *
 * @property LOAD
 * @static
 * @final
 * @type {String}
 */
EventType.LOAD = 'load'

/**
 * 当浏览器窗口的尺寸发生变化时派发
 *
 * @property RESIZE
 * @static
 * @final
 * @type {string}
 */
EventType.RESIZE = 'resize'


export default {
  EventType
}







