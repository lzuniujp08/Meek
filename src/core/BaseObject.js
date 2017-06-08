/**
 * Created by zypc on 2016/11/13.
 */

import Event from './Event'
import {getUid} from '../utils/Counter'
import {EventType} from '../meek/EventType'

export default class BaseObject extends Event {

  /**
   * 本对象只能被继承,不能直接实例化使用
   * @consructor
   */
  constructor () {
    super()

    // every subclass will keep an id
    this._id = getUid()
  }
  
  /**
   * Dispatch a 'change' event and the
   * map will render the frame.
   */
  changed () {
    this.dispatchEvent(EventType.CHANGE)
  }

  /**
   * 获取对象的ID
   * @returns {string}
   */
  get id () {
    return this._id
  }
}
