/**
 * Created by zhangyong on 2017/5/25.
 */

import Component from './Component'

import BrowserEvent from '../meek/BrowserEvent'
import Geometry from '../geometry/Geometry'
import Point from '../geometry/Point'

import {listen, unlistenByKey} from '../core/EventManager'
import {EventType} from '../meek/EventType'

import ModifyEvent from './ModifyEvent'

import Feature from '../meek/Feature'
import FeatureLayer from '../lyr/FeatureLayer'
import {Style} from '../style/Style'
import {ExtentUtil} from '../geometry/support/ExtentUtil'

import {closestOnSegment, squaredDistanceToSegment,
        squaredDistance, distance} from '../geometry/support/GeometryUtil'

import {noModifierKeys, singleClick} from '../utils/MouseKey'

/**
 *
 */
export default class ModifyCpt extends Component {
  
  constructor(options = {}) {
    super(options)
    
    this.applyHandleEventOption({
      handleDownEvent: this._handleDownEvent,
      handleDragEvent: this._handleDragEvent,
      handleUpEvent: this._handleUpEvent
    })
  
    /**
     * The features array is to modify
     * @type {Array}
     * @private
     */
    this._features = []
    
    /**
     *
     * @type {number}
     * @private
     */
    this._pixelTolerance = options.pixelTolerance ?
        options.pixelTolerance : 10
  
    /**
     *
     * @type {[*]}
     * @private
     */
    this._movableGeometrys = options.movableGeometrys ?
        options.movableGeometrys : ['extent']
  
  
    /**
     *
     * @type {boolean}
     * @private
     */
    this._hasMoveableGeometrys = true
    
    const movableGeometrys = this._movableGeometrys
    if (movableGeometrys === null || movableGeometrys === undefined) {
      this._hasMoveableGeometrys = false
    }
  
    if (Array.isArray(movableGeometrys)) {
      if (movableGeometrys.length === 0) {
        this._hasMoveableGeometrys = false
      }
    }
  
    /**
     *
     * @type {Set}
     * @private
     */
    this.movableGeometrySet
    
    if (this._hasMoveableGeometrys) {
      this.movableGeometrySet = new Set(this._movableGeometrys)
    }
  
    /**
     * @private
     */
    this._deleteCondition = options.deleteCondition ?
      options.deleteCondition : this._defaultDeleteCondition
    
    /**
     * Determine if should snap to vertexs of gemetry
     * @type {boolean}
     * @private
     */
    this._snappedToVertex = false
  
    /**
     *
     * @type {null}
     * @private
     */
    this._vertexSegments = null
  
    /**
     *
     * @type {null}
     * @private
     */
    this._snapSegments = null
  
    /**
     *
     * @type {null}
     * @private
     */
    this._vertexFeature = null
  
    /**
     * The features
     * @type {*}
     */
    this.features = options.features || []
  
    /**
     *
     * @type {[*]}
     * @private
     */
    this._lastPixel = [0, 0]
  
  
    /**
     * The over layer is resonsible for modified features highlight
     * @type {FeatureLayer}
     * @private
     */
    this._overLayer = new FeatureLayer({
      style: options.style ? options.style : this.getDefaultStyleFunction(),
      zIndex: 1000
    })
  
    this.active = true
  
    
    this._dragSegments = []
  
    /**
     *
     * @type {boolean}
     * @private
     */
    this._modified = false
  
    /**
     *
     * @type {boolean}
     * @private
     */
    this._changingFeature = true
  
    /**
     * Tracks if the next `singleclick` event should be ignored to prevent
     * accidental deletion right after vertex creation.
     * @type {boolean}
     * @private
     */
    this._ignoreNextSingleClick = false
  
    /**
     *
     * @type {boolean}
     * @private
     */
    this._shouldAddToVertexs = false
  
    /**
     *
     * @type {Array}
     * @private
     */
    this._insertVertices = []
  
    /**
     * Keep the mouse-down point
     * @type {null}
     * @private
     */
    this._downPoint = null
  
    /**
     * Keep the current moved geometry
     * @type {null}
     * @private
     */
    this._currentMovedGeometry = null
  }
  
