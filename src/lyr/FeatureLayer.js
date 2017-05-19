
import BaseLayer from './BaseLayer'
import {Style} from '../style/Style'

export default class FeatureLayer extends BaseLayer {

  constructor (options) {
    const baseOptions = Object.assign({}, options)
    super(baseOptions)

    let optionsInner = options ? options : ({})
    this._features = []
  
  
    this._style = null
    this._styleFunction = null
    
    this.style = optionsInner.style
    
  }
  
  clear () {
    this._features = []
  }

  get features () { return this._features }

  addFeatures (features) {
    this._addFeaturesInner(features)
    this.changed()
  }

  _addFeaturesInner (features) {
    if (!Array.isArray(features)) {
      return false
    }

    features.map(feature => this.features.push(feature))
  }
  
  set style (value) {
    this._style = value !== undefined ? value : Style.defaultFunction()
    this._styleFunction = value === null ? undefined :Style.createFunction(this._style)
  }
  
  get style () {
    if(this._style === null){
      this._style = Style.defaultFunction()
    }
    
    return this._style
  }
  
  get styleFunction () { return this._styleFunction }
}
