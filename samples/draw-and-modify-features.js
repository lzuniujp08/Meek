/**
 * Created by zhangyong on 2017/6/9.
 */



var drawTool,
    modifyTool;

var drawlayer ;


window.onload = function () {
  
  // 将会获取缺省样式
  var drawlayer = new Datatang.FeatureLayer()
  
  var extent = [0, 0, 1024, 968];
  
  var map = new Datatang.Map({
    layers: [
      new Datatang.SingleImageLayer({
        url: 'source/Tulips.jpg',
        imageExtent: extent,
        projection: {
          extent: extent
        }
      }),
      drawlayer
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
  drawTool = new Datatang.DrawCpt({
    type: 'point',
    drawLayer: drawlayer
  });
  
  
  modifyTool = new Datatang.ModifyCpt({
    features: drawlayer.features
  });
  
  map.addComponents(drawTool)
  map.addComponents(modifyTool)
  
  var typeSelect = document.getElementById('type')
  
  /**
   * Handle change event.
   */
  typeSelect.onchange = function() {
    drawTool.active = true;
    drawTool.drawMode = typeSelect.value
  }
  
}
