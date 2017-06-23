/**
 * Created by zhangyong on 2017/6/6.
 */


export const ImageState = {}

/**
 * On IDLE
 * @type {number}
 */
ImageState.IDLE = 0

/**
 * On loading
 * @type {number}
 */
ImageState.LOADING = 1

/**
 * Already loaded
 * @type {number}
 */
ImageState.LOADED = 2

/**
 * Error occurred
 * @type {number}
 */
ImageState.ERROR = 3

export default {
  ImageState
}