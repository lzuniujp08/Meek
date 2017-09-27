/**
 * Created by zhangyong on 2017/3/20.
 */
import GeometryRender from '../render/geomertyrender'

import {colorToString} from '../../utils/helpers'
import {Transform} from '../../data/matrix/transform'

export default class LineRender extends GeometryRender {
  
  constructor (context) {
    super(context)
  }
  
  /**
   *
   * @param feature
   * @param renderStyle
   * @param transform
   */
  render (feature, renderStyle, transform) {
    if (!feature) {
      return
    }
  
    const ctx = this.context
    const styleArray = renderStyle
    const geometry = feature.geometry
  
    const transform2D =  Transform.transform2D
    let coordinates = []
    // TODO find a way to cache the rendered data
    if (this._pixelCoordinates &&
        this.equalsTransform(transform, this.renderedTransform)) {
      coordinates = this._pixelCoordinates
      // console.log('get the rendered data from chche for line')
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
      // console.log('caclulate the rendered data for line')
    }
    
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
        // hasDash: styleObj.style === LineStyle.DASH ? true : false
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
    for (let i = 0,ii = coordinates.length ; i < ii - 1 ; i++) {
      ctx.moveTo(coordinates[i][0],coordinates[i][1])
      ctx.lineTo(coordinates[i + 1][0],coordinates[i + 1][1])
    }
  
    ctx.stroke()
    
    ctx.closePath()
    ctx.restore()
  }
}