  /**
   * Features getter and setter
   * @returns {null|*}
   */
  get features () { return this._features }
  set features (value = []) {
    this._features = value
    this._vertexSegments = null
    this._snapSegments = null
  
    if (this._vertexFeature) {
      this._overLayer.removeFeature(this._vertexFeature)
      this._vertexFeature = null
    }
    
    this._hasMoveableGeometrys =
      value.length === 0 ? false : true
    
    this._dragSegments = []
    this._snappedToVertex = false
  }
  
  /**
   * Handle the mouse events emitted from map.
   * @param browserEvent
   * @returns {boolean}
   */
  handleMouseEvent (browserEvent) {
    if (!(browserEvent instanceof BrowserEvent)) {
      return true
    }
  
    browserEvent.coordinate = this.coordinateBeyond(browserEvent.coordinate)
    
    this.lastPointerEvent_ = browserEvent
  
    let handled
    if ( browserEvent.type == BrowserEvent.MOUSE_MOVE &&
      !this.handlingDownUpSequence) {
      this._handlePointerMove(browserEvent)
    }
    if (this._vertexFeature && this._deleteCondition(browserEvent)) {
      if (browserEvent.type !== BrowserEvent.SINGLE_CLICK ||
        !this._ignoreNextSingleClick) {
        handled = this.removePoint()
      } else {
        handled = true
      }
    }
  
    if (browserEvent.type == BrowserEvent.SINGLE_CLICK) {
      this._ignoreNextSingleClick = false
    }
  
    return super.handleMouseEvent(browserEvent) && !handled
  }
  
  /**
   * Removes the vertex currently being pointed.
   * @return {boolean} True when a vertex was removed.
   * @api
   */
  removePoint () {
    if (this._lastPointerEvent && this._lastPointerEvent.type != BrowserEvent.MOUSE_DRAG) {
      let evt = this.lastPointerEvent_
      this.willModifyFeatures_(evt)
      this._removeVertex()
      
      this.dispatchEvent(new ModifyEvent(
        ModifyEvent.EventType.MODIFY_END, this.features, evt))
      this._modified = false
      return true
    }
    
    return false
  }
  
  /**
   *
   * @param a
   * @param b
   * @returns {number}
   * @private
   */
  _compareIndexes (a, b) {
    return a.index - b.index
  }
  
  /**
   *
   * @param event
   * @private
   */
  _willModifyFeatures (event) {
    if (!this._modified) {
      this._modified = true
      this.dispatchEvent(new ModifyEvent(ModifyEvent.EventType.MODIFY_START,
        this.features, event))
    }
  }
  
  /**
   * Handle poiner mouse down event
   * @param evt
   * @private
   */
  _handleDownEvent (evt) {
    this._downPoint = evt.coordinate
    this._dragSegments.length = 0
    this._modified = false
    const coordinate = evt.coordinate
    const vertexFeature = this._vertexFeature
    
    if (vertexFeature) {
      const geometry = vertexFeature.geometry
      const vertex = geometry.getCoordinates()
      const insertVertices = [this._snapSegments]
      if (insertVertices.length) {
        this._willModifyFeatures(evt)
      }
  
      this._shouldAddToVertexs = true
      this._insertVertices = insertVertices
  
      return !!this._vertexFeature
    }
    // Move the selected geometry
    else {
      
      if (!this._hasMoveableGeometrys) {
        return
      }
      
      const filters = this.features.filter(feature => {
        const geometry = feature.geometry
        return this.movableGeometrySet.has(geometry.geometryType) &&
               geometry.containsXY(coordinate[0], coordinate[1])
      })
      
      // We get the first filter geometry to move
      // Otherwise, you should reselect
      if (filters.length > 0) {
        this._currentMovedGeometry = filters[0]
        return true
      }
      
      return false
    }
    
  }
  
