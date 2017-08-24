window.onload = function () {
  
  var point = new Datatang.Point(900,500)
  
  var path = [[400,200],[500,300],[500,50],[80,600]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[[500,400],[490,478],[350,350],[500,400]]]
  var polygon = new Datatang.Polygon(rings)
  
  var extent = new Datatang.Extent(1100, 300, 1400, 600)
  var extent1 = new Datatang.Extent(100, 300, 200, 600)
  
  var holeRings = [
    // 外环
    [
      [100, 600], [50, 680],
      [100, 760], [200, 690],
      [150, 580], [100, 600]
    ],
    // 洞1
    [
      [100, 640], [140, 650],
      [120, 680], [100, 640]
    ],
    // 洞2
    [
      [100, 690], [140, 700],
      [120, 720], [100, 690]
    ]
  ]
  var holePolygon = new Datatang.Polygon(holeRings)
  
  var mutilPolygonRings = [
    // 多边形1
    [
      [
        [500, 600], [450, 680],
        [500, 760], [600, 690],
        [550, 580], [500, 600]
      ]
    ],
    // 多边形2
    [
      [
        [700, 600], [650, 680],
        [700, 760], [800, 690],
        [750, 580], [700, 600]
      ]
    ]
  ]
  
  // 定义一个平行四边形
  var paralletogramRings = [[
    [650, 100], [700, 200], [1000, 200], [950, 100], [650, 100]]
  ]
  
  var paralletogram = new Datatang.Parallelogram(paralletogramRings)
  
  var mutilPolygon = new Datatang.MutilPolygon(mutilPolygonRings)
  
  var features = [new Datatang.Feature(point),
    new Datatang.Feature(line),
    new Datatang.Feature(polygon),
    new Datatang.Feature(holePolygon),
    new Datatang.Feature(mutilPolygon),
    new Datatang.Feature(paralletogram, null, '平行四边形'),
    new Datatang.Feature(extent),
    new Datatang.Feature(extent1)
  ]
  
  // 将会获取缺省样式
  var featureLayer = new Datatang.FeatureLayer()
  featureLayer.addFeatures(features)
  
  var mapextent = [0, 0, 1024, 968];
  
  var map = new Datatang.Map({
    layers: [
      new Datatang.SingleImageLayer({
        url: 'source/online_communities.png',
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
  
  var selectedFeatures = [new Datatang.Feature(point)]
  
  var modifyTool = new Datatang.Modify({
    features: selectedFeatures
  });
  
  map.addComponents(modifyTool)
  
  var typeSelect = document.getElementById('type')
  
  /**
   * Handle change event.
   */
  typeSelect.onchange = function() {
    var value = typeSelect.value
    if(value === 'point') {
      modifyTool.features = [new Datatang.Feature(point)]
    } else if (value === 'line') {
      modifyTool.features = [new Datatang.Feature(line)]
    } else if (value === 'polygon') {
      modifyTool.features = [new Datatang.Feature(polygon)]
    } else if (value === 'holePolygon') {
      modifyTool.features = [new Datatang.Feature(holePolygon)]
    } else if (value === 'mutilPolygon') {
      modifyTool.features = [new Datatang.Feature(mutilPolygon)]
    } else if (value === 'extent') {
      modifyTool.features = [new Datatang.Feature(extent)]
    } else if (value === 'parallelogram') {
      modifyTool.features = [new Datatang.Feature(paralletogram)]
    }
  }
}

