/**
 * Created by zhangyong on 2017/6/12.
 */


var dom;

window.onload = function () {
  
  var point = new Datatang.Point(1960,1210)
  
    
  var path = [[1960,1210],[2000,1000],[1980,800],[1900,600],[1850,500],[1828, 310]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[[800,580],[490,600],[400,660],[300, 700],[270, 780],[255, 820],[230, 860],[280,1050],
    [1000,1000],[1000,800],[800,580]]]
  var polygon = new Datatang.Polygon(rings)
  
  var extent = new Datatang.Extent(1500, 1500, 2000, 2000)
  
  var features = [
    new Datatang.Feature(point,{name: '北京站'})
    ,new Datatang.Feature(line,{'name': '京广高铁'})
    ,new Datatang.Feature(polygon, {'name': '三江源湿地'})
    ,new Datatang.Feature(extent, {'name': '第51区域'})
  ]
  
  
  dom = {
    text: document.getElementById('points-text'),
    align: document.getElementById('points-align'),
    baseline: document.getElementById('points-baseline'),
    rotation: document.getElementById('points-rotation'),
    font: document.getElementById('points-font'),
    weight: document.getElementById('points-weight'),
    size: document.getElementById('points-size'),
    offsetX: document.getElementById('points-offset-x'),
    offsetY: document.getElementById('points-offset-y'),
    color: document.getElementById('points-color'),
    outline: document.getElementById('points-outline'),
    outlineWidth: document.getElementById('points-outline-width'),
    maxreso: document.getElementById('points-maxreso')
  }
  
  
  var styleFunction = function (feature, resolution) {
  
    var textStyle = getTextStyle(feature, resolution)
    
    var white = [255, 255, 255]
    var blue = [0, 153, 255]
    var width = 1.5
  
    var style = {}
  
    // 面样式 polygon style
    style[Datatang.Geometry.POLYGON] = [
      new Datatang.FillStyle(white,new Datatang.LineStyle(blue,1,1.25),0.5)
    ]
    
    // same as polygon style
    style[Datatang.Geometry.EXTENT] = style[Datatang.Geometry.POLYGON]
  
    // 线样式 line style
    style[Datatang.Geometry.LINE] =
      [new Datatang.LineStyle(blue,1,width,Datatang.LineStyle.LineCap.ROUND,
        Datatang.LineStyle.LineJion.ROUND)// 内框
    ]
  
    // 点样式 point style
    style[Datatang.Geometry.POINT] =
      [new Datatang.PointStyle(10,white,1,new Datatang.LineStyle(blue,1,width))]
    
    for (var item in style) {
      style[item][0].textStyle = textStyle
    }
    
    return style[feature.geometry.geometryType]
  }
  
  
  // 将会获取缺省样式
  var featureLayer = new Datatang.FeatureLayer({
    features: features,
    style: styleFunction
  })
  
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
  
  
  var dragPan = new Datatang.DragPanCpt({
    kinetic: new Datatang.Kinetic(-0.005, 0.05, 100)
  })
  
  var tool = new Datatang.MouseWheelZoom()
  
  map.addComponents(dragPan)
  map.addComponents(tool)
  
}

function getText(feature, resolution, dom) {
  var type = dom.text.value;
  var maxResolution = dom.maxreso.value;
  var text = feature.get('name');
  
  if (resolution > maxResolution) {
    text = '';
  } else if (type == 'hide') {
    text = '';
  } else if (type == 'shorten') {
    text = text.trunc(12);
  } else if (type == 'wrap') {
    text = stringDivider(text, 16, '\n');
  }
  
  return text;
};


function getTextStyle(feature, resolution) {
  var align = dom.align.value;
  var baseline = dom.baseline.value;
  var size = dom.size.value;
  var offsetX = parseInt(dom.offsetX.value, 10);
  var offsetY = parseInt(dom.offsetY.value, 10);
  var weight = dom.weight.value;
  var rotation = parseFloat(dom.rotation.value);
  var font = weight + ' ' + size + ' ' + dom.font.value;
  var fillColor = [0, 0, 255] || dom.color.value;
  var outlineColor = [255, 255, 255] || dom.outline.value;
  var outlineWidth = parseInt(dom.outlineWidth.value, 10);
  
  return new Datatang.TextStyle({
    textAlign: align,
    textBaseline: baseline,
    font: font,
    text: getText(feature, resolution, dom),
    fill: fillColor,
    stroke: new Datatang.LineStyle(outlineColor,1,outlineWidth,
      Datatang.LineStyle.LineCap.ROUND,
      Datatang.LineStyle.LineJion.ROUND),
    offsetX: offsetX,
    offsetY: offsetY,
    rotation: rotation
  });
  
}

function stringDivider(str, width, spaceReplacer) {
  if (str.length > width) {
    var p = width;
    while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
      p--;
    }
    if (p > 0) {
      var left;
      if (str.substring(p, p + 1) == '-') {
        left = str.substring(0, p + 1);
      } else {
        left = str.substring(0, p);
      }
      var right = str.substring(p + 1);
      return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
    }
  }
  return str;
}

String.prototype.trunc = String.prototype.trunc ||
  function(n) {
    return this.length > n ? this.substr(0, n - 1) + '...' : this.substr(0);
  };