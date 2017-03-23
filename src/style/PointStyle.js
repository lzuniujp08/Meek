/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'
// import {CommonPointStyle} from './CommonStyle'

export default class PointStyle extends BaseObject {

  /**
   * 构建一个点样式对象
   * @param style 点样式，{circle|square|cross|x|triangle}其中的一种
   * @param size 点的大小，默认15
   * @param color
   * @param alpha
   * @param xoffset
   * @param yoffset
   * @param angle
   */
  constructor (style = PointStyle.CIRCLE, size = 15, color = '#FF0000',
              alpha = 1, xoffset = 0, yoffset = 0, angle = 0) {
    super()

    this._style = style
    this._size = size
    this._color = color
    this._alpha = alpha
    this._xoffset = xoffset
    this._yoffset = yoffset
    this._angle = angle
  }
}

PointStyle.CIRCLE = 'circle'
PointStyle.SQUARE = 'square'
PointStyle.CROSS = 'cross'
PointStyle.X = 'x'
PointStyle.TRIANGLE = 'triangle'
