/**
 * Created by zypc on 2016/11/15.
 */

import Component from './component'
import {Style} from '../style/style'
import FeaureLayer from '../lyr/featurelayer'
import Feature from '../meek/feature'
import Geometry from '../geometry/geometry'
import Point from '../geometry/point'
import Line from '../geometry/line'
import Polygon from '../geometry/polygon'
import MultiPolygon from '../geometry/mutilpolygon'
import Extent from '../geometry/extent'
import {ExtentUtil} from '../geometry/support/extentutil'
import {listen, unlistenByKey} from '../core/eventmanager'
import BrowserEvent from '../meek/browserevent'
import DrawEvent from './drawevent'

/**
 * 图形绘制工具基础类
 *
 * @class Draw
 * @extends Component
 * @module component
 * @constructor
 * @example
 *
 *      // 实例化绘图工具
 *      var drawTool = new Datatang.Draw({
 *        type: 'point',
 *        drawLayer: new Datatang.FeatureLayer()
 *      })
 *
 */
export default class Draw extends Component {
  
  /**
   * 构造函数
   *
   * @constructor constructor
   * @param options
   */
  constructor (options = {}) {
    super()
  
    this.applyHandleEventOption({
      handleDownEvent: this._handleDownEvent,
      handleMouseEvent: this.handleMouseEvent,
      handleUpEvent: this._handleUpEvent
    })
    
    /**
     * mapRenderKey
     * @type {null}
     * @private
     */
    this._mapRenderKey = null
    
    /**
     * 绘制作用图层;
     * 需要给绘制工具一个绘制的图层
     *
     * @property drawLayer
     * @type {null}
     * @private
     */
    this._drawLayer = options.drawLayer ? options.drawLayer : null
  
    /**
     * 鼠标按下时的坐标点
     *
     * @property downPointPx
     * @type {null}
     * @private
     */
    this._downPointPx = null
  
    /**
     * 图形绘制结束条件
     *
     * @property finishCoordinate
     * @type {null}
     * @private
     */
    this._finishCoordinate = null
  
    /**
     * 当前的绘图模式(点、线、多边形、矩形)
     *
     * @property drawMode
     * @type {*}
     */
    this.drawMode = Draw.getDrawMode(options.type)
  
    /**
     * 绘制多边形、线段时的临时坐标数据
     *
     * @property sketchCoords
     * @type
     * @private
     */
    this._sketchCoords = null
  
    /**
     * 绘制多边的临时线段
     *
     * @property sketchLine
     * @type {null}
     * @private
     */
    this._sketchLine = null
  
    /**
     * 绘制完成时的结束条件
     *
     * @property finishCondition
     * @type {null}
     * @private
     *
     */
    this._finishCondition = options.finishCondition ?
        options.finishCondition : function () { return true }
        
    /**
     * 撤销条件
     *
     * @property undoCondition
     * @type {Function}
     * @private
     */
    this._undoCondition = options.undoCondition ?
        options.undoCondition : function () { return true }
        
    // add keyboard events
    if (options.undoCondition || options.finishCondition) {
      listen(document, 'keyup',
        this._handleKeyboardEvent, this)
    }
  
    /**
     * 初始化草稿图层，用于临时显示绘制的图形
     *
     * @property sketchLayer
     * @type {Object} featurelayer
     * @private
     */
    this._sketchLayer = new FeaureLayer({name: 'sketch layer for draw component'})

    /**
     * 获取默认绘制渲染样式
     *
     * @property sketchLayer
     * @private
     * @type {Function}
     */
    this._sketchLayer.style = this.getDefaultStyleFunction()
  
    /**
     * 临时点
     *
     * @property sketchPoint
     * @type {null}
     * @private
     */
    this._sketchPoint = null
  
    /**
     * 临时Feature
     *
     * @property sketchFeature
     * @type {null}
     * @private
     */
    this._sketchFeature = null
  
    /**
     * 通过geometry的类型去构建一个geometry
     *
     * @property eometryFunction
     * @type {null}
     * @private
     */
    // The function that can build a geometry by the passed geometry type.
    this._geometryFunction = null
  
    /**
     * 临时的线段坐标数据
     *
     * @property sketchLineCoords
     * @type {null}
     * @private
     */
    this._sketchLineCoords = null
  
    /**
     * freehand
     * @type {Boolean}
     * @private
     */
    this._freehand = false
  
    /**
     * 公差像素距离
     *
     * @property snapTolerance
     * @type {Number}
     * @private
     */
    this._snapTolerance = options.snapTolerance ?
        options.snapTolerance : 2
  
    /**
     * 绘制线段时的最多点限制，默认没有限制
     *
     * @property maxLinePoints
     * @type {Number}
     * @private
     */
    this._maxLinePoints = options.maxLinePoints ?
        options.maxLinePoints : Infinity

    /**
     * 绘制多边形时的顶点限制，默认没有限制
     *
     * @property maxPolygonPoints
     * @type {Number}
     * @private
     */
    this._maxPolygonPoints = options.maxPolygonPoints ?
      options.maxPolygonPoints : Infinity
  
    /**
     * 绘制线段的最少点为2，多边形为3
     *
     * @property minPoints
     * @type {Number}
     * @private
     */
    this._minPoints = options.minPoints ?
      options.minPoints :
      (this.drawMode === Draw.DrawMode.POLYGON ? 3 : 2)
  
    /**
     * freehandCondition
     * @private
     * @type
     */
    this._freehandCondition = options.freehandCondition ?
      options.freehandCondition : function () { return true }
      
  }
  
