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
    // if (geometry instanceof Extent) {
    //   geometryCoordinages = geometryCoordinages
    // }
  
    if (!geometryCoordinages) {
      return false
    }
    
    if (geometryCoordinages.length === 0) {
      return false
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
        coordinates: coordinates,
        fillStyle: colorToString(styleObj.color,styleObj.alpha),
        borderStyle: styleObj.borderStyle
      }
    
      this.drawPolygon(ctx, renderOptions)
    }
    
    return true
  }
  
  /**
   * Draw a polygon
   * @param ctx
   * @param renderOpt
   */
  drawPolygon (ctx, renderOpt) {
    ctx.save()
  
    ctx.beginPath()
  
    const coordinates = renderOpt.coordinates
    ctx.moveTo(coordinates[0][0],coordinates[0][1])
    
    for(let k = 0, kk = coordinates.length ; k < kk ; k ++){
      let cd = coordinates[k]
      ctx.lineTo(cd[0],cd[1])
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