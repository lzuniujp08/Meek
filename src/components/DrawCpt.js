/**
 * Created by zypc on 2016/11/15.
 */

import Component from './Component'
import FeaureLayer from '../lyr/FeatureLayer'
import Feature from '../meek/Feature'
import Point from '../geom/Point'

export default class DrawCpt extends Component {

  constructor () {
    super()

    /**
     * 初始化草稿图层，用于临时显示绘制的图形
     * 当鼠标down事件执行完毕后，将会移植到绘制画布上
     * @type {FeatureLayer}
     * @private
     */
    this._sketchLayer = new FeaureLayer()

    this._sketchPoint = null
  }

  _handleMouseMove (event) {
    this._updateSketchPoint(event)
  }

  _updateSketchPoint (event) {
    const coordinates = event.coordinates.slice()
    if (this._sketchPoint === null) {
      var geom = new Point(coordinates[0], coordinates[1])
      this._sketchPoint = new Feature(geom)
      this._updateSketchFeatures()
    } else {
      var sketchPointgeom = this._sketchPoint.geometry
      sketchPointgeom.update(coordinates[0], coordinates[1])
      this.changed()
    }
  }

  _updateSketchFeatures () {
    const features = []

    if (this._sketchPoint) {
      features.push(this._sketchPoint)
    }

    // 触发workspace的绘制
    this._sketchLayer.clear()
    this._sketchLayer.addFeatures(features)
  }
  
  _updateState () {
    const ws = this.workspace
    const active = this.active
    if (!ws || !active) {
    }
  
    this._sketchLayer.workspace = active ? ws : null
  }
}
