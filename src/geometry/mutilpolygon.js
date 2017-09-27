/**
 * Created by zhangyong on 2017/8/4.
 */

import Geometry from './geometry'
import Polygon from './polygon'
import Extent from './extent'

import {centerLinearRingss, linearRingss} from './support/interpolate'
import {linearRingssAreOriented,orientLinearRingss} from './support/orient'


/**
 * 定义复合多边形对象和数据结构
 *
 *
 * @class MutilPolygon
 * @module geometry
 * @constructor
 *
 */
export default class MutilPolygon extends Geometry {
  
  constructor (coordinates) {
    super()
    
    this._polygons = []
  
    this.stride = 2
  
    /**
     * 记录当前多边形内点更新的次数
     * @type {number}
     * @private
     */
    this._flatInteriorPointRevision = -1
  
    /**
     * 缓存当前多边形内点
     * @type {null}
     * @private
     */
    this._flatInteriorPoint = null
  
    this.setCoordinates(coordinates)
  }
  
  /**
   *
   * @returns {String}
   */
  get geometryType () { return Geometry.MULTI_POLYGON }
  
  /**
   * 计算复合多边形的最小外界矩形
   * 注意：这里所求出来的是多个多边形的最小外界矩形，既一个能包裹所有
   * 多边形的矩形
   *
   * @returns {Extent|null}
   */
  get extent () {
    if (this._extent === null) {
      const allPolygonCoords = this.getCoordinates()
    
      // 计算最小外界矩形，只考虑外围环
      if (allPolygonCoords.length > 0) {
        let xmin = Number.POSITIVE_INFINITY
        let ymin = Number.POSITIVE_INFINITY
        let xmax = Number.NEGATIVE_INFINITY
        let ymax = Number.NEGATIVE_INFINITY
        
        allPolygonCoords.forEach( polyCoods => {
          let rings = polyCoods[0]
          for (let ring of rings) {
            xmin = Math.min(xmin, ring[0])
            ymin = Math.min(ymin, ring[1])
            xmax = Math.max(xmax, ring[0])
            ymax = Math.max(ymax, ring[1])
          }
        })
      
        this._extent = new Extent(xmin, ymin, xmax, ymax)
      }
    }
  
    return this._extent
  }
  
  /**
   * 获得复合多边形的坐标
   * @returns {Array|*}
   */
  getCoordinates () {
    return this._polygons
  }
  
  /**
   * 设置复合多边形的坐标
   * @param coordinates
   */
  setCoordinates (coordinates) {
    this._polygons = coordinates
    this._extent = null
    this.changed()
  }
  
  /**
   * 获得一个多边形对象
   * @method getPolygon
   * @param index 多边形的下标
   * @returns {Datatang.Polygon} 返回一个新的多边形对象
   */
  getPolygon (index) {
    if (index < 0 && this._polygons.length < index ) {
      return null
    }
    
    const coords = this._polygons[index]
    let outRing = []
    let innerRing = []
    coords.forEach( rings => {
      rings.forEach( points => {
        innerRing.push([points[0], points[1]])
      })
      
      outRing.push(innerRing)
      innerRing = []
    })
    
    const polygon = new Polygon(outRing)
    return polygon
  }
  
  /**
   * 判断集合多边形是否包括指定 x 和 y
   * @param x
   * @param y
   * @returns {boolean}
   */
  containsXY (x, y) {
    const polygons = this._polygons
    for (let i = 0, len = polygons.length; i < len; i ++ ) {
      const onePolygon = this.getPolygon(i)
      if (onePolygon.containsXY(x, y)) {
        return true
      }
    }
    
    return false
  }
  
  /**
   * 获取标签显示的内点
   * 注意：复合多边形，标签显示的位置，只显示在第一个图形上
   * @returns {*}
   */
  getFlatInteriorPoint () {
    if (this._flatInteriorPointRevision !== this.revision) {
      this._flatInteriorPointRevision = this.revision
  
      const polygons = this._polygons
      let flatCoordinates = []
      let endss = []
  
      const orderArray = []
  
      polygons.forEach( polygon => {
        const outRings = polygon[0]
        orderArray.push(outRings)
      })
  
      orderArray.sort( (arr1, arr2) => {
        return arr1.length - arr2.length
      })
  
      let lastLen = 0
      orderArray.forEach( arr => {
        const currLen = arr.length * 2 + lastLen
        endss.push([currLen])
        lastLen = currLen
    
        arr.forEach( points => {
          flatCoordinates.push(points[0], points[1])
        })
      })
  
      const flatCenters = centerLinearRingss(flatCoordinates, 0, endss, this.stride)
      this._flatInteriorPoint = linearRingss(
        this.getOrientedFlatCoordinates(flatCoordinates, endss), 0, endss, this.stride,
        flatCenters)
    }
    
  
    return this._flatInteriorPoint
  }
  
  /**
   * 计算复合多边形顺时针坐标
   * @param flatCoordinates
   * @param endss
   * @returns {*}
   */
  getOrientedFlatCoordinates (flatCoordinates, endss) {
    let orientedFlatCoordinates
    
    if (linearRingssAreOriented(flatCoordinates, 0, endss, this.stride)) {
      orientedFlatCoordinates = flatCoordinates
    } else {
      orientedFlatCoordinates = flatCoordinates.slice()
      orientedFlatCoordinates.length = orientLinearRingss(orientedFlatCoordinates,
        0, endss, this.stride)
    }
    
    return orientedFlatCoordinates
  }
  
  /**
   * 根据坐标值计算复合多边形的点下标
   *
   * @method getCoordinateIndex
   * @param coord 坐标值，[x, y]结构
   * @returns {
   *    {
   *      polygonIndex: number 位于第几个多边形上 ,
   *      ringIndex: number 位于多边形第几个环上,
   *      index: number 位于环上第几个顶点上
   *     }
   *   }
   */
  getCoordinateIndex (coord) {
    const polygonCoods = this.getCoordinates()
    
    for ( let ii = 0, iiLen = polygonCoods.length ; ii < iiLen; ii ++) {
      const coords = polygonCoods[ii]
  
      for (let i = 0, len = coords.length; i < len; i++) {
        const rings = coords[i]
        for (let j = 0,jLen = rings.length; j < jLen; j++) {
          const point = rings[j]
          if (point[0] === coord[0] && point[1] === coord[1]) {
            return {
              polygonIndex : ii,
              ringIndex: i,
              index: j
            }
          }
        }
      }
    }
  
    return {
      polygonIndex : -1,
      ringIndex: -1,
      index: -1
    }
  }
  
  /**
   * 克隆一个 Mutilpolygon
   * @returns {MutilPolygon}
   */
  clone () {
    const allCoords = []
    
    this._polygons.forEach( coords => {
      let outRing = []
      let innerRing = []
      coords.forEach( rings => {
        rings.forEach( points => {
          innerRing.push([points[0], points[1]])
        })
    
        outRing.push(innerRing)
      })
  
      allCoords.push(outRing)
      outRing = []
    })
    
    const newMutilPolygon = new MutilPolygon(allCoords)
    return newMutilPolygon
  }
  
}