  /**
   * Handle pointer move event
   * @param evt
   * @private
   */
  _handlePointerMove (evt) {
    this._lastPixel = evt.pixel
    this._handlePointerAtPixel(evt.pixel, evt.map)
  }
  
  
  /**
   *
   * @param pixel
   * @param map
   * @private
   */
  _handlePointerAtPixel (pixel, map) {
    const pixelCoordinate = map.getCoordinateFromPixel(pixel)
    
    const sortByDistance = (s1, s2) => {
      const d1 = this._pointDistanceToSegment(pixelCoordinate, s1)
      const d2 = this._pointDistanceToSegment(pixelCoordinate, s2)
      return d1 - d2
    }
  
    this._snapSegments = null
    
    if (this.features.length === 0) {
      return
    }
    
    const nodes = this._getInExtent(this.features, pixelCoordinate, this._pixelTolerance)
    if (nodes.length > 0) {
      nodes.sort(sortByDistance)
      const node = nodes[0]
      const closestSegment = node.segment
      let vertex = this._closestOnSegment(pixelCoordinate, node)
      const vertexPixel = map.getPixelFromCoordinate(vertex)
      
      let dist = distance(pixel, vertexPixel)
      if (dist <= this._pixelTolerance) {
        const vertexSegments = {}
  
        this._snapSegments = node
  
        if (node.geometry.geometryType === Geometry.CIRCLE &&
          node.index === ModifyCpt.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX) {
          this._snappedToVertex = true
          this._createOrUpdateVertexFeature(vertex)
        } else {
          const pixel1 = map.getPixelFromCoordinate(closestSegment[0])
          const pixel2 = map.getPixelFromCoordinate(closestSegment[1])
          const squaredDist1 = squaredDistance(vertexPixel[0], vertexPixel[1], pixel1[0], pixel1[1])
          const squaredDist2 = squaredDistance(vertexPixel[0], vertexPixel[1], pixel2[0], pixel2[1])
          dist = Math.sqrt(Math.min(squaredDist1, squaredDist2))
          this._snappedToVertex = dist <= this._pixelTolerance
          // vertex snapping otherwise edge snapping
          if (this._snappedToVertex) {
            vertex = squaredDist1 > squaredDist2 ?
                     closestSegment[1] : closestSegment[0]
            
            this._snapSegments.index = node.geometry.getCoordinateIndex(vertex)
            this._snapSegments.isVertex = true
          }
          
          // draw the snapping point
          this._createOrUpdateVertexFeature(vertex)
        }
  
        this._vertexSegments = vertexSegments
        return
      }
    }
    
    if (this._vertexFeature) {
      this._overLayer.removeFeature(this._vertexFeature)
      this._vertexFeature = null
    }
    
  }
  
  
  /**
   * Handle mouse drag event.
   * @param evt
   * @private
   */
  _handleDragEvent (evt) {
    this._ignoreNextSingleClick = false
    const vertex = evt.coordinate
  
    if (this._shouldAddToVertexs) {
      const vertexFeature = this._vertexFeature
      const geometry = vertexFeature.geometry
      const vertex = geometry.getCoordinates()
    
      const insertVertices = this._insertVertices
      for (let j = insertVertices.length - 1; j >= 0; --j) {
        this._insertVertex(insertVertices[j], vertex)
      }
    
      this._shouldAddToVertexs = false
    }
    
    const dragSegments = this._dragSegments
    const len = dragSegments.length
    
    // move the edge of selected geometry
    if (len !== 0) {
      this._willModifyFeatures(evt)
      
      for (let i = 0; i < len; ++i) {
        const dragSegment = dragSegments[i]
        const segmentData = dragSegment[0]
        const depth = segmentData.depth
        const geometry = segmentData.geometry
        let coordinates = null
        const segment = segmentData.segment
        const index = dragSegment.index
        
        switch (geometry.geometryType) {
        case Geometry.POINT:
          coordinates = vertex
          segment[0] = segment[1] = vertex
          break
        case Geometry.MULTI_POINT:
          coordinates = geometry.getCoordinates()
          coordinates[segmentData.index] = vertex
          segment[0] = segment[1] = vertex
          break
        case Geometry.LINE:
          coordinates = geometry.getCoordinates()
          coordinates[segmentData.index] = vertex
          // segment[index] = vertex
          break
        case Geometry.MULTI_LINE:
          coordinates = geometry.getCoordinates()
          coordinates[depth[0]][segmentData.index + index] = vertex
          segment[index] = vertex
          break
        case Geometry.POLYGON:
          coordinates = geometry.getCoordinates()
          coordinates[segmentData.index] = vertex
          if (segmentData.index === 0) {
            coordinates[coordinates.length - 1] = vertex
          }
          break
        case Geometry.EXTENT:
          coordinates = ExtentUtil.updateExtent(geometry, vertex, dragSegment)
          break
        case Geometry.MULTI_POLYGON:
          coordinates = geometry.getCoordinates()
          coordinates[depth[1]][depth[0]][segmentData.index + index] = vertex
          segment[index] = vertex
          break
        case Geometry.CIRCLE:
          segment[0] = segment[1] = vertex
          if (segmentData.index === ModifyCpt.MODIFY_SEGMENT_CIRCLE_CENTER_INDEX) {
            this._changingFeature = true
            geometry.setCenter(vertex)
            this._changingFeature = false
          } else { // We're dragging the circle's circumference:
            this._changingFeature = true
            geometry.setRadius(distance(geometry.getCenter(), vertex))
            this._changingFeature = false
          }
          break
        default:
          // pass
        }
        
        if (coordinates) {
          this._setGeometryCoordinates(geometry, coordinates)
        }
      }
      
      this._createOrUpdateVertexFeature(vertex)
    }
    // move the whole selected geometry
    else if (this._currentMovedGeometry) {
      const downPoint = this._downPoint
      const dx = vertex[0] - downPoint[0]
      const dy = vertex[1] - downPoint[1]
      
      this._currentMovedGeometry.geometry.move(dx, dy, {
        beyond: {
          xmin: 0,
          ymin: 0,
          xmax: this.map.view.dataExtent[2],
          ymax: this.map.view.dataExtent[3]
        }
      })
      
      this.changed()
      this._downPoint = vertex
    }
  }
  
