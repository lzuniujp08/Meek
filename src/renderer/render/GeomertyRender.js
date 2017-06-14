/**
 * Created by zhangyong on 2017/3/20.
 */

import BaseObject from '../../core/BaseObject'

export default class GeomertyRender extends BaseObject {
  constructor (context) {
    super()
    this._context = context
  }
  
  get context () { return this._context }
  
  render (feature, transform) {} // eslint-disable-line no-unused-vars
}
