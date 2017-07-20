/**
 * Created by zhangyong on 2017/6/30.
 */



// 将会获取缺省样式
var flayer = new Datatang.FeatureLayer()

var container = document.getElementById('popup')
var closeDom = document.getElementById('popup-closer')
var popup = document.getElementById('popup')
var gometrytypeSpan = document.getElementById('gometrytypeSpan')

var extent = [0, 0, 2783, 2125];
var overlay = new Datatang.Overlay(({
  element: container,
  autoPan: true
}))

var map = new Datatang.Map({
  layers: [
    new Datatang.SingleImageLayer({
      url: 'source/China_map.jpg',
      imageExtent: extent,
      projection: {
        extent: extent
      }
    }),
    flayer
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
});

// 绘图工具
var drawTool = new Datatang.Draw({
  type: 'point',
  drawLayer: flayer
})

map.addComponents(drawTool)

var select = new Datatang.Select()
map.addComponents(select)
select.active = false

// add select-end event linstener
select.addEventListener(Datatang.SelectEvent.EventType.SELECT, function(event) {
  var features = event.selectedFeatures
  if (features.length === 0) {
    return
  }

  var feature = features[0]
  var geometry = feature.geometry

  overlay.position = geometry.getFormShowPosition()
  currentFeature = feature
  formClose(true)

  gometrytypeSpan.innerHTML = geometry.geometryType


})

var modifyTool = new Datatang.Modify()

select.addEventListener(Datatang.SelectEvent.EventType.SELECT, function(event) {
  modifyTool.features = event.selectedFeatures
})

map.addComponents(modifyTool)


var typeSelect = document.getElementById('type')

/**
 * Handle change event.
 */
typeSelect.onchange = function() {
  if(typeSelect.value === "None"){
    drawTool.active = false
    select.active = true
    modifyTool.active = true
  }else {
    select.active = false
    modifyTool.active = false
    drawTool.drawMode = typeSelect.value
  }
}

var currentFeature = null

drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function(drawEvent){
  var feature = drawEvent.feature
  var geometry = feature.geometry

  overlay.position = geometry.getFormShowPosition()
  currentFeature = feature
  formClose(true)

  gometrytypeSpan.innerHTML = geometry.geometryType
})


function onSubmitClick() {
  var text = document.getElementById('textIpt').value

  var brIpt = document.getElementById('BRIpt').value
  var bgIpt = document.getElementById('BGIpt').value
  var bbIpt = document.getElementById('BBIpt').value
  // var baIpt = document.getElementById('BAIpt').value
  var frIpt = document.getElementById('FRIpt').value
  var fgIpt = document.getElementById('FGIpt').value
  var fbIpt = document.getElementById('FBIpt').value
  // var faIpt = document.getElementById('FAIpt').value

  var featureStyle = flayer.styleFunction(currentFeature)[0].clone()

  var textStyle
  if (!featureStyle.textStyle) {
    textStyle = new Datatang.TextStyle({
      text: text,
      fill: [frIpt, fgIpt, fbIpt],
      stroke: new Datatang.LineStyle([brIpt, bgIpt, bbIpt],1,1,
        Datatang.LineStyle.LineCap.ROUND,
        Datatang.LineStyle.LineJion.ROUND),
    })
  } else {
    textStyle = featureStyle.textStyle.clone()
    textStyle.text = text
    textStyle.fill =  [frIpt, fgIpt, fbIpt]
    textStyle.stroke.color = [brIpt, bgIpt, bbIpt]
  }

  featureStyle.textStyle = textStyle
  currentFeature.displayText = text
  currentFeature.style = [featureStyle]
  currentFeature.styleHighLight = true


  formClose(false)
  map.render()
}

function formClose(display) {
  display ? popup.style.display = 'block' : popup.style.display = 'none'
}

function onFormClosedClick(e){
  formClose(false)
}


function onEditBtnClick(){
  drawTool.active = false
  select.active = true
}
