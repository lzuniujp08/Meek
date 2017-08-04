/**
 * Created by zhangyong on 2017/3/23.
 */

import BaseObject from '../core/baseobject'
import {ExtentUtil} from '../geometry/support/extentutil'
import {Config} from '../meek/config'

import {linearFindNearest} from '../utils/array'
import {clamp} from '../utils/math'

/**
 * View 视图类
 *
 * @class View
 * @extends BaseObject
 * @module meek
 * @constructor
 */
export default class View extends BaseObject {

  /**
   * @constructor
   * @param options
   */
  constructor (options) {
    super()
    
    const _innerOptions = Object.assign({}, options)
    
    this._applyOptions(_innerOptions)
  }
  
  /**
   * Parse options and apply to view
   * @param options
   * @private
   */
  _applyOptions (options) {
    
    const resolutionConstraint = this._createResolutionConstraint(options)
  
    /**
     * @private
     * @type {number}
     */
    this._maxResolution = resolutionConstraint.maxResolution
  
    /**
     * @private
     * @type {number}
     */
    this._minResolution = resolutionConstraint.minResolution
  
    /**
     * @private
     * @type {number}
     */
    this._zoomFactor = resolutionConstraint.zoomFactor
  
    /**
     * @private
     * @type {Array.<number>|undefined}
     */
    this._resolutions = options.resolutions
  
    /**
     * @private
     * @type {number}
     */
    this._minZoom = resolutionConstraint.minZoom
  
    const centerConstraint = this._createCenterConstraint(options)
    const constraint = resolutionConstraint.constraint
    const rotationConstraint = this._createRotationConstraint(options)
  
    /**
     * center、resolution、ratation
     * @private
     */
    this._constraints = {
      center: centerConstraint,
      resolution: constraint,
      rotation: rotationConstraint
    }
  
    this.center = options.center !== undefined ?
         options.center : this._calculateCenter()

    this.resolution = options.resolution !== undefined ?
        options.resolution : this.constrainResolution(this._maxResolution, options.zoom - this._minZoom)

    // 记录原始 view 参数
    this._originalCenter = this.center
    this._originalResolution = this.resolution
    
    this.rotation = 0
    
    this.dataExtent = resolutionConstraint.extent
    
    this._options = options
  }
  
  
  _createRotationConstraint () {
    return 0
  }
  
  /**
   * 创建视图中心限制条件
   *
   * @method createCenterConstraint
   * @param options
   * @returns {Function}
   * @private
   */
  _createCenterConstraint () {
    return function (center) {
      return center
    }
  }
  
  /**
   * 创建分辨率限制条件
   *
   * @method createResolutionConstraint
   * @param options
   * @returns {{constraint: *, maxResolution: *, minResolution: *, minZoom: *, zoomFactor: number}}
   * @private
   */
  _createResolutionConstraint (options) {
    let resolutionConstraint
    let maxResolution
    let minResolution
    let extent
  
    const defaultMaxZoom = Config.DEFAULT_MAX_ZOOM
    const defaultZoomFactor = Config.DEFAULT_ZOOM_FACTOR
    const defaultMinZoom = Config.DEFAULT_MIN_ZOOM
    const defaultTileSize = Config.DEFAULT_TILE_SIZE
  
    let minZoom = options.minZoom !== undefined ?
      options.minZoom : defaultMinZoom
  
    let maxZoom = options.maxZoom !== undefined ?
      options.maxZoom : defaultMaxZoom
  
    const zoomFactor = options.zoomFactor !== undefined ?
      options.zoomFactor : defaultZoomFactor
  
    if (options.resolutions !== undefined) {
      const resolutions = options.resolutions
      maxResolution = resolutions[0]
      minResolution = resolutions[resolutions.length - 1]
      resolutionConstraint = this.createSnapToResolutions(resolutions)
    } else {
      // calculate the default min and max resolution
      const projection = options.projection
      extent = projection.extent
      const size = Math.max(ExtentUtil.getWidth(extent), ExtentUtil.getHeight(extent))
    
      const defaultMaxResolution = size / defaultTileSize / Math.pow(
          defaultZoomFactor, defaultMinZoom)
    
      const defaultMinResolution = defaultMaxResolution / Math.pow(
          defaultZoomFactor, defaultMaxZoom - defaultMinZoom)
    
      // user provided maxResolution takes precedence
      maxResolution = options.maxResolution
      if (maxResolution !== undefined) {
        minZoom = 0
      } else {
        maxResolution = defaultMaxResolution / Math.pow(zoomFactor, minZoom)
      }
    
      // user provided minResolution takes precedence
      minResolution = options.minResolution
      if (minResolution === undefined) {
        if (options.maxZoom !== undefined) {
          if (options.maxResolution !== undefined) {
            minResolution = maxResolution / Math.pow(zoomFactor, maxZoom)
          } else {
            minResolution = defaultMaxResolution / Math.pow(zoomFactor, maxZoom)
          }
        } else {
          minResolution = defaultMinResolution
        }
      }
    
      // given discrete zoom levels, minResolution may be different than provided
      maxZoom = minZoom + Math.floor(
          Math.log(maxResolution / minResolution) / Math.log(zoomFactor))
      minResolution = maxResolution / Math.pow(zoomFactor, maxZoom - minZoom)
    
      resolutionConstraint = this.createSnapToPower(
        zoomFactor, maxResolution, maxZoom - minZoom)
    }
    
    return {
      constraint: resolutionConstraint,
      maxResolution: maxResolution,
      minResolution: minResolution,
      minZoom: minZoom,
      zoomFactor: zoomFactor,
      extent: extent
    }
  }
  
