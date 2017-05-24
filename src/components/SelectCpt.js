/**
 * Created by zhangyong on 2017/5/23.
 */

import Component from './Component'

import BrowserEvent from '../meek/BrowserEvent'


export default class SelectCpt extends Component {
  
  constructor (options) {
    super()
    
    
    const opt = options ? options : {}
    
    this.selectMode = opt.selectMode ? opt.selectMode : BrowserEvent.SINGLE_CLICK
    
    this._hitTolerance = opt.hitTolerance ? opt.hitTolerance : 0
    
  }
  
  
  handleMouseEvent (browserEvent) {
    if (!this.selectMode(browserEvent)) {
      return
    }
    
    const map = browserEvent.map
    const piexl = browserEvent.piexl
    const hitTolerance = this._hitTolerance
    const layers = map.layers
    
    layers.forEach(function(layer) {
      layer.forEachFeatureAtPiexl(piexl, function() {
        
      }, hitTolerance)
    })
    
    
    
    
    
    
    
    
    
  }
  
}