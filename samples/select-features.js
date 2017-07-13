/**
 * Created by zhangyong on 2017/5/23.
 */

window.onload = function () {
  
  var point = new Datatang.Point(900,500)
  
  var path = [[400,200],[500,300],[500,50],[80,600]]
  var line = new Datatang.Line()
  line.path = path
  
  var rings = [[500,400],[490,478],[350,350],[500,400]]
  var polygon = new Datatang.Polygon(rings)
  
  var extent = new Datatang.Extent(1100, 300, 1400, 600)
  
  var features = [new Datatang.Feature(point),
    new Datatang.Feature(line),
    new Datatang.Feature(polygon),
    new Datatang.Feature(extent)]
  
  // 将会获取缺省样式
  var selectLayer = new Datatang.FeatureLayer()
  selectLayer.style = createDefaultSelecting()
  //var selectLayer = createDefaultSelecting()
  
  var mapextent = [0, 0, 1024, 968];
  
  var map = new Datatang.Map({
    layers: [
      selectLayer
    ],
    target: 'map',
    view: new Datatang.View({
      projection: {
        extent: mapextent
      },
      center: Datatang.ExtentUtil.getCenter(mapextent),
      zoom: 2,
      maxZoom: 8
    })
  });
  
  selectLayer.addFeatures(features)
  
  // 选择工具
  var selectTool = new Datatang.Select({
    selectMode: Datatang.BrowserEvent.SINGLE_CLICK
  })

  map.addComponents(selectTool)
  
  var typeSelect = document.getElementById('type')
  
  /**
   * Handle change event.
   */
  typeSelect.onchange = function() {
    selectTool.selectMode = typeSelect.value
  }
  
}




function createDefaultSelecting() {
  const styles = {}
  const black = [0, 0, 0]
  const red = [255, 0, 0]
  const width = 3
  const outsideLine = new Datatang.LineStyle(black,1,width + 5,Datatang.LineStyle.LineCap.ROUND,Datatang.LineStyle.LineJion.ROUND)// 外框
  const insideLine = new Datatang.LineStyle(red,1,width,Datatang.LineStyle.LineCap.ROUND,Datatang.LineStyle.LineJion.ROUND)

  // 面样式
  styles[Datatang.Geometry.POLYGON] = [
    new Datatang.FillStyle(black, outsideLine,0.5),
    new Datatang.FillStyle(black, insideLine,0)
  ]
  styles[Datatang.Geometry.MULTI_POLYGON] = styles[Datatang.Geometry.POLYGON]
  styles[Datatang.Geometry.EXTENT] = styles[Datatang.Geometry.POLYGON]

  // 线样式
  styles[Datatang.Geometry.LINE] = [
    outsideLine,// 外框
    insideLine// 内框
  ]
  styles[Datatang.Geometry.MULTI_LINE] = styles[Datatang.Geometry.LINE]

  // 点样式
  styles[Datatang.Geometry.POINT] = [new Datatang.PointStyle(12,red,1,new Datatang.LineStyle(red,1,1))]
  styles[Datatang.Geometry.MULTI_POINT] = styles[Datatang.Geometry.POINT]

  return styles
}
