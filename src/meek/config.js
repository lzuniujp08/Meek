/**
 * Created by zhangyong on 2017/3/20.
 */


/**
 * Constants defined width the define tag connot be changed in application code,
 * but can be set at compile time.
 *
 * @type {{}}
 */
export const Config = {}

/**
 * Enable debug mode ,Default is 'true'
 *
 * 配置DEBUG
 *
 * @property DEBUG
 * @static
 * @type {Boolean}
 */
Config.DEBUG = true

/**
 * Default max zomm factor
 *
 * @property DEFAULT_ZOOM_FACTOR
 * @static
 * @type {Number}
 */
Config.DEFAULT_ZOOM_FACTOR = 2

/**
 * Default max zoom level for map view.
 * Defaylt is '10'
 *
 * @property DEFAULT_MAX_ZOOM
 * @static
 * @type {Number}
 */
Config.DEFAULT_MAX_ZOOM = 10

/**
 * Default min zoom level for map view.
 * Default is '0'
 *
 * @property DEFAULT_MIN_ZOOM
 * @static
 * @type {Number}
 */
Config.DEFAULT_MIN_ZOOM = 0

/**
 * Maxinum mouse wheel delta.
 *
 * @property MOUSE_WHEEL_ZOOM_MAXDELTA
 * @static
 * @type {Number}
 */
Config.MOUSE_WHEEL_ZOOM_MAXDELTA = 1

/**
 * Default tile size
 *
 * @property DEFAULT_TILE_SIZE
 * @static
 * @type {Number}
 */
Config.DEFAULT_TILE_SIZE = 256


export default{
  Config
}