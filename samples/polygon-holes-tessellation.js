// 多边形
var rings = [[[800,580],[490,600],[255, 820], [1000,1000],[800,580]]]
var polygon = new Datatang.Polygon(rings)

var feature1 = new Datatang.Feature(polygon)

var featureLayer = new Datatang.FeatureLayer()
featureLayer.addFeature(feature1)

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


var features = Datatang.GeoJSON.read(getJSON())
featureLayer.addFeatures(features)


// 绘图工具
var draw = new Datatang.Draw({
  type: 'polygon',
  drawLayer: featureLayer
})

var select = new Datatang.Select({
  selectMode: Datatang.BrowserEvent.MOUSE_MOVE
})

map.addComponents(select)
map.addComponents(draw)

draw.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function(drawEvent){
  var feature = drawEvent.feature
  var drawGeometry = feature.geometry
  
  var arr = getIntersectFeatures(feature, featureLayer)
  if (arr.length === 0) {
    return
  }
  
  var firstGeometry = arr[0].geometry
  if (firstGeometry.geometryType === Datatang.Geometry.POLYGON ) {
    var afterGeometry = Datatang.polygonWithHole(firstGeometry, drawGeometry)
    featureLayer.addFeature(new Datatang.Feature(afterGeometry))
  
    featureLayer.removeFeature(arr[0])
    featureLayer.removeFeature(feature)
  }
})


function getIntersectFeatures (feature, targetLayer) {
  var allFeatures = targetLayer.features
  var results = []
  
  for(var i = 0, len = allFeatures.length; i < len; i++) {
    var fet = allFeatures[i]
    if (fet.id === feature.id ||
      fet.geometry.geometryType === Datatang.Geometry.POINT) {
      continue
    }
    
    var extent1 = fet.geometry.extent
    var extent2 = feature.geometry.extent
    var extetnArr1 = [extent1.xmin, extent1.ymin, extent1.xmax, extent1.ymax]
    var extetnArr2 = [extent2.xmin, extent2.ymin, extent2.xmax, extent2.ymax]
    
    if (Datatang.ExtentUtil.intersects(extetnArr1, extetnArr2)){
      results.push(fet)
    }
  }
  
  return results
}


function getJSON () {
  var a = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [1861, 233], [1222, 385],
              [1277, 671], [1309, 880],
              [1674, 1019], [2032, 1016],
              [2239, 872], [2329, 679],
              [2367, 521], [2244,383],
              [2214, 298], [1861, 233]
            ],
            [
              [1937, 480], [2051, 540],
              [2048, 641], [2084, 725],
              [1929, 861], [1698, 826],
              [1657, 660], [1685, 467],
              [1937, 480]
            ]
          ]
        }
      }
    ]
  }
  
  return a
}