  /**
   *
   * @param evt
   * @returns {boolean}
   * @private
   */
  _handleUpEvent (evt) {
    this._dragSegments.length = 0
    this._shouldAddToVertexs = false
    this._insertVertices = []
  
    if (this._vertexFeature) {
      this._overLayer.removeFeature(this._vertexFeature)
      this._vertexFeature = null
    }
    
    this._downPoint = null
    this._currentMovedGeometry = null
    
    if (this._modified) {
      this.dispatchEvent(new ModifyEvent(ModifyEvent.MODIFY_END, this.features, evt))
      this._modified = false
    }
    
    return false
  }
  
  /**
   *
   * @param segmentData
   * @param vertex
   * @private
   */
  _insertVertex (segmentData, vertex) {
    const segment = segmentData.segment
    const feature = segmentData.feature
    const geometry = segmentData.geometry
    const depth = segmentData.depth
    const isVertex = segmentData.isVertex
    let index =  segmentData.index
    // let dragIndex = -1
    let coordinates
    
    // while (vertex.length < geometry.getStride()) {
    //   vertex.push(0)
    // }
    
    switch (geometry.geometryType) {
    case Geometry.MULTI_LINE:
      coordinates = geometry.getCoordinates()
      coordinates[depth[0]].splice(index + 1, 0, vertex)
      break
    case Geometry.POLYGON:
      coordinates = geometry.getCoordinates()
      if (!isVertex) {
        coordinates.splice(index + 1, 0, vertex)
        index = index + 1
      } else {
        // dragIndex = index
      }
      break
    case Geometry.MULTI_POLYGON:
      coordinates = geometry.getCoordinates()
      coordinates[depth[1]][depth[0]].splice(index + 1, 0, vertex)
      break
    case Geometry.LINE:
      coordinates = geometry.getCoordinates()
      if (!isVertex) {
        coordinates.splice(index + 1, 0, vertex)
        index = index + 1
      } else {
        // dragIndex = index
      }
      break
    case Geometry.POINT:
      coordinates = geometry.getCoordinates()
      coordinates = vertex
      break
    case Geometry.EXTENT:
      coordinates = geometry.getCoordinates()
      break
    default:
      return
    }
    
    this._setGeometryCoordinates(geometry, coordinates)
    
    // const rTree = this.rBush_
    // rTree.remove(segmentData)
    // this.updateSegmentIndices_(geometry, index, depth, 1)
    const newSegmentData = {
      segment: [segment[0], vertex],
      feature: feature,
      geometry: geometry,
      depth: depth,
      index: index,
      isVertex: isVertex
    }
    
    // rTree.insert(ol.extent.boundingExtent(newSegmentData.segment), newSegmentData)
    this._dragSegments.push([newSegmentData, 1])
    
    // const newSegmentData2 = /** @type {ol.ModifySegmentDataType} */ ({
    //   segment: [vertex, segment[1]],
    //   feature: feature,
    //   geometry: geometry,
    //   depth: depth,
    //   index: index + 1
    // })
    
    // rTree.insert(ol.extent.boundingExtent(newSegmentData2.segment), newSegmentData2)
    
    // this._dragSegments.push([newSegmentData2, 0])
    this._ignoreNextSingleClick = true
  }
  
