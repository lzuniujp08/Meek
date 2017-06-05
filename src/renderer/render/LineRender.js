/**
 * Created by zhangyong on 2017/3/20.
 */
import GeometryRender from '../render/GeomertyRender'

import {colorToString} from '../../utils/Helpers'
import {Transform} from '../../data/matrix/Transform'

export default class LineRender extends GeometryRender {
  
  constructor (context) {
    super(context)
  }
  
  render (feature, transform) {
    if (!feature) {
      return
    }
  
    const ctx = this.context
    const styleArray = feature.style
    const geometry = feature.geometry
  
    
    const  transform2D =  Transform.transform2D
    const coordinates = []
    geometry.path.forEach(function(points){
      let coordinate = transform2D(
        points, 0, points.length, 2,
        transform)
      
      coordinates.push(coordinate)
    })
    
    const len = styleArray.length
    for(let i = 0; i < len ; i ++){
      let styleObj = styleArray[i]
    
      let renderOptions = {
        coordinates: coordinates,
        width: styleObj.width,
        strokeStyle: colorToString(styleObj.color,styleObj.alpha),
        lineCap: styleObj.lineCap,
        lineJion: styleObj.lineJion,
        miterLimit: styleObj.miterLimit
      }
      
      this.drawLine(ctx, renderOptions)
    }
  }
  
  drawLine (ctx, renderOpt) {
    ctx.save()
    ctx.strokeStyle = renderOpt.strokeStyle
    ctx.lineWidth = renderOpt.width
  
    ctx.lineCap = renderOpt.lineCap
    ctx.lineJoin = renderOpt.lineJion
    ctx.miterLimit = renderOpt.miterLimit
  
    ctx.beginPath()
    const coordinates = renderOpt.coordinates
    for(let i = 0,ii = coordinates.length ; i < ii - 1 ; i++){
      ctx.moveTo(coordinates[i][0],coordinates[i][1])
      ctx.lineTo(coordinates[i + 1][0],coordinates[i + 1][1])
    }
  
    ctx.stroke()
    
    ctx.closePath()
    ctx.restore()
  }
  
  
  
  
}