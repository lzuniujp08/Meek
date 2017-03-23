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

    // 定义每一个类都拥有一个唯一ID
    this._id = getUid()
  }

  changed () {
    this.dispatchEvent(EventType.CHANGE)
  }

  /**
   * 获取对象的ID
   * @returns {string}
   */
  get Id () {
    return this._id
  }
}