  /**
   * Calcalute geometrys within the current extent
   * TODO 将来需要优化计算视图范围内的图形
   * @param geometry
   * @param pixelCoordinate
   * @param tolarance
   * @returns {Array}
   * @private
   */
  _getInExtent (features, pixelCoordinate, tolarance) {
    let result = []
    const _ExtentUtil = ExtentUtil
  
    // loop the passed features
    features.forEach( feature => {
      const geometry = feature.geometry
      
      // build an extent from the passed geometry with tolarance
      const gometryExtent = geometry.extent
      const bufferExtent = _ExtentUtil.buffer([gometryExtent.xmin, gometryExtent.ymin,
        gometryExtent.xmax, gometryExtent.ymax], tolarance)
  
      // Exclude the moved point
      if (_ExtentUtil.containsPoint(bufferExtent, pixelCoordinate)) {
        
        // Calculte if the moved point has insected a geometry
        const geometryType = geometry.geometryType
        
        if (geometryType === Geometry.POINT) {
          const points = geometry.getCoordinates()
          const dist = distance(points, pixelCoordinate)
          if (dist <= tolarance) {
            result.push({
              geometry: geometry,
              segment: [points, points],
              index: 0
            })
          }
        } else if (geometryType === Geometry.POLYGON ||
          geometryType === Geometry.EXTENT ||
          geometryType === Geometry.LINE) {
    
          let coordinates = geometry.getCoordinates()
          
          for (let j = 0, jj = coordinates.length - 1; j < jj; j++) {
            let points = coordinates[j]
            let nextPoints = coordinates[j + 1]
      
            let pathExtent = _ExtentUtil.boundingExtentFromTwoPoints(points, nextPoints)
            let pathBufferExtent = _ExtentUtil.buffer(pathExtent, tolarance)
      
            if (ExtentUtil.containsPoint(pathBufferExtent, pixelCoordinate)) {
              const segment = [points, nextPoints]
              result.push({
                geometry: geometry,
                segment: segment,
                index: j
              })
            }
          }
        }
      }
    })
    
    return result
  }
  
