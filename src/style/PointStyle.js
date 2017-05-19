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
  constructor (size = 15, color = [255,0,0], alpha = 1,borderStyle = null,
               xoffset = 0, yoffset = 0, angle = 0, style = PointStyle.CIRCLE) {
    super()

    this._style = style
    this._size = size
    this._color = color
    this._alpha = alpha
    this._xoffset = xoffset
    this._yoffset = yoffset
    this._angle = angle
    this._borderStyle = borderStyle
  }
  
  get style () { return this._style }
  set style (value) { this._style = value }
  
  get size(){ return this._size }
  set size(value){ this._size = value}
  
  get color(){ return this._color }
  set color(value){ this._color = value}
  
  get alpha(){ return this._alpha }
  set alpha(value){ this._alpha = value}
  
  get xoffset(){ return this._xoffset }
  set xoffset(value){ this._xoffset = value}
  
  get yoffset(){ return this._yoffset }
  set yoffset(value){ this._yoffset = value}
  
  get angle(){ return this._angle }
  set angle(value){ this._angle = value}
  
  get borderStyle(){ return this._borderStyle }
  set borderStyle(value){ this._borderStyle = value}
  
}

PointStyle.CIRCLE = 'circle'

PointStyle.SQUARE = 'square'

PointStyle.CROSS = 'cross'

PointStyle.X = 'x'

PointStyle.TRIANGLE = 'triangle'
