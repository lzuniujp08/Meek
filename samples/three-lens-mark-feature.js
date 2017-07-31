var drawTool,
  selectTool,
  modifyTool,
  drawTool1,
  selectTool1,
  modifyTool1,
  drawTool2,
  selectTool2,
  modifyTool2;

window.onload = function (){
  var Fortesting = new Datatang.FeatureLayer()
  var Fortesting1 = new Datatang.FeatureLayer()
  var Fortesting2 = new Datatang.FeatureLayer()
  var extent = [0,0,1280,800]

  //随机添加i个点
  for(i = 0; i<=10; i++){
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

  var map1 = new Datatang.Map({
    layers:[new Datatang.SingleImageLayer({
      url : "source/IMG_6776.JPG",
      imageExtent :extent,
      projection:{
        extent: extent
      }
    }),
      Fortesting1
    ],
    target:'map1',
    view : new Datatang.View({
      projection:{
        extent:extent
      },
      center: Datatang.ExtentUtil.getCenter(extent),
      zoom: 2,
      maxZoom: 8
    })
  })

  var map2 = new Datatang.Map({
    layers:[new Datatang.SingleImageLayer({
      url : "source/China_map.jpg",
      imageExtent :extent,
      projection:{
        extent: extent
      }
    }),
      Fortesting2
    ],
    target:'map2',
    view : new Datatang.View({
      projection:{
        extent:extent
      },
      center: Datatang.ExtentUtil.getCenter(extent),
      zoom: 2,
      maxZoom: 8
    })
  })
  // First Components
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
  // Second Components
  drawTool1 = new Datatang.Draw({
    type: 'point',
    drawLayer: Fortesting1
  });

  modifyTool1 = new Datatang.Modify({
    features: Fortesting1.features
  });

  selectTool1 = new Datatang.Select({
    selectMode: Datatang.BrowserEvent.CLICK
  });

  // Third Components
  drawTool2 = new Datatang.Draw({
    type: 'point',
    drawLayer: Fortesting2
  });

  modifyTool2 = new Datatang.Modify({
    features: Fortesting2.features
  });

  selectTool2 = new Datatang.Select({
    selectMode: Datatang.BrowserEvent.CLICK
  });

  map.addComponents(drawTool)
  map.addComponents(selectTool)
  map.addComponents(modifyTool)

  map1.addComponents(drawTool1)
  map1.addComponents(selectTool1)
  map1.addComponents(modifyTool1)

  map2.addComponents(drawTool2)
  map2.addComponents(selectTool2)
  map2.addComponents(modifyTool2)

  selectTool.active = false
  modifyTool.active = false

  selectTool1.active = false
  modifyTool1.active = false

  selectTool2.active = false
  modifyTool2.active = false

  var typeSelect = document.getElementById('type')
  var typeSelect1 = document.getElementById('type1')
  var typeSelect2 = document.getElementById('type2')

  typeSelect.onchange = function(){
    if(typeSelect.value === "None"){
      drawTool.active = false
      selectTool.active = true
      modifyTool.active = true
    }else{

      drawTool.active = true
      drawTool.drawMode = typeSelect.value
      selectTool.active = false
      modifyTool.active = false
    }
  }

  typeSelect1.onchange = function(){
    if(typeSelect1.value === "None"){
      drawTool1.active = false
      selectTool1.active = true
      modifyTool1.active = true
    }else{

      drawTool1.active = true
      drawTool1.drawMode = typeSelect1.value
      selectTool1.active = false
      modifyTool1.active = false
    }
  }

  typeSelect2.onchange = function(){
    if(typeSelect2.value === "None"){
      drawTool2.active = false
      selectTool2.active = true
      modifyTool2.active = true
    }else{

      drawTool2.active = true
      drawTool2.drawMode = typeSelect2.value
      selectTool2.active = false
      modifyTool2.active = false
    }
  }
}