/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './geometry'
import Extent from './extent'

import {linearRings} from './support/interpolate'
import {linearRingsAreOriented,orientLinearRings} from './support/orient'

/**
 * 面类和数据结构
 *
 * 多边形是<b>闭合数据结构</b>，所有首尾点必须相同。
 *
 * 多边形顶点存储是一个二维数组，数组中第一条闭合点串表示多边形
 * 的最外层，第二条及其以后表示多边形的内部洞环。
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
  
    this.setCoordinates(rings)
  }

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * 可用来对图形进行拖动、旋转、缩放
   *
   * @method extent
   * @abstrct function
   * @returns {Extent}
   */
  get extent () {
    if (this._extent === null) {
      const coords = this.getCoordinates()
      
      // 计算最小外界矩形，只考虑外围环
      if (coords.length > 0) {
        let rings = coords[0]
  
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
    }

    return this._extent
  }

  /**
   * 获取对象的几何类型
   *
   * @method geometryType
   * @abstrct function
   * @returns {String}
   */
  get geometryType () { return Geometry.POLYGON }

  /**
   * 设置多边形的边，如果设置了边，则需要重新计算
   * 外接矩形
   *
   * @property rings
   */
  get rings () { return this._rings }
  set rings (value) {
    this._rings = value
    this._extent = null
  }
  
  /**
   * 多边形添加线段
   *
   * @method addRing
   * @param ring {Array}
   *
   */
  addRing (ring) {
    this.rings.push(ring)
    this._extent = null
  }
  
  /**
   * 判断点是否在多边形上
   *
   * @method containsXY
   * @param x {Number}
   * @param y {Number}
   * @returns {Boolean}
   */
  containsXY (x, y) {
    const coords = this.getCoordinates()
    const outRing = coords[0]
    
    let contains = false
    if (this._inOneRing(x, y, outRing)) {
      contains = true
    }
    
    if (coords.length > 1 && contains) {
      const coordsTemp = coords.slice(1)
      
      const inHole = coordsTemp.some( ring => {
        return this._inOneRing(x, y, ring)
      })
      
      if (inHole) {
        contains = false
      }
    }
    
    return contains
  }
  
  /**
   * 判断 x 和 y 的值是否在环内
   *
   * @param x {Number}
   * @param y {Number}
   * @param ring {Array}
   * @returns {Boolean}
   * @private
   */
  _inOneRing (x, y, ring) {
    const px = x
    const py = y
    let flag = false
  
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
   * @todo 将来需要缓存下来，渲染时频繁计算会产生性能开销,使用revision机制来控制
   * getFlatInteriorPoint
   * @returns {*}
   */
  getFlatInteriorPoint () {
    const flatCenter = [this.extent.centerX, this.extent.centerY]
  
    const ends = [this.getCoordinates()[0].length * 2]
    const orientedFlatCoordinates = this.getOrientedFlatCoordinates()
    
    const flatInteriorPoint = linearRings(
      orientedFlatCoordinates, 0, ends, this.stride, flatCenter, 0)
    
    return  flatInteriorPoint
  }
  
  /**
   * 对多边形的边进行顺序化
   * getOrientedFlatCoordinates
   * @returns {*}
   */
  getOrientedFlatCoordinates () {
    let orientedFlatCoordinates
    
    const flatCoordinates = []
    const coordinates = this.getCoordinates()[0]
  
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
   * 获取多边形坐标
   *
   * @method getCoordinates
   * @returns {[*,*]}
   */
  getCoordinates () {
    return this.rings
  }

  /**
   * 得到最后一个点的坐标，显示表单
   *
   * @param {Number} offsetX x的偏移量
   * @param {Number} offsetY y的偏移量
   * @returns {[*,*]}
   */
  getFormShowPosition (offsetX = 0, offsetY = 0) {
    const coordinates = this.getCoordinates()[0]
    if (coordinates.length === 0) {
      return
    }
    
    const lastPoint = coordinates[coordinates.length - 2]
    return [lastPoint[0] - offsetX, lastPoint[1] - offsetY]
  }
  
  /**
   * 设置多边形的坐标
   *
   * @method setCoordinates
   * @param coords
   */
  setCoordinates (coords) {
    this.rings = coords
    this._extent = null
    this.stride = 2
    this.changed()
  }
  
  /**
   * getCoordinateIndex
   * @param coord
   * @returns {*|number}
   */
  getCoordinateIndex (coord) {
    const coords = this.getCoordinates()
    for (let i = 0, len = coords.length; i < len; i++) {
      const rings = coords[i]
      for (let j = 0,jLen = rings.length; j < jLen; j++) {
        const point = rings[j]
        if (point[0] === coord[0] && point[1] === coord[1]) {
          return {
            ringIndex: i,
            index: j
          }
        }
      }
    }
    
    return {
      ringIndex: -1,
      index: -1
    }
  }
  
  /**
   * 克隆多边形
   *
   * @method clone
   * @returns {Polygon}
   */
  clone () {
    const coords = this.getCoordinates()
    
    const newCoordinates = []
    let outRings = []
    coords.forEach( ring => {
      ring.forEach(points => {
        outRings.push([points[0], points[1]])
      })
  
      newCoordinates.push(outRings)
      outRings = []
    })
    
    const newPolygon = new Polygon()
    newPolygon.setCoordinates(newCoordinates)
    
    return newPolygon
  }
}
