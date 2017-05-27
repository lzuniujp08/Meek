/**
 * Created by zhangyong on 2017/5/25.
 */

import Component from './Component'

import BrowserEvent from '../meek/BrowserEvent'
import Geometry from '../geometry/Geometry'
import Point from '../geometry/Point'
import Line from '../geometry/Line'

import {listen, unlistenByKey} from '../core/EventManager'
import {EventType} from '../meek/EventType'


import Feature from '../meek/Feature'
import FeatureLayer from '../lyr/FeatureLayer'
import {Style} from '../style/Style'
import {ExtentUtil} from '../geometry/support/ExtentUtil'

import {closestOnSegment, squaredDistanceToSegment,
        squaredDistance, distance,
        equals} from '../geometry/support/GeometryUtil'


export default class ModifyCpt extends Component {
  
  
  constructor(options) {
    super()
    
    this._pixelTolerance = options.pixelTolerance ?
        options.pixelTolerance : 10
    
    /**
     * Determine if should snap to vertexs of gemetry
     * @type {boolean}
     * @private
     */
    this._snappedToVertex = false
  
    
    this._vertexSegments = null
    
    this._snapSegments = null
  
  
    this._vertexFeature = null
    
    
    this._features = null
  
    this.features = options.features
  
  
    this._lastPixel = [0, 0]
  
  
    this._overLayer = new FeatureLayer({
      style: options.style ? options.style : this.getDefaultStyleFunction()
    })
  
    this.active = true
  
    
    this._dragSegments = []
    
    this._modified = false
  
    this._changingFeature = true
  }
  
  features (value) {
    this._features = value
  
    this._vertexSegments = null
    this._snapSegments = null
    this._vertexFeature = null
    this._dragSegments = []
    this._snappedToVertex = false
  }
  
  handleMouseEvent (browserEvent) {
    if (!(browserEvent instanceof BrowserEvent)) {
      return true
    }
  
    let type = browserEvent.type
    if (type === BrowserEvent.MOUSE_MOVE) {
      this._handlePointerMove(browserEvent)
    } else if (type === BrowserEvent.MOUSE_DOWN) {
      this._handleDownEvent(browserEvent)
    } else if (type === BrowserEvent.MOUSE_UP) {
      this._handleUpEvent(browserEvent)
    } else if (type === BrowserEvent.MOUSE_DRAG) {
      this._handleDragEvent(browserEvent)
    }
  
  }
  
  _compareIndexes (a, b) {
    return a.index - b.index
  }
  
  _willModifyFeatures (evt) {
    if (!this.modified_) {
      this.modified_ = true
      // this.dispatchEvent(new ol.interaction.Modify.Event(
      //   ol.interaction.ModifyEventType.MODIFYSTART, this.features_, evt))
    }
  }
  
