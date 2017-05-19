/**
 * Created by zypc on 2016/11/15.
 */

import Component from './Component'

import {Style} from '../style/Style'

import FeaureLayer from '../lyr/FeatureLayer'
import Feature from '../meek/Feature'
import Geometry from '../geometry/Geometry'
import Point from '../geometry/Point'
import Line from '../geometry/Line'
import Polygon from '../geometry/Polygon'


export default class DrawCpt extends Component {

  constructor (options) {
    super()
  
  
    /**
     * 绘制作用图层
     * 需要给绘制工具一个绘制的图层
     * @type {null}
     * @private
     */
    this._drawLayer = options.drawLayer ? options.drawLayer : null
  
    /**
     *
     * @type {null}
     * @private
     */
    this._downPointPx = null
  
    /**
     * Finish coordinate for the feature ( first point for polygons, last point for line)
     * @type {null}
     * @private
     */
    this._finishCoordinate = null
  
    /**
     * Drawing mode (derivied from geometry type.)
     * @type {*}
     */
    this.drawMode = DrawCpt.getDrawMode(options.type)
  
    /**
     * Sketch coordinates. Used when drawing a line or polygon.
     * @type
     * @private
     */
    this._sketchCoords = null
  
    /**
     * Sketch line. Used when drawing polygon.
     * @private
     */
    this._sketchLine = null
  
    /**
     * A function to decide if a potential finish coordinate is permissable
     * @private
     * @type
     */
    this._finishCondition = options.finishCondition ?
        options.finishCondition : function() {return true}
  
    /**
     * 初始化草稿图层，用于临时显示绘制的图形
     *
     * @type {FeatureLayer}
     * @private
     */
    this._sketchLayer = new FeaureLayer()
    this._sketchLayer.style = this.getDefaultStyleFunction()
  
    /**
     * Sketch point.
     * @type {null}
     * @private
     */
    this._sketchPoint = null
  
    /**
     * Sketch feature drawed on temp layer
     * @type {null}
     * @private
     */
    this._sketchFeature = null
    
    this._geometryFunction = null
  
    /**
     * Sketch line coordinates. Used when drawing a polygon or circle.
     * @private
     */
    this._sketchLineCoords = null
  
    /**
     * @type {boolean}
     * @private
     */
    this._freehand = false
  
    /**
     * Pixel distance for snapping.
     * @type {number}
     * @private
     */
    this._snapTolerance = options.snapTolerance ?
        options.snapTolerance : 12
  
    /**
     * The number of points that can be drawn before a polygon ring or line string
     * is finished. The default is no restriction.
     * @type {number}
     * @private
     */
    this._maxPoints = options.maxPoints ?
        options.maxPoints : Infinity
  
    /**
     * The number of points that must be drawn before a polygon ring or line
     * string can be finished.  The default is 3 for polygon rings and 2 for
     * line strings.
     * @type {number}
     * @private
     */
    this._minPoints = options.minPoints ?
      options.minPoints :
      (this.drawMode === DrawCpt.DrawMode.POLYGON ? 3 : 2)
  
    /**
     * @private
     * @type
     */
    this._freehandCondition = options.freehandCondition ?
      options.freehandCondition : function () { return true }
  }

  get geometryFunction () {
    if(!this._geometryFunction){
      this._geometryFunction = this._initGeometryFunction()
    }
    
    return this._geometryFunction
  }
  
  get drawMode () { return this._drawMode }
  set drawMode (value){
    this._drawMode = value
    this._finishCoordinate = null
    this._sketchCoords = null
  
  }
  
  /**
   * 图形生产工厂方法
   * @returns {*} 返回一个geometry对象
   * @private
   */
  _geometryFactory () {
    let Constructor
    let mode = this.drawMode
  
    if (mode === DrawCpt.DrawMode.POINT) {
      Constructor = Point
    } else if (mode === DrawCpt.DrawMode.LINE) {
      Constructor = Line
    } else if(mode === DrawCpt.DrawMode.POLYGON) {
      Constructor = Polygon
    }
    
    return Constructor
  }
  
