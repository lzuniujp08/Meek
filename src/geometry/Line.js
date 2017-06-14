/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import Extent from './Extent'

import {squaredSegmentDistance} from './support/GeometryUtil'
import {lineString} from './support/Interpolate'

export default class Line extends Geometry {

  constructor (path) {
    super()
    
    this._path = []
    this.addPath(path)
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
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

      for (let p of me.path) {
        xmin = Math.min(xmin, p[0])
        ymin = Math.min(ymin, p[1])
        xmax = Math.max(xmax, p[0])
        ymax = Math.max(ymax, p[1])
      }

      me._extent = new Extent(xmin, ymin, xmax, ymax)
    }

    return me._extent
  }

  get path () { return this._path }
  set path (value) {
    this._path = value
    this._extent = null
  }
  
  addPath (coordinates) {
    this.path.push(coordinates)
    this._extent = null
  }
  
  forEachSegment (callback, opt) {
    this.path.forEach(callback, opt)
  }
  
  /**
   *
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
   *
   * @returns {(*|*)[]}
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
  
  /**
   * Get the collection of geometry
   * TODO 将来都需要换成这种线性的存储方式，并逐步替换成这种模式
   * @returns {[*,*]}
   */
  getCoordinates () {
    return this.path
  }
  
  setCoordinates (coords) {
    this.path = coords
  }
  
  getCoordinateIndex (coord) {
    return this.path.findIndex(function(points){
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
