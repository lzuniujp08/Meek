/**
 * Created by zypc on 2016/11/13.
 */


/**
 * 将rbg数组装换成rgba的字符串格式
 * @param color rgb数组
 * @param alpha 透明度
 * @returns {string} 返回rgba格式字符串
 */
export function colorToString(color,alpha = 1){
  let r = color[0]
  if (r != (r | 0)) {
    r = (r + 0.5) | 0
  }
  
  let g = color[1]
  if (g != (g | 0)) {
    g = (g + 0.5) | 0
  }
  
  let b = color[2]
  if (b != (b | 0)) {
    b = (b + 0.5) | 0
  }
  
  return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')'
}

export default {
  colorToString
}