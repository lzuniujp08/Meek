/**
 * Created by zhangyong on 2017/6/7.
 */


export const Canvas = {}


/**
 *
 * @param context
 * @param rotation
 * @param offsetX
 * @param offsetY
 */
Canvas.rotateAtOffset = function(context, rotation, offsetX, offsetY) {
  if (rotation !== 0) {
    context.translate(offsetX, offsetY)
    context.rotate(rotation)
    context.translate(-offsetX, -offsetY)
  }
}



export default {
  Canvas
}