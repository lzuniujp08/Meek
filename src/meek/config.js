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
 * @type {boolean}
 */
Config.DEBUG = true


/**
 * Default max zomm factor
 * @type {number}
 */
Config.DEFAULT_ZOOM_FACTOR = 2


/**
 * Default max zoom level for map view.
 * Defaylt is '10'
 * @type {number}
 */
Config.DEFAULT_MAX_ZOOM = 10

/**
 * Default min zoom level for map view.
 * Defaylt is '0'
 * @type {number}
 */
Config.DEFAULT_MIN_ZOOM = 0

/**
 * Maxinum mouse wheel delta.
 * @type {number}
 */
Config.MOUSE_WHEEL_ZOOM_MAXDELTA = 1


/**
 * Default tile size
 * @type {number}
 */
Config.DEFAULT_TILE_SIZE = 256




export default{
  Config
}