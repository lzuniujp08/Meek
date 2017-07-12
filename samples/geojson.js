/**
 * Created by zhangyong on 2017/7/12.
 */


//初始化图层对象以及style回调函数
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
  type: 'point',
  drawLayer: featureLayer
})

map.addComponents(drawTool)

var typeSelect = document.getElementById('type')

typeSelect.onchange = function() {
  drawTool.drawMode = typeSelect.value
}

var a = getJSON()

var features = Datatang.GeoJSON.read(a)
featureLayer.addFeatures(features)


function onClick(e) {
  var features = featureLayer.features
  var result = Datatang.GeoJSON.write(features)
  console.log(JSON.stringify(result))
}


function getJSON () {
  var a = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            1017.8061523437498,
            1019.015625
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            1360.2456054687498,
            1298.9462890625
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            938.9907226562498,
            1375.0439453125
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [
            841.1508789062498,
            1201.1064453125
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [
              536.7602539062498,
              1334.27734375
            ],
            [
              335.6450195312498,
              1709.330078125
            ],
            [
              1104.7749023437498,
              1885.9853515625
            ],
            [
              1588.5385742187498,
              1472.8837890625
            ],
            [
              1523.3120117187498,
              1206.5419921875
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              982.4750976562498,
              673.8583984375
            ],
            [
              379.1293945312498,
              1086.9599609375
            ],
            [
              947.1440429687498,
              1192.953125
            ],
            [
              1153.6948242187498,
              953.7890625
            ],
            [
              1126.5170898437498,
              801.59375
            ],
            [
              982.4750976562498,
              673.8583984375
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              1455.3676757812498,
              874.9736328125
            ],
            [
              1311.3256835937498,
              1070.6533203125
            ],
            [
              1710.8383789062498,
              1127.7265625
            ],
            [
              1868.4692382812498,
              918.4580078125
            ],
            [
              1727.1450195312498,
              736.3671875
            ],
            [
              1455.3676757812498,
              874.9736328125
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type" : 'ExtentPolygon',
          "coordinates": [
            [
              406.3071289062498,
              385.77441406249994
            ],
            [
              601.9868164062498,
              385.77441406249994
            ],
            [
              601.9868164062498,
              614.0673828125
            ],
            [
              406.3071289062498,
              614.0673828125
            ],
            [
              406.3071289062498,
              385.77441406249994
            ]
          ]
        }
      }
    ]
  }
  
  return a
}
