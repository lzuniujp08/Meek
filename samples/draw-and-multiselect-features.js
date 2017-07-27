/**
 * Created by guojing on 2017/6/19.
 */
var drawTool,
  selectTool,
  modifyTool;

window.onload = function (){
  var Fortesting = new Datatang.FeatureLayer()
  var extent = [0,0,1280,800]


  //随机添加i个点
  for(i = 0; i<=2; i++){
    var x = parseInt(Math.random()*1280)
    var y = parseInt(Math.random()*800)
    var point = new Datatang.Point(x,y)
    var features = [new Datatang.Feature(point)]
    Fortesting.addFeatures(features)
  }

  var map = new Datatang.Map({
    layers:[new Datatang.SingleImageLayer({
      url : "source/image01450.jpg",
      imageExtent :extent,
      projection:{
        extent: extent
      }
    }),
      Fortesting
    ],
    target:'map',
    view : new Datatang.View({
      projection:{
        extent:extent
      },
      center: Datatang.ExtentUtil.getCenter(extent),
      zoom: 2,
      maxZoom: 8
    })
  })

  //回车结束
  var finishCondition = function (event) {
    return event.keyCode === 13
  }

  var selectMultiMode = function (event){
    return event.keyCode === 17
  }

  drawTool = new Datatang.Draw({
    type: 'point',
    drawLayer: Fortesting,
    finishCondition :finishCondition
  });

  drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END, function(e){
    polyF = e.feature
  })

  modifyTool = new Datatang.Modify({
    features: Fortesting.features
  });

  selectTool = new Datatang.Select({
    selectMode: Datatang.BrowserEvent.CLICK,
    selectMultiMode: selectMultiMode
  });

  map.addComponents(drawTool)
  map.addComponents(selectTool)
  map.addComponents(modifyTool)
  selectTool.active = false
  modifyTool.active = false

  var typeSelect = document.getElementById('type')

  typeSelect.onchange = function(){
    if(typeSelect.value === "None"){
      drawTool.active = false
      selectTool.active = true
      modifyTool.active = true
    }else{

      selectTool.clear()

      drawTool.active = true
      drawTool.drawMode = typeSelect.value
      selectTool.active = false
      modifyTool.active = false
    }
  }

  var onZoominClick = document.getElementById('onZoominClick')

  onZoominClick.onclick = function() {
    const delta = 1
    let view = drawTool.map.view
    let opt_anchor = view.center
    const opt_duration = 250
    drawTool.zoomByDelta(view,delta,opt_anchor,opt_duration)
  }



  var onZoomoutClcik = document.getElementById('onZoomoutClcik')

  onZoomoutClcik.onclick = function() {
    const delta = -1
    let view = drawTool.map.view
    let opt_anchor = view.center
    const opt_duration = 250
    drawTool.zoomByDelta(view,delta,opt_anchor,opt_duration)
  }
}

var polyF

function onDrawClick () {
  if(polyF.styleHighLight) {
    polyF.styleHighLight = false
  }else{
    polyF.styleHighLight = true
  }
}
