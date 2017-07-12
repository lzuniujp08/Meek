var drawTool,
  selectTool,
  modifyTool,
  flag = false;
window.onload = function () {
  var Fortesting = new Datatang.FeatureLayer()
  var extent = [0, 0, 1280, 800]

  var container = document.getElementById('J_mark_form')

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
      Fortesting
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
    drawLayer: Fortesting
  });
  modifyTool = new Datatang.Modify({
    features: Fortesting.features
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
  var typeSelect = document.getElementsByClassName('btn-tool')
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

  //表单提交
  var J_form_submit = document.getElementById('J_form_submit')
  J_form_submit.onclick = function () {
    var text = document.getElementById('J_tree_view').value
    var featureStyle = Fortesting.styleFunction(currentFeature)[0].clone()

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
  }


// add select-end event linstener
  selectTool.addEventListener(Datatang.SelectEvent.EventType.SELECT, function (event) {
    var features = event.selectedFeatures
    if (features.length === 0) {
      return
    }

    var feature = features[0]
    var geometry = feature.geometry

    overlay.position = geometry.getFormShowPosition()
    document.getElementById('J_tree_view').value = 1
    currentFeature = feature
    formClose(true)

    gometrytypeSpan.innerHTML = geometry.geometryType


  })

  selectTool.addEventListener(Datatang.SelectEvent.EventType.SELECT, function (event) {
    modifyTool.features = event.selectedFeatures
  })

  // 多边形
  var rings = [[100,180],[290,500],[455, 620], [600,680],[800,680],[100,180]]
  var polygon1 = new Datatang.Polygon(rings)
  var feature1 = new Datatang.Feature(polygon1)

  Fortesting.addFeature(feature1)
  //end

  /** ondrawend **/
  var currentFeature = null

  var clip = document.getElementById('clip')
  clip.onclick = function () {
    if (flag === true) {
      flag = false
    }else{
      flag = true
    }
  }

  drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function (drawEvent) {
    var feature = drawEvent.feature

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

        Fortesting.addFeature(clipedFeature)
        Fortesting.removeFeature(feature)
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

}