/**
 * Created by zhangyong on 2017/3/23.
 */

import BaseObject from '../core/BaseObject'
import {ExtentUtil} from '../geometry/support/ExtentUtil'
import {Config} from '../meek/Config'

/**
 * @class View
 * @extends BaseObject
 * @module meek
 * @constructor
 */
export default class View extends BaseObject {
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
  
    // if (options.resolution !== undefined) {
    //   properties[ol.ViewProperty.RESOLUTION] = options.resolution
    // } else if (options.zoom !== undefined) {
    //   properties[ol.ViewProperty.RESOLUTION] = this.constrainResolution(
    //     this.maxResolution_, options.zoom - this.minZoom_)
    // }
    // properties[ol.ViewProperty.ROTATION] =
    //   options.rotation !== undefined ? options.rotation : 0
    // this.setProperties(properties)
  
  
    this.center = options.center !== undefined ?
         options.center : this._calculateCenter()

    this.resolution = options.resolution !== undefined ?
        options.resolution : this.constrainResolution(this._maxResolution, options.zoom - this._minZoom)

    this.rotation = 0
    
    this.dataExtent = resolutionConstraint.extent
    
    this._options = options
  }
  
  
  _createRotationConstraint () {
    return 0
  }
  
  /**
   *
   * @param options
   * @returns {Function}
   * @private
   */
  _createCenterConstraint (options) {
    if (options.extent !== undefined) {
    } else {
      return function (center) {
        return center
      }
    }
  }
  
  /**
   *
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
      // resolutionConstraint = ol.ResolutionConstraint.createSnapToResolutions(resolutions)
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
        return maxResolution / Math.pow(power, newLevel)
      } else {
        return undefined
      }
    }
  }
  
  _calculateCenter () {
    return [500, 500]
  }
  
  _calculateResolution () {
    return 0.94
  }
  
  /**
   *
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
   *
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
   *
   * @param resolution
   * @param anchor
   * @returns {*}
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
   *
   * @param center
   * @returns {*}
   */
  constrainCenter (center) {
    this._constraints.center = center
    this._center = center
    return true
  }
  
  
  get center () { return this._center }
  set center ( value ) {
    this.constrainCenter(value)
    this.changed()
  }
  
  get resolution () { return this._resolution }
  set resolution (value){
    this._resolution = value
  
    this.changed()
  }
  
  get rotation () { return this._rotation }
  set rotation (value){
    this._rotation = value
  }
  
  get dataExtent () { return this._dataExtent }
  set dataExtent (value) {
    this._dataExtent = value
  }
  
  get minResolution () { return this._minResolution }
  get maxResolution () { return this._maxResolution }
}