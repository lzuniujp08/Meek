// 多边形
var rings = [[[800,580],[490,600],[255, 820],
  [1000,1000],[255,1100,],[1200,1200],[800,580]]]
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
  
  var becutedGeometry = polybool(drawGeometry)
  
  arr.forEach(function(fea){
    var theGeometry = polybool(fea.geometry)
    becutedGeometry = PolyBool.difference(theGeometry, becutedGeometry)
  })
  
  console.log(becutedGeometry)
  
  var featureCollection = []
  
  var regions = becutedGeometry.regions
  regions.forEach(function(re){
    var g = new Datatang.Polygon()
    g.setCoordinates([re])
    featureCollection.push(new Datatang.Feature(g))
  })
  
  featureLayer.addFeatures(featureCollection)
  featureLayer.removeFeature(feature)
  featureLayer.removeFeature(feature1)
})

function polybool(geometry) {
  var coords = geometry.getCoordinates()[0]
  var poly1 = {
    regions: [
      coords
    ],
    inverted: false
  }
  
  return poly1
}

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
