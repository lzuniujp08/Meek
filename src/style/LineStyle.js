/**
 * Created by zypc on 2016/11/15.
 */

import BaseObject from '../core/BaseObject'

export default class LineStyle extends BaseObject {

  constructor (style = LineStyle.SOLID, color = 0, alpha = 1, width = 1) {
    super()

    this._style = style
    this._color = color
    this._alpha = alpha
    this._width = width
  }
}

LineStyle.SOLID = 'solid';
LineStyle.DASH = 'dash';
LineStyle.DOT = 'dot';
LineStyle.DASHDOT = 'dashdot';
LineStyle.DASHDOTDOT = 'dashdotdot';
LineStyle.NULL = 'none';
