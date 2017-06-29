/**
 * Created by zypc on 2016/11/13.
 */

import Event from './Event'
import {getUid} from '../utils/Counter'
import {EventType} from '../meek/EventType'

/**
 * The BaseObject is a base class that only can be inherited, not be instanced.<br/>
 *
 * 对象基类，所有Meek中的子类原则上要继承该类。<br/>
 * 该类提供一个 id 和一个 revision,
 * id 用于作为类的ID标示
 *
 * @class BaseObject
 * @extends Event
 * @constructor
 * @module core
 */
export default class BaseObject extends Event {

  /**
   * Create a BaseObject
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
   * Dispatch a 'change' event and the map will render the frame.
   * <br/>
   * 此方法用于派发map渲染事件
   *
   * @method changed
   */
  changed () {
    ++this._revision
    this.dispatchEvent(EventType.CHANGE)
  }

  /**
   * get the id value <br/>
   * ID属性，用于获取该对象的ID编号
   * @property id
   * @type Number
   */
  get id () {
    return this._id
  }
  
  /**
   * get the revision value
   * @property revision
   * @type Number
   * @returns {number} the revision id
   */
  get revision () { return this._revision }
  
}