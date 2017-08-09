window.onload = function () {
  
  var point = new Datatang.Point(900,500)
  
  var path = [[400,200],[500,300],[500,50],[80,600]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[[500,400],[490,478],[350,350],[500,400]]]
  var polygon = new Datatang.Polygon(rings)
  
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
      ],
      // 洞1
      [
        [500, 640], [540, 650],
        [520, 680], [500, 640]
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
  
  var mutilPolygon = new Datatang.MutilPolygon(mutilPolygonRings)
  
  var extent = new Datatang.Extent(1100, 300, 1400, 600)
  
  var features = [new Datatang.Feature(point),
    new Datatang.Feature(line),
    new Datatang.Feature(polygon),
    new Datatang.Feature(holePolygon, null, '这是一个带洞的多边形'),
    new Datatang.Feature(mutilPolygon),
    new Datatang.Feature(extent)]
  
  // 将会获取缺省样式
  var selectLayer = new Datatang.FeatureLayer()
  
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
      selectLayer
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
  
  selectLayer.addFeatures(features)
  
  // 选择工具
  var selectTool = new Datatang.Select({
    selectMode: Datatang.BrowserEvent.SINGLE_CLICK,
    selectMultiMode: function(event){
      return event.keyCode === 17
    }
  })

  map.addComponents(selectTool)
  
  var typeSelect = document.getElementById('type')
  
  /**
   * Handle change event.
   */
  typeSelect.onchange = function() {
    selectTool.selectMode = typeSelect.value
  }
}