  _initGeometryFunction () {
    const geometryFunction = (coordinates, opt_geometry) => {
      let mode = this.drawMode
      let geometry = opt_geometry
      
      if (geometry) {
        if (mode === DrawCpt.DrawMode.POLYGON) {
          geometry.rings = [coordinates[0].concat([coordinates[0][0]])]
        } else if(mode === DrawCpt.DrawMode.LINE) {
          geometry.path = coordinates
        }
      } else {
        let Constructor = this._geometryFactory()
        geometry = new Constructor(coordinates[0],coordinates[1])
      }
      
      return geometry
    }
    
    return geometryFunction
  }
  
  _handleMouseMove (event) {
    if (this._finishCoordinate) {
      this._modifyDrawing(event)
    } else {
      this._updateSketchPoint(event)
    }
  }
  
  _handleDownEvent (event) {
    this._downPointPx = event.pixel
    return true
  }
  
  _handleUpEvent (event) {
    const downPx = this._downPointPx
    const clickPx = event.pixel, mode = this.drawMode
    
    const dx = downPx[0] - clickPx[0]
    const dy = downPx[1] - clickPx[1]
    const clickDistance = dx * dx + dy * dy
    
    if (clickDistance <= 36) {
      if (!this._finishCoordinate) {
        this._startDrawing(event)
  
        // 点绘制在up的时候结束
        if (this.drawMode === DrawCpt.DrawMode.POINT) {
          this._finishDrawing()
        }
      } else if (mode === DrawCpt.DrawMode.CIRCLE ) {
        //
        //
      } else if (this._atFinish(event)) {
        if (this._finishCondition(event)) {
          this._finishDrawing()
        }
      } else {
        this._addToDrawing(event)
      }
    }
  }
  
  /**
   * 启动绘制，生成feature
   * @param event
   * @private
   */
  _startDrawing (event) {
    const startPoint = event.coordinate
    this._finishCoordinate = startPoint
    
    const _drawMode = this.drawMode
    
    // 构造geometry数据
    if (_drawMode === DrawCpt.DrawMode.POINT) {
      this._sketchCoords = startPoint.slice() // 缓存up的点
    } else if (_drawMode === DrawCpt.DrawMode.POLYGON ) {
      this._sketchCoords = [[startPoint.slice(), startPoint.slice()]]
      this._sketchLineCoords = this._sketchCoords[0]
    } else {
      this._sketchCoords = [startPoint.slice(),startPoint.slice()] // 缓存up的点，最后一个值，用于move的替换
      
      if (_drawMode === DrawCpt.DrawMode.CIRCLE) {
        //
      }
    }
  
    if (this._sketchLineCoords) {
      this._sketchLine = new Feature(new Line(this._sketchLineCoords))
    }
    
    const geometry = this.geometryFunction(this._sketchCoords)
    
    this._sketchFeature = new Feature()
    
    this._sketchFeature.geometry = geometry
    
    this._updateSketchFeatures()
    
    // 派发绘制开始事件
    // ...
  }
  
  _finishDrawing () {
    
    const sketchFeature = this._abortDrawing()// 中止绘制，
    const coordinates = this._sketchCoords
    const geometry = (sketchFeature.geometry)
  
    if (this.drawMode === DrawCpt.DrawMode.LINE) {
      // remove the redundant last point
      coordinates.pop()
      this.geometryFunction(coordinates, geometry)
    } else if (this.drawMode === DrawCpt.DrawMode.POLYGON) {
      // When we finish drawing a polygon on the last point,
      // the last coordinate is duplicated as for LineString
      // we force the replacement by the first point
      coordinates[0].pop()
      coordinates[0].push(coordinates[0][0])
      this.geometryFunction(coordinates, geometry)
    }
  
    // First dispatch event to allow full set up of feature
    // this.dispatchEvent(new DrawCpt.DrawEvent(
    //   DrawCpt.DrawEventType.DRAWEND, sketchFeature))
  
    // Then insert feature
    // if (this._features) {
    //   this.features_.push(sketchFeature)
    // }
  
    // 最终放到shource中，形成正式feature
    if (this._drawLayer) {
      let newFeature = new Feature(geometry)
      this._drawLayer.addFeatures([newFeature])
    }
  }
  
