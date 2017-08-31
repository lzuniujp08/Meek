/**
 * Created by zhangyong on 2017/3/17.
 */

import Geometry from '../geometry/geometry'
import FillStyle from './fillstyle'
import LineStyle from './linestyle'
import PointStyle from './pointstyle'

export const Style = {}

/**
 * 设置缺省图形style
 *
 * Create a defaut style for feature layer
 * @returns {null|Array|[*]}
 */
Style.defaultFunction = function () {
  if (!Style._default) {
    const white = [255, 255, 255]
    const blue = [0, 153, 255]
    const width = 1.5
  
    Style._default = {}
    
    // 面样式 polygon style
    Style._default[Geometry.POLYGON] = [
      new FillStyle(white, new LineStyle(blue, 1, 1.25), 0.2)
    ]
    Style._default[Geometry.MULTI_POLYGON] = Style._default[Geometry.POLYGON]
    Style._default[Geometry.PARALLELOGRAM] = Style._default[Geometry.POLYGON]
    
    // same as polygon style
    Style._default[Geometry.EXTENT] = Style._default[Geometry.POLYGON]
  
    // 线样式 line style
    Style._default[Geometry.LINE] = [
      new LineStyle(blue, 1, width, LineStyle.LineCap.ROUND, LineStyle.LineJion.ROUND)// 内框
    ]
  
    // 点样式 point style
    Style._default[Geometry.POINT] = [new PointStyle(10,white,1,new LineStyle(blue,1,width))]
    
  }
  
  return Style._default
}

/**
 * Create a default style while drawing
 * @returns {{}}
 */
Style.createDefaultEditing = function () {
  const styles = {}
  const white = [255, 255, 255]
  const blue = [0, 153, 255]
  const width = 1.5
  
  // 面样式
  styles[Geometry.POLYGON] = [
    new FillStyle(white,// 填充
    new LineStyle(blue,1,1)// 边框
    ,0.2)
  ]
  styles[Geometry.MULTI_POLYGON] = styles[Geometry.POLYGON]
  styles[Geometry.EXTENT] = styles[Geometry.POLYGON]
  styles[Geometry.PARALLELOGRAM] = styles[Geometry.POLYGON]
    
  // 线样式
  styles[Geometry.LINE] = [
    new LineStyle(white,1,width + 1.5,LineStyle.LineCap.ROUND,LineStyle.LineJion.ROUND),// 外框
    new LineStyle(blue,1,width,LineStyle.LineCap.ROUND,LineStyle.LineJion.ROUND)// 内框
  ]
  styles[Geometry.MULTI_LINE] = styles[Geometry.LINE]
  
  // 点样式
  styles[Geometry.POINT] = [new PointStyle(10, white, 0.1, new LineStyle(blue, 1, 2))]
  styles[Geometry.MULTI_POINT] = styles[Geometry.POINT]
  
  return styles
}

/**
 *
 * @returns {{}}
 */
Style.createDefaultSelecting = function () {
  const styles = {}
  const white = [255, 255, 255]
  const blue = [0, 153, 255]
  const width = 3
  const outsideLine = new LineStyle(white,1,width + 2,LineStyle.LineCap.ROUND,LineStyle.LineJion.ROUND)// 外框
  const insideLine = new LineStyle(blue,1,width,LineStyle.LineCap.ROUND,LineStyle.LineJion.ROUND)
  // 面样式
  styles[Geometry.POLYGON] = [
    new FillStyle(white, outsideLine,0.5),

    new FillStyle(white, insideLine,0)
  ]
  styles[Geometry.MULTI_POLYGON] = styles[Geometry.POLYGON]
  styles[Geometry.EXTENT] = styles[Geometry.POLYGON]
  
  // 线样式
  styles[Geometry.LINE] = [
    outsideLine,// 外框
    insideLine// 内框
  ]
  styles[Geometry.MULTI_LINE] = styles[Geometry.LINE]
  
  // 点样式
  styles[Geometry.POINT] = [new PointStyle(12,blue,1,new LineStyle(blue,1,1))]
  styles[Geometry.MULTI_POINT] = styles[Geometry.POINT]
  
  return styles
}

/**
 * Convert the passed obj into a style function.
 *
 * @param obj
 * @returns {*}
 */
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


export default {
  Style
}