  /**
   * Handle poiner mouse down event
   * @param evt
   * @private
   */
  _handleDownEvent (evt) {
    // this._handlePointerAtPixel(evt.pixel, evt.map)
    // const pixelCoordinate = evt.map.getCoordinateFromPixel(evt.pixel)
    this._dragSegments.length = 0
    this._modified = false
    const vertexFeature = this._vertexFeature
    
    if (vertexFeature) {
      // const insertVertices = []
      const geometry = vertexFeature.geometry
      const vertex = geometry.getCoordinates()
      // const vertexExtent = ExtentUtil.boundingSimpleExtent([[geometry.x, geometry.y]])
      // const segmentDataMatches = this._getInExtent(this.features[0].geometry, vertex, this._pixelTolerance)
      // const componentSegments = {}
      // segmentDataMatches.sort(this._compareIndexes)
  
      // for (let i = 0, ii = segmentDataMatches.length; i < ii; ++i) {
      //   const segmentDataMatch = segmentDataMatches[i]
      //   let segment = segmentDataMatch.segment
      //   let uid = segmentDataMatch.geometry.id
      //   const depth = segmentDataMatch.depth
      //   if (depth) {
      //     uid += '-' + depth.join('-') // separate feature components
      //   }
      //
      //   if (!componentSegments[uid]) {
      //     componentSegments[uid] = new Array(2)
      //   }
      //
      //   if (segmentDataMatch.geometry.geometryType === Geometry.CIRCLE &&
      //       segmentDataMatch.index === ModifyCpt.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX) {
      //
      //     const closestVertex = closestOnSegment(pixelCoordinate, segmentDataMatch)
      //
      //     if (equals(closestVertex, vertex) && !componentSegments[uid][0]) {
      //       this._dragSegments.push([segmentDataMatch, 0])
      //       componentSegments[uid][0] = segmentDataMatch
      //     }
      //   } else if (equals(segment[0], vertex) && !componentSegments[uid][0]) {
      //     this._dragSegments.push([segmentDataMatch, 0])
      //     componentSegments[uid][0] = segmentDataMatch
      //   } else if (equals(segment[1], vertex) && !componentSegments[uid][1]) {
      //
      //     // prevent dragging closed linestrings by the connecting node
      //     if ((segmentDataMatch.geometry.geometryType === Geometry.LINE ||
      //          segmentDataMatch.geometry.geometryType === Geometry.MULTI_LINE) &&
      //          componentSegments[uid][0] &&
      //          componentSegments[uid][0].index === 0) {
      //       continue
      //     }
      //
      //     this._dragSegments.push([segmentDataMatch, 1])
      //     componentSegments[uid][1] = segmentDataMatch
      //   } else if (!componentSegments[uid][0] && !componentSegments[uid][1]) {
      //   // else if (segment.id in this._vertexSegments && (!componentSegments[uid][0] && !componentSegments[uid][1])) {
      //     insertVertices.push([segmentDataMatch, vertex])
      //   }
      // }
  
      const insertVertices = [this._snapSegments]
      if (insertVertices.length) {
        this._willModifyFeatures(evt)
      }
  
      for (let j = insertVertices.length - 1; j >= 0; --j) {
        this._insertVertex(insertVertices[j], vertex)
      }
    }
    
    return !!this._vertexFeature
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
  
  
  
  _handlePointerAtPixel (pixel, map) {
    const pixelCoordinate = map.getCoordinateFromPixel(pixel)
    
    const sortByDistance = (s1, s2) => {
      const d1 = this._pointDistanceToSegment(pixelCoordinate, s1)
      const d2 = this._pointDistanceToSegment(pixelCoordinate, s2)
      return d1 - d2
    }
  
    this._snapSegments = null
    
    const nodes = this._getInExtent(this.features[0].geometry, pixelCoordinate, this._pixelTolerance)
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
          // var segment
          // for (var i = 1, ii = nodes.length; i < ii; ++i) {
          //   segment = nodes[i].segment
          //   if ((equals(closestSegment[0], segment[0]) &&
          //     equals(closestSegment[1], segment[1]) ||
          //     (equals(closestSegment[0], segment[1]) &&
          //     equals(closestSegment[1], segment[0])))) {
          //     vertexSegments[ol.getUid(segment)] = true
          //   } else {
          //     break
          //   }
          // }
        }
  
        // vertexSegments[ol.getUid(closestSegment)] = true
        this._vertexSegments = vertexSegments
        return
      }
      
    }
    
    if (this._vertexFeature) {
      this._overLayer.removeFeature(this._vertexFeature)
      this._vertexFeature = null
    }
    
  }
  
  _handleDragEvent (evt) {
    // this.ignoreNextSingleClick_ = false
    this._willModifyFeatures(evt)
    
    const vertex = evt.coordinate
    for (let i = 0, ii = this._dragSegments.length; i < ii; ++i) {
      const dragSegment = this._dragSegments[i]
      const segmentData = dragSegment[0]
      const depth = segmentData.depth
      const geometry = segmentData.geometry
      let coordinates = null
      const segment = segmentData.segment
      const index = dragSegment.index
      
      // while (vertex.length < geometry.getStride()) {
      //   vertex.push(segment[index][vertex.length])
      // }
      
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
        break
      case Geometry.EXTENT:
        let newCoordinates = ExtentUtil.updateExtent(geometry, vertex, dragSegment)
        coordinates = [newCoordinates]
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
  
  
  _handleUpEvent (evt) {
    let segmentData
    let geometry
  
    this._dragSegments.length = 0
    
    // for (let i = this._dragSegments.length - 1; i >= 0; --i) {
    //   segmentData = this._dragSegments[i][0]
    //   geometry = segmentData.geometry
    //   if (geometry.geometryType === Geometry.CIRCLE) {
    //     // Update a circle object in the R* bush:
    //     const coordinates = geometry.getCenter()
    //     const centerSegmentData = segmentData.featureSegments[0]
    //     const circumferenceSegmentData = segmentData.featureSegments[1]
    //     centerSegmentData.segment[0] = centerSegmentData.segment[1] = coordinates
    //     circumferenceSegmentData.segment[0] = circumferenceSegmentData.segment[1] = coordinates
    //     this.rBush_.update(ol.extent.createOrUpdateFromCoordinate(coordinates), centerSegmentData)
    //     this.rBush_.update(geometry.getExtent(), circumferenceSegmentData)
    //   } else {
    //     this.rBush_.update(ol.extent.boundingExtent(segmentData.segment), segmentData)
    //   }
    // }
    //
    // if (this.modified_) {
    //   this.dispatchEvent(new ol.interaction.Modify.Event(
    //     ol.interaction.ModifyEventType.MODIFYEND, this.features, evt))
    //   this.modified_ = false
    // }
    
    return false
  }
  
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
    // this.ignoreNextSingleClick_ = true
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
  _getInExtent (geometry, pixelCoordinate, tolarance) {
    let result = []
    const _ExtentUtil = ExtentUtil
    
    const gometryExtent = geometry.extent
    const bufferExtent = _ExtentUtil.buffer([gometryExtent.xmin, gometryExtent.ymin,
      gometryExtent.xmax, gometryExtent.ymax], tolarance)
  
    if (!_ExtentUtil.containsPoint(bufferExtent, pixelCoordinate)) {
      return result
    }
    
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
    } else if (geometryType === Geometry.LINE) {
      const path = geometry.path
      
      for (let i = 0, ii = path.length - 1; i < ii; i++) {
        let points = path[i]
        let nextPoints = path[i + 1]
        
        let pathExtent = _ExtentUtil.boundingExtentFromTwoPoints(points, nextPoints)
        let pathBufferExtent = _ExtentUtil.buffer(pathExtent, tolarance)
        
        if (_ExtentUtil.containsPoint(pathBufferExtent, pixelCoordinate)) {
          const segment = [points, nextPoints]
          result.push({
            geometry: geometry,
            segment: segment,
            index: i
          })
        }
      }
    } else if (geometryType === Geometry.POLYGON || geometryType === Geometry.EXTENT) {
      //
      const rings = geometry.rings[0]
  
      for (let j = 0, jj = rings.length - 1; j < jj; j++) {
        let points = rings[j]
        let nextPoints = rings[j + 1]
  
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
    
    return result
  }
  
  _setGeometryCoordinates (geometry, coordinates) {
    this._changingFeature = true
    geometry.setCoordinates(coordinates)
    this._changingFeature = false
  }
  
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
      this.changed()
    }
  }
  
  
  getDefaultStyleFunction () {
    const style = Style.createDefaultEditing()
    return function (feature) {
      return style[Geometry.POINT]
    }
  }
  
  set active (isActive) {
    if (this._vertexFeature && !isActive) {
      // this.overlay_.getSource().removeFeature(this._vertexFeature)
      this._vertexFeature = null
    }
    
    this._active = isActive
  }
  
  get active () { return this._active }
  
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
  
  get map () {return this._map}
  
}


ModifyCpt.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX = 1

ModifyCpt.MODIFY_SEGMENT_CIRCLE_CENTER_INDEX = 0