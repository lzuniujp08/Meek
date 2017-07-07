/**
 * Created by zhangyong on 2017/6/5.
 */

export default class Obj {
  
  /**
   * Get a collection from object
   * @param object
   * @returns {Array}
   */
  static getValues (object) {
    const values = []
    for (let property in object) {
      values.push(object[property])
    }
    return values
  }
  
  /**
   * Clear all properties in object
   * @param object
   */
  static clear (object) {
    for (let property in object) {
      delete object[property]
    }
  }
  
  /**
   * Convert an object to a map instance
   * @param obj
   * @returns {Map}
   */
  static objectToMap (obj) {
    let map = new Map()
    
    for (let ke of Object.keys(obj)) {
      map.set(ke, obj[ke])
    }
    
    return map
  }
}

