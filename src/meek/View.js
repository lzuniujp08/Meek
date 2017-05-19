/**
 * Created by zhangyong on 2017/3/23.
 */


import BaseObject from '../core/BaseObject'


export default class View extends BaseObject {
  constructor (options) {
    super()
    
    let _innerOptions = options || {}
    
    this.center = _innerOptions.center || null || [200,200]
    
  }
  
  getViewState () {
    const center = this.center
    const resolution = this.resolution
    const rotation = this.rotation
    
    return {
      center: center.slice(),
      resolution: resolution,
      rotation: rotation
    }
  }
  
  get center () { return this._center }
  set center ( value ) {
    this._center = value
  }
  
  get resolution () { return this._resolution }
  set resolution (value){
    this._resolution = value
  }
  
  get rotation () { return this._rotation }
  set rotation (value){
    this._rotation = value
  }
  
  
}