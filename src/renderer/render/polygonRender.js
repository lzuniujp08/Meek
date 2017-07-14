/**
 * Created by zhangyong on 2017/3/20.
 */
import GeometryRender from '../render/geomertyrender'
import {Transform} from '../../data/matrix/transform'
import {colorToString} from '../../utils/helpers'
import Extent from '../../geometry/extent'

export default class PolygonRender extends GeometryRender {
  
  constructor (context) {
    super(context)
  }
  
  /**
   * Render a polygon
   * @param feature
   * @param transform
   * @returns {boolean}
   */
  render (feature, renderStyle, transform) {
    if (!feature) {
      return
    }
  
    const ctx = this.context
    const styleArray = renderStyle
    const geometry = feature.geometry
  
    const  transform2D =  Transform.transform2D
    let geometryCoordinages = geometry.getCoordinates()
    
    if (!geometryCoordinages) {
      return false
    }
    
    if (geometryCoordinages.length === 0) {
      return false
    }
  
    // TODO find a way to cache the rendered data
    let coordinates = []
    if (this._pixelCoordinates &&
      this.equalsTransform(transform, this.renderedTransform)) {
      coordinates = this._pixelCoordinates
      // console.log('get the rendered data from chche for polygon')
    } else {
      const geometryCoordinates = geometry.getCoordinates()
    
      geometryCoordinates.forEach(function(points){
        let coordinate = transform2D(
          points, 0, points.length, 2,
          transform)
      
        coordinate[0] = (coordinate[0] + 0.5 ) | 0
        coordinate[1] = (coordinate[1] + 0.5 ) | 0
      
        coordinates.push(coordinate)
      })
    
      this._pixelCoordinates = coordinates
      Transform.setFromArray(this.renderedTransform, transform)
      // console.log('caclulate the rendered data for polygon')
    }
    
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