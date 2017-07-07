/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './geometry'
import Extent from './extent'

import {squaredSegmentDistance} from './support/geometryUtil'
import {lineString} from './support/interpolate'

/**
 * Line geometry
 *
 * 定义线类和数据结构
 *
 * @class Line
 * @extends Geometry
 * @module geometry
 * @constructor
 * @example
 *
 *  var line = new Datatang.Line()
 *
 *  line.setCoordinates([100, 100], [200, 200], [400, 500])
 */
export default class Line extends Geometry {
  
  /**
   * Create a line geometry
   * @param path
   */
  constructor (path) {
    super()
    
    this._path = []
    this.addPath(path)
  }

  get geometryType () { return Geometry.LINE }

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * @returns {null} 返回对象的最小外接矩形
   */
  get extent () {
    const me = this
    if (me._extent === null) {
      let xmin = Number.POSITIVE_INFINITY
      let ymin = Number.POSITIVE_INFINITY
      let xmax = Number.NEGATIVE_INFINITY
      let ymax = Number.NEGATIVE_INFINITY

      const coors = me.getCoordinates()
      for (let p of coors) {
        xmin = Math.min(xmin, p[0])
        ymin = Math.min(ymin, p[1])
        xmax = Math.max(xmax, p[0])
        ymax = Math.max(ymax, p[1])
      }

      me._extent = new Extent(xmin, ymin, xmax, ymax)
    }

    return me._extent
  }
  
  /**
   * @property path
   * @returns
   */
  get path () { return this._path }
  set path (value) {
    this._path = value
    this._extent = null
  }
  
  /**
   * @method addPath
   * @deprecated
   * @param coordinates
   */
  addPath (coordinates) {
    this.path.push(coordinates)
    this._extent = null
    this.changed()
  }
  
  /**
   * 遍历每一条边
   * @method forEachSegment
   * @param callback {callback}
   * @param opt
   */
  forEachSegment (callback, opt) {
    this.path.forEach(callback, opt)
  }
  
  /**
   * @param x
   * @param y
   * @param opt
   * @returns {boolean}
   */
  containsXY (x, y, opt) {
    const tolerance = opt.tolerance ? opt.tolerance : 2
    const path = this.path
    const squaredSegmentDistanceFn = squaredSegmentDistance
  
    let find = false
    for (let i = 0, ii = path.length - 1; i < ii; i++) {
      let nowP = path[i]
      let nextP = path[i + 1]
      let distance = squaredSegmentDistanceFn(x, y, nowP[0], nowP[1], nextP[0], nextP[1])
      distance = Math.sqrt(distance)
      if (distance <= tolerance) {
        find = true
        break
      }
    }
  
    return find
  }
  
  /**
   * 计算线的平面内点
   * <br> Calcaluate the interior point
   * @method getFlatInteriorPoint
   * @returns {Array}
   */
  getFlatInteriorPoint () {
    const interiorPoint = null
    const fraction = 0.5
    const flatCoordinates = []
    const coordinates = this.getCoordinates()
    
    coordinates.forEach( point => {
      flatCoordinates.push(point[0], point[1])
    })
    
    return lineString( flatCoordinates, 0, flatCoordinates.length, this.stride,
      fraction, interiorPoint)
  }
  
  getCoordinates () { return this.path }


  /**
   * 得到最后一个点的坐标，显示表单
   * Get the last position of geometry
   * @param {Number} offsetX x的偏移量
   * @param {Number} offsetY y的偏移量
   * @returns {[*,*]}
   */
  getFormShowPosition (offsetX = 0, offsetY = 0) {
    const coordinates = this.getCoordinates()
    if (coordinates.length === 0) {
      return null
    }
    
    const lastPoint = coordinates[coordinates.length - 1]
    
    return [lastPoint[0] - offsetX, lastPoint[1] - offsetY]
  }
  
  /**
   * Set coordinate for line
   * @method setCoordinates
   * @param coords
   */
  setCoordinates (coords) {
    this.path = coords
    this._extent = null
    this.changed()
  }
  
  /**
   * 根据坐标点，计算改点的下标
   *
   * Get index in line coordinates by gived point
   * @method getCoordinateIndex
   * @param coord
   * @returns {*|number}
   */
  getCoordinateIndex (coord) {
    return this.getCoordinates().findIndex(function(points){
      return points[0] === coord[0] && points[1] === coord[1]
    })
  }
  
  /**
   * Clone a line
   * @returns {Line} new line
   */
  clone () {
    const newLine = new Line()
    newLine.path = this.path
    return newLine
  }
  
}
