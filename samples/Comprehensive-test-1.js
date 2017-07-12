var drawTool,
  selectTool,
  modifyTool;
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
  var typeSelect = document.getElementsByClassName('btn-tool')
  for (var i = 0, ii = typeSelect.length; i < ii; i++) {
    typeSelect[i].onclick = function () {

      var val = this.getAttribute('data-tool-class')
      if (val === "None") {
        drawTool.active = false
        selectTool.active = true
        modifyTool.active = true
      } else {

        selectTool.selectClean()

        drawTool.active = true
        drawTool.drawMode = val
        selectTool.active = false
        modifyTool.active = false
      }
    }
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

  /** ondrawend **/
  var currentFeature = null

  drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function (drawEvent) {
    var feature = drawEvent.feature
    var geometry = feature.geometry

    overlay.position = geometry.getFormShowPosition()
    currentFeature = feature
    formClose(true)

    gometrytypeSpan.innerHTML = geometry.geometryType
  })

  function formClose(display) {
    display ? J_mark_form.style.display = 'block' : J_mark_form.style.display = 'none'
  }

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

}