/**
 * Created by zypc on 2016/11/13.
 */

import Geometry from './Geometry'
import Point from './Point'

export default class MBR extends Geometry {

  /**
   * 构建一个MBR对象
   * @param xmin
   * @param ymin
   * @param xmax
   * @param ymax
   */
  constructor (xmin = 0, ymin = 0, xmax = 0, ymax = 0) {
    super()

    this._xmin = xmin
    this._ymin = ymin
    this._xmax = xmax
    this._ymax = ymax
  }

  /**
   * 获取对象的几何类型
   * @abstrct function
   */
  get geomType () { return Geometry.MBR }

  /**
   * 计算最小外接矩形(MBR)的中心点
   * @returns {*} 返回一个Point对象
   */
  get centerPoint () {
    return new Point(this.centerX, this.centerY)
  }

  /**
   * 计算X坐标的中心
   * @returns {number}
   */
  get centerX () { return (this.xmax - this.xmin) / 2 }

  /**
   * 计算Y坐标的中心
   * @returns {number}
   */
  get centerY () { return (this.ymax - this.ymin) / 2 }

  /**
   * 计算最小外接矩形的宽
   * @returns {number}
   */
  get width () { return Math.abs(this.xmax - this.xmin) }

  /**
   * 计算最小外接矩形的高
   * @returns {number}
   */
  get heigth () { return Math.abs(this.ymax - this.ymin) }

  /**
   * 获取最小外接矩形
   * 本对象
   * @returns {MBR}
   */
  get MBR () { return this }

  get xmin () { return this._xmin }
  set xmin (value) { this._xmin = value }

  get ymin () { return this._ymin }
  set ymin (value) { this._ymin = value }

  get xmax () { return this._xmax }
  set xmax (value) { this._xmax = value }

  get ymax () { return this._ymax }
  set ymax (value) { this._ymax = value }
}
