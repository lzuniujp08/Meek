/**
 * Created by zhangyong on 2017/3/20.
 */

import BaseObject from '../../core/BaseObject'

export default class LayerRenderer extends BaseObject {
  
  constructor (layer) {
    super()
    
    this._layer = layer
  }
  
  /**
   *
   * @returns {*}
   */
  get layer () { return this._layer }
  
  /**
   *
   */
  prepareFrame () {}
  
  /**
   *
   */
  composeFrame () {}
  
}