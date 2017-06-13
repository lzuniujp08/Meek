/**
 * Created by zhangyong on 2017/6/12.
 */


var dom;

window.onload = function () {
  
  var point = new Datatang.Point(1960,1210)
  
  var path = [[400,1000],[500,1300],[1000,1500],[1800,800]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[[500,400],[490,478],[350,350],[1500,400],[100,100],[500, 400]]]
  var polygon = new Datatang.Polygon(rings)
  
  var extent = new Datatang.Extent(1500, 1500, 2000, 2000)
  
  var features = [new Datatang.Feature(point,{
    name: '北京市'
  }),
    new Datatang.Feature(line,{'name': '京沪高铁'}),
    new Datatang.Feature(polygon, {'name': '我的地盘 我做主'}),
    new Datatang.Feature(extent, {'name': '第51区域'})]
  
  
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
    var defaultStyle = Datatang.Style.defaultFunction()
  
    var textStyle = getTextStyle(feature, resolution)
    defaultStyle.map(function(geometryStyle){
      return geometryStyle.text = textStyle
    })
    
    return defaultStyle[feature.geometry.geometryType]
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
  var fillColor = dom.color.value;
  var outlineColor = dom.outline.value;
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