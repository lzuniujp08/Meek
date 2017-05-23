/**
 * Created by zhangyong on 2017/5/23.
 */

window.onload = function () {
  
  // 将会获取缺省样式
  var flayer = new Datatang.FeatureLayer()
  
  var map = new Datatang.Map({
    layers: [flayer],
    target: 'map'
  })
  
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
