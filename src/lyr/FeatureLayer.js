
import BaseLayer from './BaseLayer'

export default class FeatureLayer extends BaseLayer {

  constructor () {
    super()

    this._features = []
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
}
