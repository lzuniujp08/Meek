/**
 * Created by zhangyong on 2017/3/17.
 */


import Geometry from '../geometry/Geometry'
import FillStyle from './FillStyle'
import LineStyle from './LineStyle'
import PointStyle from './PointStyle'

export const Style = {}

Style._default = null


/**
 * 设置缺省图形style
 * @returns {null|Array|[*]}
 */
Style.defaultFunction = function () {
  if (!Style._default) {
    const white = [255, 255, 255]
    const blue = [0, 153, 255]
    const width = 1.5
  
    Style._default = {}
    
    // 面样式
    Style._default[Geometry.POLYGON] = [
      new FillStyle(white,new LineStyle(blue,1,1.25),0.5,10)
    ]
  
    // 线样式
    Style._default[Geometry.LINE] = [
      new LineStyle(blue,1,width,LineStyle.LineCap.ROUND,LineStyle.LineJion.ROUND)// 内框
    ]
  
    // 点样式
    Style._default[Geometry.POINT] = [new PointStyle(10,white,1,new LineStyle(blue,1,width))]
    
  }
  
  return Style._default
}

/**
 *
 * @returns {{}}
 */
Style.createDefaultEditing = function () {
  const styles = {}
  const white = [255, 255, 255]
  const blue = [0, 153, 255]
  const width = 3
  
  // 面样式
  styles[Geometry.POLYGON] = [
    new FillStyle(white,// 填充
    new LineStyle(blue,1,1)// 边框
    ,0.5
    ,1)
  ]
  styles[Geometry.MULTI_POLYGON] = styles[Geometry.POLYGON]
    
  // 线样式
  styles[Geometry.LINE] = [
    new LineStyle(white,1,width + 2,LineStyle.LineCap.ROUND,LineStyle.LineJion.ROUND),// 外框
    new LineStyle(blue,1,width,LineStyle.LineCap.ROUND,LineStyle.LineJion.ROUND)// 内框
  ]
  styles[Geometry.MULTI_LINE] = styles[Geometry.LINE]
  
  // 点样式
  styles[Geometry.POINT] = [new PointStyle(12,blue,1,new LineStyle(white,1,1))]
  styles[Geometry.MULTI_POINT] = styles[Geometry.POINT]
  
  return styles
}

Style.createFunction = function(obj) {
  let styleFunction
  
  if (typeof obj === 'function') {
    styleFunction = obj
  } else {
    let styles
    
    if (Array.isArray(obj)) {
      styles = obj
    } else {
      styles = [obj]
    }
    
    styleFunction = function(feature) {
      return styles[0][feature.geometry.geometryType]
    }
  }
  
  return styleFunction
}



