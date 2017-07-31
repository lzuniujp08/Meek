window.onload = function () {

  var point = new Datatang.Point(100, 100)
  
  var features = [
    new Datatang.Feature(point)
  ]
  
  // 将会获取缺省样式
  var featureLayer = new Datatang.FeatureLayer({
    features: features
  })

  var mapextent = [0, 0, 2783, 2125];
  var map = new Datatang.Map({
    layers: [
      featureLayer,
      new Datatang.SingleImageLayer({
        url: 'source/China_map.jpg',
        imageExtent: mapextent,
        projection: {
          extent: mapextent
        }
      })
      
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
}


