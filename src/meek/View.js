/**
 * Created by zhangyong on 2017/3/23.
 */


import BaseObject from '../core/BaseObject'


export default class View extends BaseObject {
  constructor (options) {
    super()
    
    const _innerOptions = Object.assign({}, options)
    
    this._applyOptions(_innerOptions)
  }
  
  
  _applyOptions (options) {
    this.center = options.center !== undefined ?
         options.center : this._calculateCenter()
    
    
    this.resolution = options.resolution !== undefined ?
        options.resolution : this._calculateResolution()
    
    this.rotation = 0
  }
  
  
  _calculateCenter () {
    return [500, 500]
  }
  
  _calculateResolution () {
    return 0.94
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