/**
 * Created by zhangyong on 2017/5/23.
 */

window.onload = function () {
  
  // 将会获取缺省样式
  var flayer = new Datatang.FeatureLayer()
  
  var extent = [0, 0, 1024, 968];
  
  var map = new Datatang.Map({
    layers: [
      new Datatang.SingleImageLayer({
        url: 'source/online_communities.png',
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
  var drawTool = new Datatang.DrawCpt({
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
  
}
