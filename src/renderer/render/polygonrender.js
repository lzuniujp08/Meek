/**
 * Created by zhangyong on 2017/3/20.
 */
import Geometry from '../../geometry/geometry'
import GeometryRender from '../render/geomertyrender'
import {Transform} from '../../data/matrix/transform'
import {colorToString} from '../../utils/helpers'

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
    if (geometry.geometryType === Geometry.EXTENT) {
      geometryCoordinages = [geometryCoordinages]
    }
    
    if (!geometryCoordinages) {
      return false
    }
    
    if (geometryCoordinages.length === 0) {
      return false
    }
  
    // TODO find a way to cache the rendered data
    let coordinates = []
    let renderCoords = []
    
    if (this._pixelCoordinates &&
      this.equalsTransform(transform, this.renderedTransform)) {
      renderCoords = this._pixelCoordinates
    } else {
      // 遍历多边形各个环
      geometryCoordinages.forEach( rings => {
        rings.forEach(points => {
          let coordinate = transform2D(
            points, 0, points.length, 2,
            transform)
  
          coordinate[0] = (coordinate[0] + 0.5 ) | 0
          coordinate[1] = (coordinate[1] + 0.5 ) | 0
  
          coordinates.push(coordinate)
        })
  
        renderCoords.push(coordinates)
        coordinates = []
      })
    
      this._pixelCoordinates = renderCoords
      Transform.setFromArray(this.renderedTransform, transform)
    }
    
    const len = styleArray.length
    for(let i = 0; i < len ; i ++){
      let styleObj = styleArray[i]
    
      let renderOptions = {
        coordinates: renderCoords,
        fillStyle: colorToString(styleObj.color,styleObj.alpha),
        borderStyle: styleObj.borderStyle
      }
    
      this.drawPolygon(ctx, renderOptions)
    }
    
    return true
  }
  
  /**
   * 绘制多边形，需要注意多边形各个环的绘制
   * @param ctx
   * @param renderOpt
   */
  drawPolygon (ctx, renderOpt) {
    ctx.save()
    
    if (renderOpt.fillStyle) {
      ctx.fillStyle = renderOpt.fillStyle
    }
  
    const borderStyle = renderOpt.borderStyle
    if (borderStyle) {
      ctx.strokeStyle = colorToString(borderStyle.color,borderStyle.alpha)
      ctx.lineWidth = borderStyle.width
    
      if (borderStyle.lineDash) {
        ctx.setLineDash(borderStyle.lineDash)
      }
    }
    
    const coords = renderOpt.coordinates
    coords.forEach( (coordinates, index) => {
      if (index === 0) {
        ctx.beginPath()
      }
      
      ctx.moveTo(coordinates[0][0],coordinates[0][1])
      for(let k = 1, kk = coordinates.length ; k < kk ; k ++){
        let cd = coordinates[k]
        ctx.lineTo(cd[0],cd[1])
      }
  
      ctx.closePath()
    })
  
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}