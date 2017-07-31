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
  
  // 示例：回车键结束绘制
  var finishCondition = function (event) {
    return event.keyCode === 13
    // return event.keyCode === 32
  }
  
  // 示例：ESC键撤销上一步绘制
  var undoCondition = function(event) {
    return event.keyCode === 27
  }
  
  // 绘图工具
  var drawTool = new Datatang.Draw({
    type: 'point',
    drawLayer: flayer,
    maxLinePoints: 5,
    maxPolygonPoints:8,
    finishCondition: finishCondition,
    undoCondition: undoCondition
  })
  
  map.addComponents(drawTool)
  
  var typeSelect = document.getElementById('type')
  
  /**
   * Handle change event.
   */
  typeSelect.onchange = function() {
    drawTool.drawMode = typeSelect.value
  }
}