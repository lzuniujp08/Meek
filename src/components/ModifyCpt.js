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
  squaredDistance, distance} from '../geometry/support/GeometryUtil'


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
  
  
    this._vertexFeature = null
    
    
    this.features = options.features
  
  
    this._lastPixel = [0, 0]
  
  
    this._overLayer = new FeatureLayer({
      style: options.style ? options.style : this.getDefaultStyleFunction()
    })
  
    this.active = true
  }
  
  
  handleMouseEvent (browserEvent) {
    if (!(browserEvent instanceof BrowserEvent)) {
      return true
    }
    
    if (browserEvent.type === BrowserEvent.MOUSE_MOVE) {
      this._handlePointerMove(browserEvent)
    }
  }
  
  
  
  _handlePointerMove (evt) {
    this._lastPixel = evt.pixel
    this._handlePointerAtPixel(evt.pixel, evt.map)
  }
  
  
  
  _handlePointerAtPixel (pixel, map) {
    const pixelCoordinate = map.getCoordinateFromPixel(pixel)
    
    const sortByDistance = function(s1, s2) {
      return this._pointDistanceToSegment(pixelCoordinate, s1) -
             this._pointDistanceToSegment(pixelCoordinate, s2)
    }
    
    const nodes = this._getInExtent(this.features[0].geometry, pixelCoordinate)
    if (nodes.length > 0) {
      nodes.sort((s1, s2) => sortByDistance)
      const node = nodes[0]
      const closestSegment = node.segment
      let vertex = this._closestOnSegment(pixelCoordinate, node)
      const vertexPixel = map.getPixelFromCoordinate(vertex)
      
      let dist = distance(pixel, vertexPixel)
      if (dist <= this._pixelTolerance) {
        const vertexSegments = {}
  
        if (node.geometry.geometryType === Geometry.CIRCLE &&
          node.index === ModifyCpt.MODIFY_SEGMENT_CIRCLE_CIRCUMFERENCE_INDEX) {
          this._snappedToVertex = true
          this._createOrUpdateVertexFeature(vertex)
        } else {
          const pixel1 = map.getPixelFromCoordinate(closestSegment[0])
          const pixel2 = map.getPixelFromCoordinate(closestSegment[1])
          const squaredDist1 = squaredDistance(vertexPixel, pixel1)
          const squaredDist2 = squaredDistance(vertexPixel, pixel2)
          dist = Math.sqrt(Math.min(squaredDist1, squaredDist2))
          this._snappedToVertex = dist <= this._pixelTolerance
          if (this._snappedToVertex) {
            vertex = squaredDist1 > squaredDist2 ?
              closestSegment[1] : closestSegment[0]
          }
          
          this._createOrUpdateVertexFeature(vertex)
          // var segment
          // for (var i = 1, ii = nodes.length; i < ii; ++i) {
          //   segment = nodes[i].segment
          //   if ((ol.coordinate.equals(closestSegment[0], segment[0]) &&
          //     ol.coordinate.equals(closestSegment[1], segment[1]) ||
          //     (ol.coordinate.equals(closestSegment[0], segment[1]) &&
          //     ol.coordinate.equals(closestSegment[1], segment[0])))) {
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
  
  _getInExtent (geometry, pixelCoordinate) {
    let result = []
    
    if (!geometry.extent.containsXY(pixelCoordinate[0], pixelCoordinate[0])) {
      return result
    }
    
    if (geometry.geometryType === Geometry.POINT) {
      //
    } else if (geometry.geometryType === Geometry.LINE) {
      const path = geometry.path
      
      for (let i = 0, ii = path.length - 1; i < ii; i++) {
        let points = path[i]
        let nextPoints = path[i + 1]
        
        let pathExtent = ExtentUtil.boundingExtent([points, nextPoints])
        let minMaxExtent = {
          xmin: pathExtent[0][0],
          ymin: pathExtent[0][1],
          xmax: pathExtent[2][0],
          ymax: pathExtent[2][1]
        }
        
        if (ExtentUtil.containsPoint(minMaxExtent, pixelCoordinate)) {
          const segment = [points, nextPoints]
          result.push({
            geometry: geometry,
            segment: segment,
            index: i
          })
        }
      }
    } else if (geometry.geometryType === Geometry.POLYGON) {
      //
    }
    
    return result
  }
  
  
  _createOrUpdateVertexFeature (point) {
    let vertexFeature = this._vertexFeature
    if (!vertexFeature) {
      vertexFeature = new Feature(new Point(point[0], point[1]))
      this._vertexFeature = vertexFeature
      this._overLayer.addFeatures(vertexFeature)
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