  /**
   *
   * @param power
   * @param maxResolution
   * @param opt_maxLevel
   * @returns {Function}
   */
  createSnapToPower (power, maxResolution, opt_maxLevel) {
    return function(resolution, delta, direction) {
      if (resolution !== undefined) {
        const offset = -direction / 2 + 0.5
        const oldLevel = Math.floor(
          Math.log(maxResolution / resolution) / Math.log(power) + offset)
        let newLevel = Math.max(oldLevel + delta, 0)
        if (opt_maxLevel !== undefined) {
          newLevel = Math.min(newLevel, opt_maxLevel)
        }
  
        const reso = maxResolution / Math.pow(power, newLevel)
        return reso
      } else {
        return undefined
      }
    }
  }
  
  /**
   *
   * @param resolutions
   * @returns {Function}
   */
  createSnapToResolutions (resolutions) {
    return function(resolution, delta, direction) {
      if (resolution !== undefined) {
        let z = linearFindNearest(resolutions, resolution, direction)
        z = clamp(z + delta, 0, resolutions.length - 1)
        const index = Math.floor(z)
        if (z != index && index < resolutions.length - 1) {
          let power = resolutions[index] / resolutions[index + 1]
          return resolutions[index] / Math.pow(power, z - index)
        } else {
          return resolutions[index]
        }
      } else {
        return undefined
      }
    }
  }
  
  _calculateCenter () {
    return [500, 500]
  }
  
  
  /**
   * 获取视图状态
   *
   * @method getViewState
   * @returns {{center: (ArrayBuffer|*|Array.<T>|Blob|string), resolution: *, rotation: *}}
   */
  getViewState () {
    const center = this.center
    const resolution = this.resolution
    const rotation = this.rotation
    
    return {
      center: center.slice(),
      resolution: resolution,
      rotation: rotation
    }
  }
  
  /**
   * 分辨率限制
   *
   * @method constrainResolution
   * @param resolution
   * @param opt_delta
   * @param opt_direction
   * @returns {*}
   */
  constrainResolution (resolution, opt_delta, opt_direction) {
    const delta = opt_delta || 0
    const direction = opt_direction || 0
    return this._constraints.resolution(resolution, delta, direction)
  }
  
  /**
   * 计算缩放中心点
   *
   * @method calculateCenterZoom
   * @param resolution {Number}
   * @param anchor {Number}
   * @returns {Array}
   */
  calculateCenterZoom (resolution, anchor) {
    let center
    const currentCenter = this.center
    const currentResolution = this.resolution
    if (currentCenter !== undefined && currentResolution !== undefined) {
      const x = anchor[0] -
        resolution * (anchor[0] - currentCenter[0]) / currentResolution
      const y = anchor[1] -
        resolution * (anchor[1] - currentCenter[1]) / currentResolution
      center = [x, y]
    }
    
    return center
  }
  
  /**
   * 是否限制视图中心
   *
   * @method constrainCenter
   * @param center
   * @returns {Boolean}
   */
  constrainCenter (center) {
    this._constraints.center = center
    this._center = center
    return true
  }

  /**
   * 视图中心点读写器
   *
   * @property center
   * @return {*}
   */
  get center () { return this._center }
  set center ( value ) {
    this.constrainCenter(value)
    this.changed()
  }

  /**
   * 分辨率读写器
   *
   * @property resolution
   * @return {*}
   */
  get resolution () { return this._resolution }
  set resolution (value){
    this._resolution = value
  
    this.changed()
  }

  /**
   * 旋转率读写器
   *
   * @property rotation
   * @return {*}
   */
  get rotation () { return this._rotation }
  set rotation (value){
    this._rotation = value
  }

  /**
   * dataExtent读写器
   *
   * @property dataExtent
   * @return {*}
   */
  get dataExtent () { return this._dataExtent }
  set dataExtent (value) {
    this._dataExtent = value
  }

  /**
   * 获取最小分辨率
   *
   * @property minResolution
   * @return {Number}
   */
  get minResolution () { return this._minResolution }

  /**
   * 获取最大分辨率
   *
   * @property maxResolution
   * @returns {Number}
   */
  get maxResolution () { return this._maxResolution }
  
  
  /**
   * 获取初始设置的地图中心点
   *
   * @property originalCenter
   * @type {Array}
   */
  get originalCenter () { return this._originalCenter }
  
  /**
   * 获取初始设置的地图级别
   *
   * @property originalResolution
   * @type {Number}
   */
  get originalResolution () { return this._originalResolution }
}