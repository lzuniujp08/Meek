var drawTool,
  selectTool,
  modifyTool,
  flag = false,
  currentFeature,
  PainerList;
window.onload = function () {
  var featureLayer = new Datatang.FeatureLayer()
  var extent = [0, 0, 1280, 800]

  var container = document.getElementById('J_mark_form')
  var typeSelect = document.getElementsByClassName('btn-tool')
  var J_form_submit = document.getElementById('J_form_submit')
  var J_form_cancel = document.getElementById('J_form_cancel')

  var overlay = new Datatang.Overlay(({
    element: container,
    autoPan: true
  }))

  var map = new Datatang.Map({
    layers: [new Datatang.SingleImageLayer({
      url: "source/test.jpeg",
      imageExtent: extent,
      projection: {
        extent: extent
      }
    }),
      featureLayer
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
  })

  drawTool = new Datatang.Draw({
    type: 'point',
    drawLayer: featureLayer
  });
  modifyTool = new Datatang.Modify({
    features: featureLayer.features
  });
  selectTool = new Datatang.Select({
    selectMode: Datatang.BrowserEvent.CLICK
  });

  map.addComponents(drawTool)
  map.addComponents(selectTool)
  map.addComponents(modifyTool)
  selectTool.active = false
  modifyTool.active = false

  //选择需要画的图形类别
  for (var i = 0, ii = typeSelect.length; i < ii; i++) {
    typeSelect[i].onclick = function () {

      var val = this.getAttribute('data-tool-class')
      if (val === "None") {
        drawTool.active = false
        selectTool.active = true
        modifyTool.active = true
      } else {
        selectTool.clear()

        drawTool.active = true
        drawTool.drawMode = val
        selectTool.active = false
        modifyTool.active = false
      }
    }
  }

  //表单显示隐藏
  function formClose(display) {
    display ? J_mark_form.style.display = 'block' : J_mark_form.style.display = 'none'
  }

  //表单取消
  J_form_cancel.onclick = function() {
    overlay.position = undefined
    J_form_cancel.blur()
    console.log(featureLayer)
    //featureLayer.features.splice(featureLayer.features[featureLayer.features.length],1)
    featureLayer.removeFeature(currentFeature)
    return false
  }

  //表单提交
  J_form_submit.onclick = function () {
    var text = document.getElementById('J_tree_view').value
    var featureStyle = featureLayer.styleFunction(currentFeature)[0].clone()

    var textStyle
    if (!featureStyle.textStyle) {
      textStyle = new Datatang.TextStyle({
        text: text,
        fill: [0, 0, 0],
        stroke: new Datatang.LineStyle([255, 255, 0], 1, 1,
          Datatang.LineStyle.LineCap.ROUND,
          Datatang.LineStyle.LineJion.ROUND),
      })
    } else {
      textStyle = featureStyle.textStyle.clone()
      textStyle.text = text,
      textStyle.fill = [0, 0, 0]
      textStyle.stroke.color = [255, 255, 255]
    }

    featureStyle.textStyle = textStyle

    currentFeature.style = [featureStyle]

    formClose(false)
    map.render()
    document.getElementById('J_tree_view').value = ''
  }

// 表单编辑事件
  selectTool.addEventListener(Datatang.SelectEvent.EventType.SELECT, function (event) {
    var features = event.selectedFeatures
    if (features.length === 0) {
      return
    }

    var feature = features[0]
    var geometry = feature.geometry

    overlay.position = geometry.getFormShowPosition()
    document.getElementById('J_tree_view').value = features[0].style[0].textStyle.text
    currentFeature = feature
    formClose(true)

    gometrytypeSpan.innerHTML = geometry.geometryType
  })

  selectTool.addEventListener(Datatang.SelectEvent.EventType.SELECT, function (event) {
    modifyTool.features = event.selectedFeatures
  })

  // 多边形 start
  var rings = [[500,280],[190,400],[55, 520], [600,600],[500,280]]
  var polygon1 = new Datatang.Polygon(rings)
  var feature1 = new Datatang.Feature(polygon1)

  featureLayer.addFeature(feature1)
  //多边形 end

  /** ondrawend **/

  //dom
  function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  }

  function addClass(obj, cls) {
    if (!hasClass(obj, cls)) obj.className += " " + cls;
  }

  function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      obj.className = obj.className.replace(reg, '');
    }
  }

  function toggleClass(obj,cls){
    if(hasClass(obj,cls)){
      removeClass(obj, cls);
    }else{
      addClass(obj, cls);
    }
  }

  //判断拆分状态值
  var clip = document.getElementById('clip')
  clip.onclick = function () {
    var test = document.getElementById('clip')
    toggleClass(test,'modifyStyle')
    if (flag === true) {
      flag = false
    }else{
      flag = true
    }
  }

  //feature绘制结束
  drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function (drawEvent) {
    var feature = drawEvent.feature
    currentFeature = feature

    //////////////////
    if (flag && feature.geometry.geometryType === 'polygon') {
      var g1 = convertToJstsGeometry(feature.geometry)
      var g2 = convertToJstsGeometry(polygon1)

      var differenceResult = g1.difference(g2)

      var geometries = []
      if (differenceResult.geometries) {
        geometries = differenceResult.geometries
      } else {
        geometries.push({shell: differenceResult.shell})
      }

      for (var i = 0; i < geometries.length; i++) {
        var geometryItem = geometries[i]

        var coords = geometryItem.shell.points.coordinates

        var newCoords = []
        coords.forEach(function (g) {
          newCoords.push([g.x, g.y])
        })

        var clipedPolygon = new Datatang.Polygon()
        clipedPolygon.setCoordinates(newCoords)

        var clipedFeature = new Datatang.Feature(clipedPolygon)

        featureLayer.addFeature(clipedFeature)
        featureLayer.removeFeature(feature)
      }
    }else{
      /////////////////
      var geometry = feature.geometry
      overlay.position = geometry.getFormShowPosition()
      currentFeature = feature
      formClose(true)

      gometrytypeSpan.innerHTML = geometry.geometryType
    }
  })

  var geometryFactory = null;
  function convertToJstsGeometry(geometry) {
    if (geometryFactory === null) {
      geometryFactory = new jsts.geom.GeometryFactory();
    }

    return convertToPolygon(geometry)
  }

  function convertToPolygon (polygon) {
    const linearRings = polygon.getCoordinates()


    var coordinates = []
    linearRings.forEach(function(point){
      coordinates.push(new jsts.geom.Coordinate(point[0], point[1]))
    })

    return geometryFactory.createPolygon(coordinates)
  }

  //清空功能
  var btn_clear = document.getElementById('btnClear')
  btn_clear.onclick = function () {
    featureLayer.clear()
  }

  //显示隐藏图形
  var sHidegly = document.getElementById('sHidegly')
  sHidegly.onclick = function () {
    if(this.text.replace(/(^\s*)|(\s*$)/g,"") == "隐藏图形"){
      this.text = '显示图形'
      this.innerHTML = '<i class="glyphicon glyphicon-eye-open"></i> 显示图形'
      var features = featureLayer.features
      features.forEach (function (item) {
        item.display = false
      })
    }else{
      this.text = '隐藏图形'
      this.innerHTML = '<i class="glyphicon glyphicon-eye-close"></i> 隐藏图形'
      var features = featureLayer.features
      features.forEach (function (item) {
        item.display = true
      })
    }

  }

  //显示隐藏标签
  var sHidetag = document.getElementById('sHidetag')
  sHidetag.onclick = function () {
    if(this.text.replace(/(^\s*)|(\s*$)/g,"") == "隐藏标签"){
      this.text = '显示标签'
      this.innerHTML = '<i class="glyphicon glyphicon-eye-open"></i> 显示标签'
      var features = featureLayer.features
      features.forEach (function (item) {
        item.textDisplay = false
      })
    }else{
      this.text = '隐藏标签'
      this.innerHTML = '<i class="glyphicon glyphicon-eye-close"></i> 隐藏标签'
      var features = featureLayer.features
      features.forEach (function (item) {
        item.textDisplay = true
      })
    }

  }

  //保存数据到数据库
  var saveData = document.getElementById('saveData')
  saveData.onclick = function () {
    var features = featureLayer.features
    var result = Datatang.GeoJSON.write(features)
    console.log(JSON.stringify(result))
  }


  var sumCategory = function () {
    var categorylist = {},
      J_count_total = 0,
      J_count_totalRects = 0,
      J_count_totalPolygons = 0,
      J_count_totalLines = 0,
      J_count_totalPoints = 0;
    var curPainterList = featureLayer.features;
    if(curPainterList !== undefined && curPainterList !== null){
      curPainterList.forEach(function(item){
        var category = item.geometry.geometryType;
        switch(category){
          case "extent":
            J_count_totalRects++;
            break;
          case "polygon":
            J_count_totalPolygons++;
            break;
          case "line":
            J_count_totalLines++;
            break;
          case "point":
            J_count_totalPoints++;
            break;
          default:
            break;
        }
      });
    }
    J_count_total = J_count_totalPoints + J_count_totalLines + J_count_totalPolygons + J_count_totalRects

    categorylist = {
      J_count_total: {
        title: "图形总数",
        value: J_count_total
      },
      J_count_totalRects: {
        title: "矩形总数",
        value: J_count_totalRects
      },
      J_count_totalPolygons: {
        title: "多边形总数",
        value: J_count_totalPolygons
      },
      J_count_totalLines: {
        title: "线总数",
        value: J_count_totalLines
      },
      J_count_totalPoints: {
        title: "点总数",
        value: J_count_totalPoints
      }
    };
    return categorylist;
  }

  //统计图形个类别框数
  var doStatic = function () {
    var categorylist = sumCategory()
    var $staticContainer = document.getElementById('staticContainer')
    var template = '<p class="item"><span class="key">  {0:key}</span><span class="value">{1:value}</span></p>'
    var html = '';

    for (key in categorylist) {
      html += template.replace('{0:key}', categorylist[key].title + "： ").replace("{1:value}", categorylist[key].value || 0);
    }

    $staticContainer.innerHTML = html
  }

  //feature 集合变化时，统计feature
  featureLayer.addEventListener(Datatang.FeatureEvent.EventType.FEATURE_COLLECTION_CHANGED, function () {
    doStatic()
    bindJson()
  })

  //导航
  var bindJson = function () {
    document.getElementById('cloth-area').innerHTML = ''
    PainerList = featureLayer.features

    PainerList.forEach(function(obj, index) {
      document.getElementById('cloth-area').innerHTML += '<li id="J_navitem_' +  obj.id + '" class="nav-item" data-status="false">' +
        '<span class="index">' + (index + 1) + '</span>' +
        '<span class="sep"> - </span>' +
        '<span class="title">' + obj.id + '</span>' +
        '<span class="close">x</span>' +
        '</li>';
    });
  }

  //初始化
  doStatic()
  bindJson()


}