  /**
   * 处理绘制结束事件
   *
   * handleKeyboardEvent
   * @type {Function}
   * @param event {event}
   * @private
   */
  _handleKeyboardEvent (event) {
    
    // If finish drawing

    if (this._finishCondition(event)) {

      /**
       * 判断多边形的顶点是否小于4个（正常多边形3个顶点，首尾相接多一个顶点），小于4个不是多边形，return
       */
      if (this.drawMode === Draw.DrawMode.POLYGON) {
        if( this._sketchFeature === null) {
          return
        }
        let pcoordinates = this._sketchFeature.geometry.getCoordinates()
        if (pcoordinates[0].length < 4) {
          return
        }
      }

      /**
       * 判断线的顶点是否小于2个，小于2个不是线段，return
       */
      if (this.drawMode === Draw.DrawMode.LINE) {
        if( this._sketchFeature === null) {
          return
        }
        let pcoordinates = this._sketchFeature.geometry.getCoordinates()
        if (pcoordinates.length <= 2) {
          return
        }
      }
      
      this._finishDrawing()
    }
    
    // If undo drawing
    if (this._undoCondition(event)) {
      this._undoDrawing()
    }
  }
  
  /**
   * 获取图形创建、修改的工厂方法
   *
   * @property geometryFunction
   * @type {Function}
   * @retruns geometryFunction {Function}
   */
  get geometryFunction () {
    if(!this._geometryFunction){
      this._geometryFunction = this._initGeometryFunction()
    }
    
    return this._geometryFunction
  }
  
  /**
   * drawMode读写器，
   * 设置当前绘图的模式，重新赋值将会启动新图形类型的绘制
   *
   * @type {Function}
   * @property drawMode
   * @type {Datatang.Draw.DrawMode}
   */
  get drawMode () { return this._drawMode }
  set drawMode (value){

    this.active = this._existInDrawMode(value) ? true : false

    this._drawMode = value
    
    this._sketchLineCoords = null
    this._abortDrawing()
  
    this._minPoints = this._drawMode === Draw.DrawMode.POLYGON ? 3 : 2
  }

  /**
   * 判断传入的绘制类型是否在绘制列表中
   *
   * @method existInDrawMode
   * @param value {String}
   * @returns {Boolean}
   * @private
   */
  _existInDrawMode (value){
    const drawMode = Draw.DrawMode
    const modeValue = value.toUpperCase()

    for(let val in drawMode){
      if(modeValue === drawMode[val].toUpperCase()){
        return  true
      }
    }

    return false
  }

  /**
   * 图形生产工厂方法
   *
   * @method geometryFactory
   * @returns {Object} 返回一个geometry对象
   * @private
   */
  _geometryFactory () {
    let Constructor
    let mode = this.drawMode
  
    if (mode === Draw.DrawMode.POINT) {
      Constructor = Point
    } else if (mode === Draw.DrawMode.LINE) {
      Constructor = Line
    } else if(mode === Draw.DrawMode.POLYGON) {
      Constructor = Polygon
    } else if (mode === Draw.DrawMode.EXTENT) {
      Constructor = Extent
    }
    
    return Constructor
  }
  