  /**
   * Stop drawing without adding the sketch feature to the sketch layer
   * @returns {Feature|null|_Feature2.default}
   * @private
   */
  _abortDrawing () {
    this._finishCoordinate = null
    const sketchFeature = this._sketchFeature
    if (sketchFeature) {
      this._sketchFeature = null
      this._sketchPoint = null
      this._sketchLine = null
      this._sketchLayer.clear()
    }
    
    return sketchFeature
  }
  
  
  /**
   * Modify the drawing
   * @param event
   * @private
   */
  _modifyDrawing (event) {
    let coordinate = event.coordinate
    const geometry = this._sketchFeature.geometry
    let coordinates = null, last = null
    const mode = this.drawMode
    
    if (mode === DrawCpt.DrawMode.POINT) {
      last = this._sketchCoords
    } else if (mode === DrawCpt.DrawMode.POLYGON) {
      coordinates = this._sketchCoords[0]
      last = coordinates[coordinates.length - 1]
      if (this._atFinish(event)) {
        coordinate = this._finishCoordinate.slice()
      }
    } else {
      coordinates = this._sketchCoords // 获取up的点
      last = coordinates[coordinates.length - 1]// 替换为当前MOve的点，形成一条path
    }
    
    last[0] = coordinate[0]
    last[1] = coordinate[1]
    
    // 给 geometry 赋值
    this.geometryFunction(this._sketchCoords, geometry)
    
    // 更新点坐标
    if (this._sketchPoint) {
      const sketchPointGeom = this._sketchPoint.geometry
      sketchPointGeom.update(coordinate[0],coordinate[1])
    }
    
    let sketchLineGeom
    if (geometry instanceof Polygon && mode !== DrawCpt.DrawMode.POLYGON) {
      if (!this.sketchLine_) {
        this.sketchLine_ = new Feature(new Line(null))
      }
      
      const ring = geometry.getLinearRing(0)
      sketchLineGeom = (this._sketchLine.getGeometry())
      sketchLineGeom.setFlatCoordinates(ring.getLayout(), ring.getFlatCoordinates())
    } else if (this._sketchLineCoords) {
      sketchLineGeom =  (this._sketchLine.geometry)
      sketchLineGeom.path = this._sketchLineCoords
    }
    
    this._updateSketchFeatures()
  }
  
  /**
   * Add a new coordinate to the drawing
   * @param event
   * @private
   */
  _addToDrawing (event) {
    const coordinate = event.coordinate
    const geometry = this._sketchFeature.geometry
    let coordinates,done
    const mode = this.drawMode
    
    if (mode === DrawCpt.DrawMode.LINE) {
      this._finishCoordinate = coordinate.slice()
      coordinates = this._sketchCoords
      coordinates.push(coordinate.slice())
      done = coordinates.length > this._maxPoints
      
      this.geometryFunction(coordinates, geometry)
    } else if (mode === DrawCpt.DrawMode.POLYGON) {
      coordinates = this._sketchCoords[0]
      coordinates.push(coordinate.slice())
      done = coordinates.length > this._maxPoints
      
      if (done) {
        this._finishCoordinate = coordinates[0]
      }
      
      this.geometryFunction(this._sketchCoords, geometry)
    }
    
    this._updateSketchFeatures()
    
    if (done) {
      this._finishDrawing()
    }
  }
  
