/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import Extent from './Extent'

import {linearRings} from './support/Interpolate'
import {linearRingsAreOriented,orientLinearRings} from './support/Orient'

/**
 * Polygon geometry <br/>
 *
 * 面类和数据结构
 *
 * 多边形是<b>闭合数据结构</b>，所有首尾点必须相同，见例子
 *
 * @class Polygon
 * @extends Geometry
 * @module geometry
 * @constructor
 * @example
 *
 *  var polygon = new Datatang.Polygon([[100, 100], [120, 130],[50, 50],[100, 100]])
 *
 */
export default class Polygon extends Geometry {
  
  /**
   * 创建一个Polygon实例
   * @constructor
   * @param rings
   */
  constructor (rings = []) {
    super()

    this._rings = []
    
    this.rings = rings
  }

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * 可用来对图形进行拖动、旋转、缩放
   * @abstrct function
   */
  get extent () {
    if (this._extent === null) {
      const rings = this.getCoordinates()
      let xmin = Number.POSITIVE_INFINITY
      let ymin = Number.POSITIVE_INFINITY
      let xmax = Number.NEGATIVE_INFINITY
      let ymax = Number.NEGATIVE_INFINITY

      for (let ring of rings) {
        xmin = Math.min(xmin, ring[0])
        ymin = Math.min(ymin, ring[1])
        xmax = Math.max(xmax, ring[0])
        ymax = Math.max(ymax, ring[1])
      }

      this._extent = new Extent(xmin, ymin, xmax, ymax)
    }

    return this._extent
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  get geometryType () { return Geometry.POLYGON }

  /**
   * 设置多边形的边，如果设置了边，则需要重新计算
   * 外接矩形
   * @property rings
   */
  get rings () { return this._rings }
  set rings (value) {
    this._rings = value
    this._extent = null
  }
  
  /**
   * @
   * @param ring
   */
  addRing (ring) {
    this.rings.push(ring)
    this._extent = null
  }
  
  /**
   * Detemine if a point is contained in this polygon
   * @param x
   * @param y
   * @param opt
   * @returns {boolean}
   */
  containsXY (x, y, opt) {
    const px = x
    const py = y
    let flag = false
  
    const ring = this.getCoordinates()
    
    for (let i = 0, l = ring.length, j = l - 1; i < l; j = i, i++) {
      const sx = ring[i][0]
      const sy = ring[i][1]
      const tx = ring[j][0]
      const ty = ring[j][1]
    
      // 点与多边形顶点重合
      if ((sx === px && sy === py) || (tx === px && ty === py)) {
        return true
      }
    
      // 判断线段两端点是否在射线两侧
      if ((sy < py && ty >= py) || (sy >= py && ty < py)) {
        // 线段上与射线 Y 坐标相同的点的 X 坐标
        let x = sx + (py - sy) * (tx - sx) / (ty - sy)
      
        // 点在多边形的边上
        if (x === px) {
          // return 'on';
          return true
        }
      
        // 射线穿过多边形的边界
        if (x > px) {
          flag = !flag
        }
      }
    }
  
    // 射线穿过多边形边界的次数为奇数时点在多边形内
    return flag
  }
  
  /**
   * @method getFlatInteriorPoint
   * @returns {*}
   */
  getFlatInteriorPoint () {
    const flatCenter = [this.extent.centerX, this.extent.centerY]
  
    const ends = [this.getCoordinates().length * 2]
    const flatInteriorPoint = linearRings(
      this.getOrientedFlatCoordinates(), 0, ends, this.stride, flatCenter, 0)
    
    return  flatInteriorPoint
  }
  
  /**
   * @method getOrientedFlatCoordinates
   * @returns {*}
   */
  getOrientedFlatCoordinates () {
    let orientedFlatCoordinates
    
    const flatCoordinates = []
    const coordinates = this.getCoordinates()
  
    coordinates.forEach( point => {
      flatCoordinates.push(point[0], point[1])
    })
  
    const ends = [flatCoordinates.length]
    
    if (linearRingsAreOriented(flatCoordinates, 0, ends, this.stride)) {
      orientedFlatCoordinates = flatCoordinates
    } else {
      orientedFlatCoordinates = flatCoordinates.slice()
      orientedFlatCoordinates.length = orientLinearRings(orientedFlatCoordinates,
        0, ends, this.stride)
    }
    
    // this.orientedRevision_ = this.getRevision()
      
    return orientedFlatCoordinates
  }
  
  /**
   * Get the collection of geometry
   * TODO 将来都需要换成这种线性的存储方式，并逐步替换成这种模式
   * @returns {[*,*]}
   */
  getCoordinates () {
    return this.rings
  }

  /**
   * 得到最后一个点的坐标，显示表单
   * Get the last position of geometry
   * @param {Number} offsetX x的偏移量
   * @param {Number} offsetY y的偏移量
   * @returns {[*,*]}
   */
  getFormShowPosition (offsetX = 0, offsetY = 0) {
    let _positions = []
    const ring = this.getCoordinates()
    _positions[0] = ring[ring.length - 3][0] - offsetX
    _positions[1] = ring[ring.length - 3][1] - offsetY

    return _positions
  }
  
  /**
   * @method setCoordinates
   * @param coords
   */
  setCoordinates (coords) {
    this.rings = coords
    this._extent = null
    this.changed()
  }
  
  /**
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
   *
   * @returns {Polygon}
   */
  clone () {
    return new Polygon(this.getCoordinates())
  }
}
