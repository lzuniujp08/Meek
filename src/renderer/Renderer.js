/**
 * Created by zypc on 2016/11/15.
 */


import BaseObject from '../core/BaseObject'

export default class Renderer extends BaseObject {

  constructor (contianer, map) {
    super()

    this._map = map
  }
  
  get map () { return this._map }
  
  /**
   *
   * @param frameState
   */
  renderFrame (frameState) {} // eslint-disable-line no-unused-vars

  /**
   *
   */
  clear () {
  }
}
