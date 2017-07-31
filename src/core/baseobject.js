/**
 * Created by zypc on 2016/11/13.
 */
// The BaseObject is a base class that only can be inherited, not be instanced.
import Event from './event'
import {getUid} from '../utils/counter'
import {EventType} from '../meek/eventtype'

/**
 * 对象基类，所有子类原则上要继承该类。
 *
 * 该类提供一个 id 和一个 revision,id 作为类的唯一标示
 *
 * @class BaseObject
 * @extends Event
 * @constructor
 * @module core
 */
export default class BaseObject extends Event {

  /**
   * Create a BaseObject
   *
   * 构造函数
   *
   * @consructor
   */
  constructor () {
    super()
  
    /**
     * ID
     *
     * @property id
     * @type {Number}
     * @private
     */
    this._id = getUid()
  
    /**
     * 版本号
     *
     * @property revision
     * @type {Number}
     * @private
     */
    this._revision = 0
  }
  
  /**
   * 此方法用于派发map渲染事件
   *
   * @example this.changed() | super.changed()
   *
   * @method changed
   */
  changed () {
    ++this._revision
    this.dispatchEvent(EventType.CHANGE)
  }

  /**
   *
   * ID属性，用于获取该对象的ID编号
   *
   * @property id
   * @type {Number}
   */
  get id () {
    return this._id
  }
  
  /**
   *
   * 地图渲染的版本号
   *
   * @property revision
   * @type {Number}
   * @returns {Number} the revision id
   */
  get revision () { return this._revision }
  
}