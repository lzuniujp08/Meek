//初始化图层对象以及style回调函数
var featureLayer = new Datatang.FeatureLayer()

// 初始化map、view和layer
var extent = [0, 0, 2783, 2125];
var map = new Datatang.Map({
  layers: [
    new Datatang.SingleImageLayer({
      url: 'source/China_map.jpg',
      imageExtent: extent,
      projection: {
        extent: extent
      }
    }),
    featureLayer
  ],
  target: 'map',
  view: new Datatang.View({
    projection: {
      extent: extent
    },
    center: Datatang.ExtentUtil.getCenter(extent),
    resolution: 2,
    resolutions: [4,2,1,0.5,0.25,0.125, 0.0625, 0.03125]
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
        },
        "properties" : {
          "uuid":'12124542ewrwefsfre',
          "test": 1,
          "num":12
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
            [536.7602539062498, 1334.27734375],
            [335.6450195312498, 1709.330078125],
            [1104.7749023437498, 1885.9853515625],
            [1588.5385742187498, 1472.8837890625],
            [1523.3120117187498, 1206.5419921875]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [982.4750976562498, 673.8583984375], [379.1293945312498, 1086.9599609375],
            [947.1440429687498, 1192.953125], [1153.6948242187498, 953.7890625],
            [1126.5170898437498, 801.59375], [982.4750976562498, 673.8583984375]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
             [
               [1861, 233], [1222, 385],
               [1277, 671], [1309, 880],
               [1674, 1019], [2032, 1016],
               [2239, 872], [2329, 679],
               [2367, 521], [2244,383],
               [2214, 298], [1861, 233]
             ],
            [
              [1937, 480], [2051, 540],
              [2048, 641], [2084, 725],
              [1929, 861], [1698, 826],
              [1657, 660], [1685, 467],
              [1937, 480]
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
              [1455.3676757812498, 1274.9736328125], [1311.3256835937498, 1470.6533203125],
              [1710.8383789062498, 1527.7265625], [1868.4692382812498, 1318.4580078125],
              [1727.1450195312498, 1136.3671875], [1455.3676757812498, 1274.9736328125]
           ]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type" : 'ExtentPolygon',
          "coordinates": [
            [406.3071289062498, 385.77441406249994],
            [601.9868164062498, 385.77441406249994],
            [601.9868164062498, 614.0673828125],
            [406.3071289062498, 614.0673828125],
            [406.3071289062498, 385.77441406249994]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": 'MutilPolygon',
          "coordinates": [
            [
              [
                [1755.3676757812498, 1574.9736328125], [1611.3256835937498, 1770.6533203125],
                [2010.8383789062498, 1827.7265625], [2168.4692382812498, 1618.4580078125],
                [2027.1450195312498, 1436.3671875], [1755.3676757812498, 1574.9736328125]
              ],
              [
                [2355.3676757812498, 1774.9736328125], [2211.3256835937498, 1970.6533203125],
                [2627.1450195312498, 1636.3671875], [2355.3676757812498, 1774.9736328125]
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "ParallelogramPolygon",
          "coordinates": [
            [
              [1220.5, 1018.5],
              [970.5, 1334.5],
              [1734.5, 1178.5],
              [1984.5, 862.5],
              [1220.5, 1018.5]
            ]
          ]
        },
        "properties": {}
      }
    ]
  }
  
  return a
}
