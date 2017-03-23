/**
 * Created by zypc on 2016/11/13.
 */

import BaseObject from '../core/BaseObject'

export default class Geometry extends BaseObject {

  /**
   * @constructor
   */
  constructor () {
    super()
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  get geomType () {}

  /**
   * 获取图形的最小外接矩形(MBR-Minimum Bounding Rectangle)
   * 除去点意外，任何图形都有最小外接矩形
   * 可用来对图形进行拖动、旋转、缩放
   * @abstrct function
   */
  get MBR () {}

  /**
   * 将图形转换成json格式
   * @abstrct function
   */
  toJSON () {}
}

Geometry.POINT = 'point'
Geometry.MULTI_POINT = 'multi_point'
Geometry.LINE = 'line'
Geometry.MULTI_LINE = 'multi_line'
Geometry.POLYGON = 'polygon'
Geometry.MULTI_POLYGON = 'multi_polygon'
Geometry.MBR = 'mbr'
