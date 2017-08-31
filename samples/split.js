
var featureLayer = new Datatang.FeatureLayer()

// 初始化map、view和layer
var mapextent = [0, 0, 2783, 2125];
var map = new Datatang.Map({
  layers: [
    new Datatang.SingleImageLayer({
      url: 'source/China_map.jpg',
      imageExtent: mapextent,
      projection: {
        extent: mapextent
      }
    }),
    featureLayer
  ],
  target: 'map',
  view: new Datatang.View({
    projection: {
      extent: mapextent
    },
    center: Datatang.ExtentUtil.getCenter(mapextent),
    zoom: 2,
    maxZoom: 8
  })
});


var typeSelect = document.getElementById('type')

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
  var value = typeSelect.value
  if (value === 'free') {
    draw.freehand = true
  } else if (value === 'nonfree'){
    draw.freehand = false
  } else {
    draw.active = false
  }
}

var features = Datatang.GeoJSON.read(exampleJSON())
featureLayer.addFeatures(features)

// 绘图工具
var draw = new Datatang.Draw({
  type: 'line',
  drawLayer: featureLayer,
  finishCondition: function(event) {
    return event.keyCode === 13
  }
})

var select = new Datatang.Select({
  selectMode: Datatang.BrowserEvent.MOUSE_MOVE
})

map.addComponents(select)
map.addComponents(draw)


draw.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function(drawEvent){
  var linefeature = drawEvent.feature
  
  var intersects = getIntersectedGeometry(linefeature.geometry)
  if (intersects.length === 0) {
    alert('未有分割对象，请重绘制分割线！')
    featureLayer.removeFeature(linefeature)
    return
  }
  
  var splitedFeature = intersects[0]
  var splitedPolygon = splitedFeature.geometry
  
  var featureCollection = Datatang.splitPolygonByPolyline(splitedPolygon, linefeature.geometry)
  
  if (featureCollection.length === 0) {
    alert('分割失败，请重新分割！')
    featureLayer.removeFeature(linefeature)
    return
  }
  
  console.log('共切出来：' + featureCollection.length)
  
  var splitFeatures = []
  featureCollection.forEach(function(polygon){
    splitFeatures.push(new Datatang.Feature(polygon))
  })
  
  featureLayer.addFeatures(splitFeatures)
  featureLayer.removeFeature(linefeature)
  featureLayer.removeFeature(splitedFeature)
})


function getIntersectedGeometry (geometry) {
  var features = featureLayer.features
  var filters = features.filter( function(feature) {
    return feature.geometry.id !== geometry.id && Datatang.intersects(geometry, feature.geometry)
  })
  
  return filters
}

function exampleJSON () {
  return {
    "type": 'FeatureCollection',
    "features": [
      {
        "type": 'Feature',
        "geometry": {
          "type": 'Polygon',
          "coordinates": [
            [
              [800, 580], [490, 600],
              [255, 820], [1000, 1000],
              [255, 1100], [1200, 1200],
              [800,580]
            ]
          ]
        }
    },
    {
      "type": 'Feature',
      "geometry": {
        "type": 'Polygon',
        "coordinates": [
          [
            [1900, 580], [1590, 600],
            [1355, 820], [1900, 1000],
            [1355, 1100], [2300, 1200],
            [1900,580]
          ],
          [
            [1800, 700], [1700, 800],
            [1710, 700], [1800, 700]
          ],
          [
            [2100, 1050], [2000, 1150],
            [2010, 1050], [2100, 1050]
          ]
        ]
      }
    }
    ]
  }
}
