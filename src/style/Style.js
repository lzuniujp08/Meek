/**
 * Created by zhangyong on 2017/3/17.
 */


import Geometry from '../geom/Geometry'

const Style = {}

Style._default = null

Style.defaultFunction = function () {
  if (!Style._default) {
    const fill = new FillStyle({
      color: 'rgba(255,255,255,0.4)'
    })
    const stroke = new LineStyle({
      color: '#3399CC',
      width: 1.25
    })
    Style._default = [
      new ol.style.Style({
        image: new ol.style.Circle({
          fill: fill,
          stroke: stroke,
          radius: 5
        }),
        fill: fill,
        stroke: stroke
      })
    ]
  }
  return Style._default
}

Style.createDefaultEditing = function () {
  /** @type {Object.<ol.geom.GeometryType, Array.<ol.style.Style>>} */
  var styles = {}
  var white = [255, 255, 255, 1]
  var blue = [0, 153, 255, 1]
  var width = 3
  styles[Geometry.POLYGON] = [
    new ol.style.Style({
      fill: new ol.style.Fill({
        color: [255, 255, 255, 0.5]
      })
    })
  ]
  styles[Geometry.MULTI_POLYGON] = styles[Geometry.POLYGON]
  styles[Geometry.LINE] = [
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: white,
        width: width + 2
      })
    }),
    new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: blue,
        width: width
      })
    })
  ]
  styles[Geometry.MULTI_LINE] = styles[Geometry.LINE]
  styles[Geometry.CIRCLE] = styles[Geometry.POLYGON].concat(
      styles[Geometry.LINE]
    )
  
  styles[Geometry.POINT] = [
    new ol.style.Style({
      image: new ol.style.Circle({
        radius: width * 2,
        fill: new ol.style.Fill({
          color: blue
        }),
        stroke: new ol.style.Stroke({
          color: white,
          width: width / 2
        })
      }),
      zIndex: Infinity
    })
  ]
  styles[Geometry.MULTI_POINT] = styles[Geometry.POINT]
  return styles
}



