window.onload = function () {

  var flayer = new Datatang.FeatureLayer()
  
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
      flayer
    ],
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
  
  var typeSelect = document.getElementById('type')
  
  /**
   * Handle change event.
   */
  typeSelect.onchange = function() {
    drawTool.drawMode = typeSelect.value
  }
  
  var tipDom1 = document.getElementById('starttip')
  drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_START,
    function(event){
    tipDom1.innerHTML = '开始绘制，当前绘制的是：' + event.feature.geometry.geometryType +
      '  他的ID为：' + event.feature.id;
  })
  
  var tipDom = document.getElementById('endtip')
  drawTool.addEventListener(Datatang.DrawEvent.EventType.DRAW_END,
    function(event){
      tipDom.innerHTML = '绘制完成，当前绘制的是：' + event.feature.geometry.geometryType +
        '  他的ID为：' + event.feature.id;
    })
}

