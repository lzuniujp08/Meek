/**
 * Created by zhangyong on 2017/7/7.
 */


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

// 绘图工具
var drawTool = new Datatang.Draw({
  type: 'polygon',
  drawLayer: featureLayer
})

map.addComponents(drawTool)

// 多边形
var rings = [[800,580],[490,600],[255, 820], [1000,1000],[800,580]]
var polygon = new Datatang.Polygon(rings)
var feature = new Datatang.Feature(polygon)

featureLayer.addFeature(feature)


drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function(drawEvent){
  var drawFeature = drawEvent.feature
  
  var g1 = convertToJstsGeometry(drawFeature.geometry)
  var g2 = convertToJstsGeometry(polygon)
  
  var differenceResult = g1.difference(g2)
  
  var geometries = []
  if (differenceResult.geometries) {
    geometries = differenceResult.geometries
  } else {
    geometries.push({shell : differenceResult.shell})
  }
 
  for (var i = 0; i < geometries.length ; i ++) {
    var geometryItem = geometries[i]
    
    var coords = geometryItem.shell.points.coordinates
  
    var newCoords = []
    coords.forEach(function(g){
      newCoords.push([g.x, g.y])
    })
  
    var clipedPolygon = new Datatang.Polygon()
    clipedPolygon.setCoordinates(newCoords)
  
    var clipedFeature = new Datatang.Feature(clipedPolygon)
  
    featureLayer.addFeature(clipedFeature)
    featureLayer.removeFeature(drawFeature)
  }
  
})


var geometryFactory = null;
function convertToJstsGeometry(geometry) {
  if (geometryFactory === null) {
    geometryFactory = new jsts.geom.GeometryFactory();
  }
  
  return convertToPolygon(geometry)
}

function convertToPolygon (polygon) {
  const linearRings = polygon.getCoordinates()
  
  
  var coordinates = []
  linearRings.forEach(function(point){
    coordinates.push(new jsts.geom.Coordinate(point[0], point[1]))
  })
  
  return geometryFactory.createPolygon(coordinates)
}






