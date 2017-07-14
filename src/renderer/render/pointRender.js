/**
 * Created by zhangyong on 2017/3/20.
 */
import GeometryRender from '../render/geomertyrender'

import {colorToString} from '../../utils/helpers'
import {Transform} from '../../data/matrix/transform'

export default class PointRender extends GeometryRender {
  
  constructor (context) {
    super(context)
  
    this._pixelCoordinates = []
  }
  
  /**
   * Render a point
   * @param feature
   * @param transform
   */
  render (feature, renderStyle, transform) {
    if(!feature){
      return
    }
    
    const ctx = this.context
    const styleArray = renderStyle
    const geomerty = feature.geometry
  
    const coordinates = [geomerty.x, geomerty.y]

    // TODO  Should be cached
    const pixelCoordinates = Transform.transform2D(
      coordinates, 0, coordinates.length, 2,
      transform, this._pixelCoordinates)
    
    const x = pixelCoordinates[0]
    const y = pixelCoordinates[1]
    
    const len = styleArray.length
    for(let i = 0; i < len ; i ++){
      let styleObj = styleArray[i]
      
      let renderOptions = {
        centerX: (x + 0.5) | 0,
        centerY: (y + 0.5) | 0,
        radius: styleObj.size / 2 || styleObj.borderStyle.width / 2,
        fillStyle: colorToString(styleObj.color,styleObj.alpha),
        borderStyle: styleObj.borderStyle
      }
      
      this.drawCircle(ctx,renderOptions)
    }
    
  }
  
  drawCircle (ctx,renderOptions) {
    // console.log('类型为圆，开始绘制圆')
    ctx.save()
    ctx.beginPath()
    ctx.arc(renderOptions.centerX, renderOptions.centerY,
            renderOptions.radius, 0, 2 * Math.PI, true)
  
    if (renderOptions.fillStyle) {
      ctx.fillStyle = renderOptions.fillStyle
      ctx.fill()
    }
    
    const borderStyle = renderOptions.borderStyle
    if (borderStyle) {
      ctx.strokeStyle = colorToString(borderStyle.color,borderStyle.alpha)
      ctx.lineWidth = borderStyle.width

      if (borderStyle.lineDash) {
        ctx.setLineDash(borderStyle.lineDash)
      }

      ctx.stroke()
    }
    
    ctx.closePath()
    ctx.restore()
  }
}