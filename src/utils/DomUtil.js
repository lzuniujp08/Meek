/**
 * Created by zhangyong on 2017/3/17.
 */

export function createCanvasContext2D (optWidth, optHeight) {
  let canvas = document.createElement('CANVAS')
  if (optWidth) {
    canvas.width = optWidth
  }
  
  if (optHeight) {
    canvas.height = optHeight
  }
  
  return canvas.getContext('2d')
}

export default {
  createCanvasContext2D
}
