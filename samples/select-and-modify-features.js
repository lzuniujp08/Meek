window.onload = function () {
  
  var point = new Datatang.Point(900,500)
  
  var path = [[1400,1200],[1500,1300],[1500,150],[180,1600]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[[1500,1400],[1490,1478],[1350,1350],[1950,1350],[1500,1400]]]
  var polygon = new Datatang.Polygon(rings)
  
  var extent = new Datatang.Extent(1100, 300, 1400, 600)
  var extent1 = new Datatang.Extent(1100, 1300, 1400, 1600)

  var features = [new Datatang.Feature(point),
    new Datatang.Feature(line),
    new Datatang.Feature(polygon),
    new Datatang.Feature(extent1),
    new Datatang.Feature(extent)]

  // 将会获取缺省样式
  var featureLayer = new Datatang.FeatureLayer()
  featureLayer.addFeatures(features)
  
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
      zoom: 1,
      maxZoom: 8
    })
  });
  
  var select = new Datatang.Select()
  
  var modifyTool = new Datatang.Modify()
  
  // add select-end event linstener
  select.addEventListener(Datatang.SelectEvent.EventType.SELECT, function(event) {
    modifyTool.features = event.selectedFeatures
  })
  
  map.addComponents(modifyTool)
  map.addComponents(select)
}

