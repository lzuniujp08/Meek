/**
 * Created by zhangyong on 2017/3/20.
 */
import GeometryRender from '../render/GeomertyRender'
import {Transform} from '../../data/matrix/Transform'
import {colorToString} from '../../utils/Helpers'
import Extent from '../../geometry/Extent'

export default class PolygonRender extends GeometryRender {
  
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
    let geometryCoordinages = geometry.getCoordinates()
    
    // TODO need to remove this data structure for polygon
    if (geometry instanceof Extent) {
      geometryCoordinages = geometryCoordinages[0]
    }
  
    if (!geometryCoordinages) {
      return
    }
    
    geometryCoordinages.forEach(function(points){
      let coordinate = transform2D(
        points, 0, points.length, 2,
        transform)
  
      coordinate[0] = (coordinate[0] + 0.5 ) | 0
      coordinate[1] = (coordinate[1] + 0.5 ) | 0
      
      coordinates.push(coordinate)
    })
    
    const len = styleArray.length
    for(let i = 0; i < len ; i ++){
      let styleObj = styleArray[i]
    
      let renderOptions = {
        coordinates: [coordinates],
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
  
    ctx.closePath()
    
    const borderStyle = renderOpt.borderStyle
    if (borderStyle) {
      ctx.strokeStyle = colorToString(borderStyle.color,borderStyle.alpha)
      ctx.lineWidth = borderStyle.width
    
      if (borderStyle.lineDash) {
        ctx.setLineDash(borderStyle.lineDash)
      }
    
      ctx.stroke()
    }
    
    ctx.restore()
  }
  
}