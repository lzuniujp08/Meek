/**
 * Created by zypc on 2017/6/4.
 */
/**
 * Created by zhangyong on 2017/5/23.
 */

window.onload = function () {
  
  var point = new Datatang.Point(200,700)
  
  var path = [[400,200],[500,300],[500,50],[80,600]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[[500,400],[490,478],[350,350],[500,400]]]
  var polygon = new Datatang.Polygon(rings)
  
  var extent = new Datatang.Extent(1100, 300, 1400, 600)
  
  var features = [new Datatang.Feature(point),
    new Datatang.Feature(line),
    new Datatang.Feature(polygon),
    new Datatang.Feature(extent)]
  
  // 将会获取缺省样式
  var tempLayer = new Datatang.FeatureLayer({features: features})
  var map = new Datatang.Map({
    layers: [tempLayer],
    target: 'map'
  })

  var dragPan = new Datatang.DragPanCpt({
    kinetic: new Datatang.Kinetic(-0.005, 0.05, 100)
  })
  
  map.addComponents(dragPan)

}
