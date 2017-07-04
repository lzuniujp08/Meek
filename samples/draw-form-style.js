/**
 * Created by zhangyong on 2017/6/30.
 */


  
// 将会获取缺省样式
var flayer = new Datatang.FeatureLayer()

var container = document.getElementById('popup')
var gometrytypeSpan = document.getElementById('gometrytypeSpan')

var extent = [0, 0, 2783, 2125];
var overlay = new Datatang.Overlay(({
  element: container,
  autoPan: true
}))

var map = new Datatang.Map({
  layers: [
    new Datatang.SingleImageLayer({
      url: 'source/China_map.jpg',
      imageExtent: extent,
      projection: {
        extent: extent
      }
    }),
    flayer
  ],
  overlays: [overlay],
  target: 'map',
  view: new Datatang.View({
    projection: {
      extent: extent
    },
    center: Datatang.ExtentUtil.getCenter(extent),
    zoom: 2,
    maxZoom: 8
  })
});

// 绘图工具
var drawTool = new Datatang.DrawCpt({
  type: 'point',
  drawLayer: flayer
})

map.addComponents(drawTool)

var typeSelect = document.getElementById('type')

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
  drawTool.drawMode = typeSelect.value
}

drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function(drawEvent){
  var feature = drawEvent.feature
  var geometry = feature.geometry
  
  var position = []
  
  if (geometry.geometryType === Datatang.Geometry.LINE  ) {
    var coords = geometry.getCoordinates()
    position = coords[coords.length - 1]
  }
  else if (geometry.geometryType === Datatang.Geometry.POLYGON ||
    geometry.geometryType === Datatang.Geometry.EXTENT ) {
    var coords = geometry.getCoordinates()
    position = coords[coords.length - 3]
  }
  else {
    position = geometry.getFlatInteriorPoint()
  }
  
  overlay.position = position
  
  gometrytypeSpan.innerHTML = geometry.geometryType
})


  