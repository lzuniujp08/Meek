window.onload = function () {
  
  var point = new Datatang.Point(200,700)
  
  var path = [[400,200],[500,300],[500,50],[80,600]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[[500,400],[490,478],[350,350],[500,400]]]
  var polygon = new Datatang.Polygon(rings)
  
  var extent = new Datatang.Extent(1100, 300, 1400, 600)
  
  var features = [new Datatang.Feature(point),
    new Datatang.Feature(line),
    new Datatang.Feature(polygon),
    new Datatang.Feature(extent)]
  
  var extent = [0, 0, 1024, 968]
  
  // 将会获取缺省样式
  var tempLayer = new Datatang.FeatureLayer({features: features})

  var map = new Datatang.Map({
    layers: [
      new Datatang.SingleImageLayer({
        url: 'source/online_communities.png',
        imageExtent: extent,
        projection: {
          extent: extent
        }
      }),
      tempLayer
    ],
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
}