  /**
   * 设置缺省 geometryfunction
   *
   * @method initGeometryFunction
   * @returns {Function} Geometry
   * @private
   */
  _initGeometryFunction () {
    const geometryFunction = (coordinates, opt_geometry) => {
      let mode = this.drawMode
      let geometry = opt_geometry
      
      if (geometry) {
        if (mode === Draw.DrawMode.POLYGON) {
          geometry.setCoordinates(coordinates)
        } else if(mode === Draw.DrawMode.LINE) {
          geometry.setCoordinates(coordinates)
        } else if(mode === Draw.DrawMode.EXTENT) {
          geometry.setCoordinates(ExtentUtil.boundingExtent(coordinates))
        }
      } else {
        let Constructor = this._geometryFactory()
        geometry = new Constructor(coordinates[0],coordinates[1])
      }
      
      return geometry
    }
    
    return geometryFunction
  }
  
  /**
   * 处理鼠标事件
   *
   * handleMouseEvent
   * @param event {event}
   * @returns {*|Boolean}
   */
  handleMouseEvent (event) {
    this.freehand_ = false
    let pass = !this.freehand_
    const eventType = event.type
    
    event.coordinate = this.coordinateBeyond(event.coordinate)
    
    if (this.freehand_ &&
      eventType === BrowserEvent.MOUSE_DRAG && this._sketchFeature !== null) {
      this._addToDrawing(event)
      pass = false
    } else
      
    if (eventType === BrowserEvent.MOUSE_MOVE) {
      pass = this._handleMove(event)
    } else if (eventType === BrowserEvent.DBLCLICK) {
      pass = false
    }
    
    return super.handleMouseEvent(event) && pass
  }
  
  /**
   * 处理移动事件
   *
   * handleMove
   * @param {BrowserEvent} event A move event.
   * @return {boolean} Pass the event to other compoments.
   * @private
   */
  _handleMove (event) {
    if (this._finishCoordinate) {
      this._modifyDrawing(event)
    } else {
      this._updateSketchPoint(event)
    }
    
    return true
  }
  
  /**
   * 鼠标按下时，获取当前坐标点
   *
   * handleDownEvent
   * @param event {BrowserEvent} event A up event.
   * @returns {Boolean}
   * @private
   */
  _handleDownEvent (event) {
    this._downPointPx = event.pixel
    return true
  }
  
