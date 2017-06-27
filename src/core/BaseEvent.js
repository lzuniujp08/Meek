/**
 * Created by zhangyong on 2017/5/22.
 */


export default class BaseEvent {
  
  constructor (type) {
  
    /**
     *
     * @type {boolean}
     */
    this.propagatinoStopped = false
  
    /**
     * The event type.
     * @type {string}
     */
    this.type = type
  
    /**
     * The event target.
     * @type {Object}
     */
    this.target = null
  }
  
}

/**
 * @param {Event|Event} evt Event
 */
BaseEvent.stopPropagation = function(evt) {
  evt.stopPropagation()
}


/**
 * @param {Event|Event} evt Event
 */
BaseEvent.preventDefault = function(evt) {
  evt.preventDefault()
}