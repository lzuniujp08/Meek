/**
 * Created by zhangyong on 2017/7/17.
 */

// 多边形
var rings = [[800,580],[490,600],[255, 820],
  [1000,1000],[255,1100,],[1200,1200],[800,580]]
var polygon = new Datatang.Polygon(rings)

var feature = new Datatang.Feature(polygon)

var featureLayer = new Datatang.FeatureLayer()
featureLayer.addFeature(feature)

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
  type: 'line',
  drawLayer: featureLayer
})

map.addComponents(draw)
draw.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function(drawEvent){
  var feature = drawEvent.feature
  
  Datatang.splitPolygonByLine(polygon, feature.geometry)
})
