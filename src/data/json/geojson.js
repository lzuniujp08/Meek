/**
 * Created by zhangyong on 2017/7/12.
 */

import Geometry from '../../geometry/geometry'
import Point from '../../geometry/point'
import Polygon from '../../geometry/polygon'
import MutilPolygon from '../../geometry/mutilpolygon'
import Line from '../../geometry/line'
import Extent from '../../geometry/extent'
import Parallelogram from '../../geometry/parallelogram'
import Feature from '../../meek/feature'
import Obj from '../../utils/obj'

/**
 *
 */
export default class GeoJSON {
  
  /**
   * 解析 GeoJSON 并返回 Feature 的集合
   *
   * @static
   * @method read
   * @param json geojson格式的数据
   * @returns {Array} 返回 features 的集合
   */
  static read (json) {
    const features = []

    if(!json) {
      return
    }
    const featuresObj = json.features
    featuresObj.forEach( featureObj => {
      if (featureObj.type === 'Feature') {
        if (featureObj.geometry) {
          let constructor = undefined
          const geometryObj = featureObj.geometry
          const geometryType = geometryObj.type
          if (geometryType === 'Point') {
            constructor = Point
          } else if (geometryType === 'LineString') {
            constructor = Line
          } else if (geometryType === 'Polygon') {
            constructor = Polygon
          } else if (geometryType === 'ExtentPolygon') {
            constructor = Extent
          } else if (geometryType === 'MutilPolygon') {
            constructor = MutilPolygon
          } else if (geometryType === 'ParallelogramPolygon') {
            constructor = Parallelogram
          }
          
          if (constructor === undefined) {
            throw new Error('包含未定义的 Geometry 类型')
          } else {
            const coordinates = geometryObj.coordinates
            const geometry = new constructor()
            geometry.setCoordinates(coordinates)
  
            let propertiesObj
            if (featureObj.properties) {
              propertiesObj = featureObj.properties
            }
  
            let title = featureObj.title
            const feature = new Feature(geometry, propertiesObj, title)
            features.push(feature)
          }
        }
      }
    })
    
    return features
  }
  
  /**
   *
   * 将 Feature 集合写入到 GeoJSON 的格式对象中
   *
   * @static
   * @method write
   * @param features Feature 集合
   * @returns {Object} 返回 GeoJSON 格式的数据
   */
  static write (features) {
    const featuresArr = []
    
    features.forEach( feature => {
      featuresArr.push({
        type: 'Feature',
        geometry: {
          type: GeoJSON.getGeoJSONGeometryType(feature.geometry),
          coordinates: feature.geometry.getCoordinates()
        },
        properties: Obj.mapToObject(feature._attributesMap),

        title: feature.displayText
      })
    })
    
    return {
      type: 'FeatureCollection',
      features: featuresArr
    }
  }
  
  /**
   * 获取Geometry的类型
   *
   * @static
   * @method getGeoJSONGeometryType
   * @param geometry
   * @returns {*}
   */
  static getGeoJSONGeometryType (geometry) {
    const type = geometry.geometryType
    let jsonType
    switch (type) {
    case Geometry.POINT :
      jsonType = 'Point'
      break
    case Geometry.LINE :
      jsonType = 'LineString'
      break
    case Geometry.POLYGON :
      jsonType = 'Polygon'
      break
    case Geometry.MULTI_POLYGON :
      jsonType = 'MutilPolygon'
      break
    case Geometry.EXTENT :
      jsonType = 'ExtentPolygon'
      break
    case Geometry.PARALLELOGRAM :
      jsonType = 'ParallelogramPolygon'
    }
    
    return jsonType
  }
}