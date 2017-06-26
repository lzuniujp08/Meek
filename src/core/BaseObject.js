/**
 * Created by zypc on 2016/11/13.
 */

import Event from './Event'
import {getUid} from '../utils/Counter'
import {EventType} from '../meek/EventType'

/**
 * The base object that only can be inherited,
 * It will
 */
export default class BaseObject extends Event {

  /**
   * 本对象只能被继承,不能直接实例化使用
   * @consructor
   */
  constructor () {
    super()
  
    /**
     *
     * @type {number}
     * @private
     */
    this._id = getUid()
  
    /**
     *
     * @type {number}
     * @private
     */
    this._revision = 0
  }
  
  /**
   * Dispatch a 'change' event and the
   * map will render the frame.
   */
  changed () {
    ++this._revision
    this.dispatchEvent(EventType.CHANGE)
    
    console.log('revision:' + this._revision)
  }

  /**
   * 获取对象的ID
   * @returns {string}
   */
  get id () {
    return this._id
  }
  
  /**
   *
   * @returns {number}
   */
  get revision () { return this._revision }
  
}
