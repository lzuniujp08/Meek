
import BaseObject from '../core/baseobject'

export default class Kinetic extends BaseObject{
  
  constructor(decay, minVelocity, delay){
  
    super()
    
    /**
     * @private
     * @type {number}
     */
    this._decay = decay
  
    /**
     * @private
     * @type {number}
     */
    this._minVelocity = minVelocity
  
    /**
     * @private
     * @type {number}
     */
    this._delay = delay
  
    /**
     * @private
     * @type {Array.<number>}
     */
    this._points = []
  
    /**
     * @private
     * @type {number}
     */
    this._angle = 0
  
    /**
     * @private
     * @type {number}
     */
    this._initialVelocity = 0
  }
  
  
  /**
   */
  begin () {
    this._points.length = 0
    this._angle = 0
    this._initialVelocity = 0
  }
  
  
  /**
   * @param {number} x X.
   * @param {number} y Y.
   */
  update (x, y) {
    this._points.push(x, y, Date.now())
  }
  
  
  /**
   * @return {boolean} Whether we should do kinetic animation.
   */
  end () {
    if (this._points.length < 6) {
      // at least 2 points are required (i.e. there must be at least 6 elements
      // in the array)
      return false
    }
    const delay = Date.now() - this._delay
    const lastIndex = this._points.length - 3
    if (this._points[lastIndex + 2] < delay) {
      // the last tracked point is too old, which means that the user stopped
      // panning before releasing the map
      return false
    }
    
    // get the first point which still falls into the delay time
    let firstIndex = lastIndex - 3
    while (firstIndex > 0 && this._points[firstIndex + 2] > delay) {
      firstIndex -= 3
    }
    
    const duration = this._points[lastIndex + 2] - this._points[firstIndex + 2]
    const dx = this._points[lastIndex] - this._points[firstIndex]
    const dy = this._points[lastIndex + 1] - this._points[firstIndex + 1]
    this._angle = Math.atan2(dy, dx)
    this._initialVelocity = Math.sqrt(dx * dx + dy * dy) / duration
    return this._initialVelocity > this._minVelocity
  }
  
  
  /**
   * @return {number} Total distance travelled (pixels).
   */
  getDistance () {
    return (this._minVelocity - this._initialVelocity) / this._decay
  }
  
  
  /**
   * @return {number} Angle of the kinetic panning animation (radians).
   */
  angle () {
    return this._angle
  }
 
}