  /**
   * Determine if an event is within the snapping tolerance of the start coord.
   * @param event
   * @returns {boolean}
   * @private
   */
  _atFinish (event) {
    let at = false
    if (this._sketchFeature) {
      let potentiallyDone = false
      let potentiallyFinishCoordinates = [this._finishCoordinate]
      
      if (this.drawMode === DrawCpt.DrawMode.LINE) {
        potentiallyDone = this._sketchCoords.length > this._minPoints
      } else if (this.drawMode === DrawCpt.DrawMode.POLYGON) {
        potentiallyDone = this._sketchCoords[0].length > this._minPoints
        potentiallyFinishCoordinates = [this._sketchCoords[0][0], this._sketchCoords[0][this._sketchCoords[0].length - 2]]
      }
      
      if (potentiallyDone) {
        const map = event.map
        for (let  i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
          const finishCoordinate = potentiallyFinishCoordinates[i]
          const finishPixel = map.getPixelFromCoordinate(finishCoordinate)
          const pixel = event.pixel
          const dx = pixel[0] - finishPixel[0]
          const dy = pixel[1] - finishPixel[1]
          const freehand = this._freehand && this._freehandCondition(event)
          const snapTolerance = freehand ? 1 : this._snapTolerance
          at = Math.sqrt(dx * dx + dy * dy) <= snapTolerance
          if (at) {
            this._finishCoordinate = finishCoordinate
            break
          }
        }
      }
    }
    return at
  }
  
  _updateSketchPoint (event) {
    const coordinates = event.coordinate
    // console.log('更新坐标')
    if (this._sketchPoint === null) {
      const geom = new Point(coordinates[0], coordinates[1])
      this._sketchPoint = new Feature(geom)
      this._updateSketchFeatures()
    } else {
      const sketchPointgeom = this._sketchPoint.geometry
      sketchPointgeom.update(coordinates[0], coordinates[1])
      this.changed()
    }
  }
  
  /**
   * Redraw the sketch featrues.
   * @private
   */
  _updateSketchFeatures () {
    const features = []

    if (this._sketchFeature){
      features.push(this._sketchFeature)
    }
    
    if (this._sketchLine) {
      features.push(this._sketchLine)
    }
    
    if (this._sketchPoint) {
      features.push(this._sketchPoint)
    }
    
    // 出发map的render
    this._sketchLayer.clear()
    this._sketchLayer.addFeatures(features)
  }
  
  _updateState () {
    const map = this.map
    const active = this.active
    if (!map || !active){
      return
    }
  
    this._sketchLayer.map = active ? map : null
  }
  
  getDefaultStyleFunction () {
    const styles = Style.createDefaultEditing()
    return function (feature) {
      return styles[feature.geometry.geometryType]
    }
  }
}

/**
 * The static fucntion is responsibility to get the current draw mode
 * @param type
 * @returns {*}
 */
DrawCpt.getDrawMode = function(type) {
  let drawMode = null
  
  switch (type){
  case Geometry.POINT:
  case Geometry.MULTI_POINT:
    drawMode = DrawCpt.DrawMode.POINT
    break
  case Geometry.LINE:
  case Geometry.MULTI_LINE:
    drawMode = DrawCpt.DrawMode.LINE
    break
  case Geometry.POLYGON:
  case Geometry.MULTI_POLYGON:
    drawMode = DrawCpt.DrawMode.POLYGON
    break
  }
  
  return drawMode
}


/**
 * 定义绘制工具的事件类型
 * @type {{DRAWSTART: string, DRAWEND: string}}
 */
DrawCpt.EventType = {
  /**
   * Triggered upon feature draw start
   * @api stable
   */
  DRAWSTART: 'drawstart',
  
  
  /**
   * Triggered upon feature draw end
   * @api stable
   */
  DRAWEND: 'drawend'
  
}


/**
 * Draw mode.  This collapses multi-part geometry types with their single-part
 * cousins.
 * @enum {string}
 */
DrawCpt.DrawMode = {
  POINT: 'Point',
  LINE: 'LineString',
  POLYGON: 'Polygon',
  CIRCLE: 'Circle'
}