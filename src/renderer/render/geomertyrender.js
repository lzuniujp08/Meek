/**
 * Created by zhangyong on 2017/3/20.
 */

import BaseObject from '../../core/baseobject'
import {equals} from '../../utils/array'
import {Transform} from '../../data/matrix/transform'

export default class GeomertyRender extends BaseObject {
  constructor (context) {
    super()
  
    /**
     *
     */
    this._context = context
  
    /**
     *
     * @type {Array}
     * @private
     */
    this._pixelCoordinates = null
  
    /**
     *
     * @type {*}
     */
    this.renderedTransform = Transform.create()
  }
  
  /**
   *
   */
  resetRenderOption () {
    this._pixelCoordinates = null
    this.renderedTransform = Transform.create()
  }
  
  /**
   *
   * @param transform1
   * @param transform2
   */
  equalsTransform (transform1, transform2) {
    return equals(transform1, transform2)
  }
  
  /**
   * context getter
   * @returns {*}
   */
  get context () { return this._context }
  
  /**
   * abstract function
   * @param feature
   * @param renderStyle
   * @param transform
   */
  render (feature, renderStyle, transform) {} // eslint-disable-line no-unused-vars
}
