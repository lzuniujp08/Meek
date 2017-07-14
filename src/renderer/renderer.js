/**
 * Created by zypc on 2016/11/15.
 */


import BaseObject from '../core/baseobject'

/**
 * 地图渲染器基类，
 * @class Renderer
 * @extends BaseObject
 * @module renderer
 */
export default class Renderer extends BaseObject {

  constructor (contianer, map) {
    super()

    this._map = map
  }
  
  /**
   * @property map
   * @type {Datatang.Map}
   */
  get map () { return this._map }
  
  /**
   *
   * @method renderFrame
   * @abstract
   * @param frameState {Object}
   */
  renderFrame (frameState) {} // eslint-disable-line no-unused-vars

  /**
   * @method clear
   * @abstract
   */
  clear () {}
}