  /**
   * 处理鼠标弹起事件
   *
   * handleUpEvent
   * @param event {BrowserEvent} event
   * @private
   */
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
        if (this.drawMode === Draw.DrawMode.POINT) {
          this._finishDrawing()
        }
      } else if (mode === Draw.DrawMode.CIRCLE ) {
        //
        //
      } else if (mode === Draw.DrawMode.EXTENT) {
        this._finishDrawing()
      }
      else if (this._atFinish(event)) {
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
   *
   * @method startDrawing
   * @param event {Event}
   * @private
   */
  _startDrawing (event) {
    const startPoint = event.coordinate
    this._finishCoordinate = startPoint
    
    const _drawMode = this.drawMode
    
    // 构造geometry数据
    if (_drawMode === Draw.DrawMode.POINT) {
      this._sketchCoords = startPoint.slice() // 缓存up的点
    } else if (_drawMode === Draw.DrawMode.POLYGON ) {
      this._sketchCoords = [[startPoint.slice(), startPoint.slice()]]
      this._sketchLineCoords = this._sketchCoords[0]// temp line
    } else {
      this._sketchCoords = [startPoint.slice(),startPoint.slice()] // 缓存up的点，最后一个值，用于move的替换
      
      if (_drawMode === Draw.DrawMode.EXTENT) {
        this._sketchLineCoords = this._sketchCoords
      }
    }
  
    if (this._sketchLineCoords) {
      this._sketchLine = new Feature(new Line(this._sketchLineCoords))
    }
    
    // Build a geometry uesed sketchCorrdds
    const geometry = this.geometryFunction(this._sketchCoords)
    
    this._sketchFeature = new Feature()
    
    this._sketchFeature.geometry = geometry
    
    // Redraw the sketch features
    this._updateSketchFeatures()
    
    // 派发绘制开始事件
    // Trigger the draw-strat event
    this.dispatchEvent(new DrawEvent(DrawEvent.EventType.DRAW_START, this._sketchFeature))
  }
  
  /**
   * Modify the drawing
   *
   * @param event {Event}
   * @private
   */
  _modifyDrawing (event) {
    let coordinate = event.coordinate
    const geometry = this._sketchFeature.geometry
    let coordinates = null, last = null
    const mode = this.drawMode
    
    if (mode === Draw.DrawMode.POINT) {
      last = this._sketchCoords
    } else if (mode === Draw.DrawMode.POLYGON) {
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
    if (mode === Draw.DrawMode.EXTENT) {
      if (!this._sketchLine) {
        this._sketchLine = new Feature(new Line(null))
      }
      
      const rings = geometry.getCoordinates()
      sketchLineGeom = this._sketchLine.geometry
      sketchLineGeom.path = rings
    } else if (this._sketchLineCoords) {
      sketchLineGeom =  (this._sketchLine.geometry)
      sketchLineGeom.path = this._sketchLineCoords
    }
    
    this._updateSketchFeatures()
  }
  
  /**
   * 绘制完成，形成正式feature
   *
   * @method finishDrawing
   * @private
   */
  _finishDrawing () {
    if (this._sketchFeature === null){
      this.dispatchEvent(new DrawEvent(DrawEvent.EventType.DRAW_END))
      return
    }

    const sketchFeature = this._abortDrawing()// 中止绘制，
    const coordinates = this._sketchCoords
    const geometry = (sketchFeature.geometry)
    
    const drawMode = this.drawMode
  
    if (drawMode === Draw.DrawMode.LINE) {
      // remove the redundant last point
      coordinates.pop()
      this.geometryFunction(coordinates, geometry)
    } else if (drawMode === Draw.DrawMode.POLYGON) {
      // When we finish drawing a polygon on the last point,
      // the last coordinate is duplicated as for LineString
      // we force the replacement by the first point
      coordinates[0].pop()
      coordinates[0].push(coordinates[0][0])
      this.geometryFunction(coordinates, geometry)
    }
    
    // 处理复合图形
    if (drawMode === Geometry.MULTI_POINT) {
      // sketchFeature.geometry = new MultiPoint([coordinates]))
    } else if (drawMode === Geometry.MULTI_LINE) {
      // sketchFeature.geometry = new MultiLineString([coordinates])
    } else if (drawMode === Geometry.MULTI_POLYGON) {
      sketchFeature.geometry = new MultiPolygon([coordinates])
    }
  
    // 最终放到shource中，形成正式feature
    if (this._drawLayer) {
      sketchFeature.style = undefined
      this._drawLayer.addFeatures([sketchFeature])
    }
  
    // First dispatch event to allow full set up of feature
    this.dispatchEvent(new DrawEvent(DrawEvent.EventType.DRAW_END, sketchFeature))
  }
  
  /**
   * 终止绘制，不会添加临时feature
   *
   * @method abortDrawing
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
   * Add a new coordinate to the drawing
   *
   * @param event
   * @private
   */
  _addToDrawing (event) {
    const coordinate = event.coordinate
    const geometry = this._sketchFeature.geometry
    let coordinates,done
    const mode = this.drawMode
    
    if (mode === Draw.DrawMode.LINE) {
      this._finishCoordinate = coordinate.slice()
      coordinates = this._sketchCoords
      coordinates.push(coordinate.slice())
      done = coordinates.length > this._maxLinePoints
      
      this.geometryFunction(coordinates, geometry)
    } else if (mode === Draw.DrawMode.POLYGON) {
      coordinates = this._sketchCoords[0]
      coordinates.push(coordinate.slice())
      done = coordinates.length > this._maxPolygonPoints
      
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
   *
   * @param event
   * @returns {Boolean}
   * @private
   */
  _atFinish (event) {
    let at = false
    if (this._sketchFeature) {
      let potentiallyDone = false
      let potentiallyFinishCoordinates = [this._finishCoordinate]
      
      if (this.drawMode === Draw.DrawMode.LINE) {
        potentiallyDone = this._sketchCoords.length > this._minPoints
      } else if (this.drawMode === Draw.DrawMode.POLYGON) {
        potentiallyDone = this._sketchCoords[0].length > this._minPoints
        potentiallyFinishCoordinates = [this._sketchCoords[0][0],
          this._sketchCoords[0][this._sketchCoords[0].length - 2]]
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
  
  /**
   * Create or update the sketch point
   *
   * updateSketchPoint
   * @param event {BrowserEvent} event
   * @private
   */
  _updateSketchPoint (event) {
    let coordinates = event.coordinate

    if (this._sketchPoint === null) {
      const geom = new Point(coordinates[0], coordinates[1])
      this._sketchPoint = new Feature(geom)
      this._updateSketchFeatures()
    } else {
      const sketchPointgeom = this._sketchPoint.geometry
      sketchPointgeom.setCoordinates(coordinates)
    }
  }
  
  /**
   * Redraw the sketch featrues.
   * updateSketchFeatures
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
  
  /**
   * 执行撤销
   *
   * @method undoDrawing
   * @private
   */
  _undoDrawing () {
    const drawMode = this.drawMode
    if (drawMode === Draw.DrawMode.LINE ) {
      if (this._sketchFeature) {
        const coordinates = this._sketchFeature.geometry.getCoordinates()
        if (coordinates.length > 2) {
          
          coordinates.splice(coordinates.length - 2, 1)
          this._sketchFeature.changed()
        }
      }
    } else if (drawMode === Draw.DrawMode.POLYGON) {
      if (this._sketchFeature) {
        
        const pcoordinates = this._sketchFeature.geometry.getCoordinates()[0]
        
        if (pcoordinates.length > 2 ) {
          pcoordinates.splice(pcoordinates.length - 2, 1)
          this._sketchFeature.changed()
        }else {
          this._abortDrawing()
          this._finishDrawing()
        }
      }
    }
  }

  /**
   * map读写器, 读取设置当前map
   *
   * @type {Function}
   * @property map
   * @param mapValue {Object} Datatang.map
   */
  get map (){ return this._map }
  set map (mapValue) {
    if (this._mapRenderKey) {
      unlistenByKey(this._mapRenderKey)
      this._mapRenderKey = null
    }

    if (mapValue) {
      this._map = mapValue
      // this._mapRenderKey = listen(this, EventType.CHANGE, mapValue.render, mapValue)
    }
    
    this._updateState()
  }
  
  /**
   * 更新绘制状态
   *
   * @method updateState
   * @private
   */
  _updateState () {
    const map = this.map
    const active = this.active
    if (!map || !active){
      this._abortDrawing()
    }
  
    this._sketchLayer.map = active ? map : null
  }
  
  /**
   * 获取默认绘制样式
   *
   * @method getDefaultStyleFunction
   * @returns {Function}
   */
  getDefaultStyleFunction () {
    const styles = Style.createDefaultEditing()
    return function (feature) {
      return styles[feature.geometry.geometryType]
    }
  }
  
  /**
   *
   * @returns {boolean}
   */
  shouldStopEvent () {
    return false
  }

  /**
   * 获取当前的Layer
   *
   * @method drawLayer
   * @return {null}
   */
  get drawLayer () { return this._drawLayer }


  /**
   * active读写器, 读取设置当前active
   *
   * @type {Function}
   * @property active
   * @type {Boolean}
   */
  get active () { return this._active }
  set active (value) {
    this._active = value
    if (this._active === false) {
      this._sketchLayer.clear()
      this._sketchPoint = null
    }
  }
  
}

/**
 * 获取当前绘制模式的静态方法
 *
 * @method getDrawMode
 * @param type {String}
 * @returns {Object}
 */
Draw.getDrawMode = function(type) {
  let drawMode = null
  
  switch (type){
  case Geometry.POINT:
  case Geometry.MULTI_POINT:
    drawMode = Draw.DrawMode.POINT
    break
  case Geometry.LINE:
  case Geometry.MULTI_LINE:
    drawMode = Draw.DrawMode.LINE
    break
  case Geometry.POLYGON:
  case Geometry.MULTI_POLYGON:
    drawMode = Draw.DrawMode.POLYGON
    break
  case Geometry.EXTENT:
    drawMode = Draw.DrawMode.EXTENT
    break
  }
  
  return drawMode
}


/**
 * Draw mode.  This collapses multi-part geometry types with their single-part
 * cousins.
 *
 * 绘制模式：点、线、面、矩形(circle暂时不支持)
 * @enum {string}
 */
Draw.DrawMode = {
  POINT: 'Point',
  LINE: 'Line',
  POLYGON: 'Polygon',
  CIRCLE: 'Circle',
  EXTENT: 'Extent'
}