  /**
   *
   * @param geometry
   * @param coordinates
   * @private
   */
  _setGeometryCoordinates (geometry, coordinates) {
    this._changingFeature = true
    geometry.setCoordinates(coordinates)
    this._changingFeature = false
  }
  
  /**
   *
   * @param coordinates
   * @param segmentData
   * @returns {number}
   * @private
   */
  _pointDistanceToSegment (coordinates, segmentData) {
    const geometry = segmentData.geometry
    
    if (geometry.geometryType === Geometry.CIRCLE) {
      const circleGeometry = geometry
      
      if (segmentData.index === ModifyCpt.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX) {
        const distanceToCenterSquared =
          squaredDistance(circleGeometry.getCenter(), coordinates)
        const distanceToCircumference =
          Math.sqrt(distanceToCenterSquared) - circleGeometry.getRadius()
        return distanceToCircumference * distanceToCircumference
      }
    }
    
    
    return squaredDistanceToSegment(coordinates, segmentData.segment)
  }
  
  /**
   *
   * @param coordinate
   * @param segmentData
   * @returns {*}
   * @private
   */
  _closestOnSegment (coordinate, segmentData) {
    // const geometry = segmentData.geometry
    return closestOnSegment(coordinate, segmentData.segment)
  }
  
  // _updateSegmentIndices(
  //   geometry, index, depth, delta) {
  //   this.rBush_.forEachInExtent(geometry.getExtent(), function(segmentDataMatch) {
  //     if (segmentDataMatch.geometry === geometry &&
  //       (depth === undefined || segmentDataMatch.depth === undefined ||
  //       ol.array.equals(segmentDataMatch.depth, depth)) &&
  //       segmentDataMatch.index > index) {
  //       segmentDataMatch.index += delta;
  //     }
  //   });
  // };
  
  /**
   * Create or update the vertex feature while snapping a point
   * on the edge of geometry
   * @param point
   * @private
   */
  _createOrUpdateVertexFeature (point) {
    let vertexFeature = this._vertexFeature
    if (!vertexFeature) {
      vertexFeature = new Feature(new Point(point[0], point[1]))
      this._vertexFeature = vertexFeature
      this._overLayer.addFeature(vertexFeature)
    } else {
      const geom = vertexFeature.geometry
      geom.update(point[0], point[1])
      this._overLayer.changed()
    }
  }
  
  /**
   * Get the default geometry style
   * @returns {Function}
   */
  getDefaultStyleFunction () {
    const style = Style.createDefaultEditing()
    return function () {
      return style[Geometry.POINT]
    }
  }
  
  /**
   *
   * @param mapBrowserEvent
   * @returns {*}
   * @private
   */
  _defaultDeleteCondition (mapBrowserEvent) {
    return noModifierKeys(mapBrowserEvent) &&
           singleClick(mapBrowserEvent)
  }
  
  /**
   *
   * @returns {*}
   */
  get active () { return this._active }
  set active (isActive) {
    if (this._vertexFeature && !isActive) {
      this._overLayer.removeFeature(this._vertexFeature)
      this._vertexFeature = null
    }
    
    this._active = isActive
  }
  
  /**
   *
   * @returns {*}
   */
  get map () {return this._map}
  set map (map) {
    if (this._mapRenderKey) {
      unlistenByKey(this._mapRenderKey)
      this._mapRenderKey = null
    }
  
    if (map) {
      this._map = map
      this._mapRenderKey = listen(this, EventType.CHANGE, map.render, map)
    }
    
    this._overLayer.map = map
  }
}

/**
 *
 * @type {number}
 */
ModifyCpt.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX = 1

/**
 *
 * @type {number}
 */
ModifyCpt.MODIFY_SEGMENT_CIRCLE_CENTER_INDEX = 0