/**
 * Created by zhangyong on 2017/3/20.
 */
import GeometryRender from '../render/GeomertyRender'

import {colorToString} from '../../utils/Helpers'

export default class PolygonRender extends GeometryRender {
  
  constructor (context) {
    super(context)
  }
  
  render (feature) {
    if (!feature) {
      return
    }
  
    const ctx = this.context
    const styleArray = feature.style
    const geometry = feature.geometry
    const len = styleArray.length
    for(let i = 0; i < len ; i ++){
      let styleObj = styleArray[i]
    
      let renderOptions = {
        coordinates: geometry.rings,
        fillStyle: colorToString(styleObj.color,styleObj.alpha),
        borderStyle: styleObj.borderStyle
      }
    
      this.drawPolygon(ctx, renderOptions)
    }
  }
  
  drawPolygon (ctx, renderOpt) {
    ctx.save()
  
    ctx.beginPath()
  
    const coordinates = renderOpt.coordinates
    for(let k = 0, kk = coordinates.length ; k < kk ; k ++){
      let cd = coordinates[k]
  
      ctx.moveTo(cd[0][0],cd[0][1])
      for(let i = 1,ii = cd.length ; i < ii - 1 ; i++){
        ctx.lineTo(cd[i][0],cd[i][1])
      }
    }
  
    if (renderOpt.fillStyle) {
      ctx.fillStyle = renderOpt.fillStyle
      ctx.fill()
    }
  
    const borderStyle = renderOpt.borderStyle
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