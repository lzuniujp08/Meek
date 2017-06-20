/**
 * Created by zhangyong on 2017/3/24.
 */

import GeometryRender from './GeomertyRender'
import {Transform} from '../../data/matrix/Transform'
import {colorToString} from '../../utils/Helpers'

export default class TextRender extends GeometryRender {
  
  constructor (context) {
    super(context)
  
    this._pixelCoordinates = []
  }
  
  /**
   *
   * @param feature
   * @param transform
   */
  render (feature, renderStyle, transform) {
    
    const ctx = this.context
    ctx.save()
    
    const geometry = feature.geometry
    const coordinates = geometry.getFlatInteriorPoint()
  
    this._pixelCoordinates = []
    
    const pixelCoordinates = Transform.transform2D(
      coordinates, 0, coordinates.length, 2,
      transform, this._pixelCoordinates)
    
    const textStyle = renderStyle[0].textStyle
    
    // set the context text style
    this._setTextStyle(ctx, textStyle)
  
    const offsetX = textStyle.offsetX - 10
    const offsetY = textStyle.offsetY - 10
    const stroke = textStyle.stroke ? true : false
    const fill = textStyle.fill ? true : false
    const text = textStyle.text
  
    let x = pixelCoordinates[0] + offsetX
    let y = pixelCoordinates[1] + offsetY
  
    let lines = text.split('\n')
    const numLines = lines.length
    let fontSize, lineY
    if (numLines > 1) {
      fontSize = Math.round(ctx.measureText('M').width * 1.5)
      lineY = y - (((numLines - 1) / 2) * fontSize)
    } else {
      fontSize = 0
      lineY = y
    }
  
    for (let lineIndex = 0; lineIndex < numLines; lineIndex++) {
      const lineText = lines[lineIndex]
      if (stroke) {
        ctx.strokeText(lineText, x, lineY)
      }
      if (fill) {
        ctx.fillText(lineText, x, lineY)
      }
    
      // Move next line down by fontSize px
      lineY = lineY + fontSize
    }
  
    ctx.restore()
  }
  
  /**
   *
   * @param ctx
   * @param textStyle
   * @private
   */
  _setTextStyle (ctx, textStyle) {
    const borderStyle = textStyle.stroke
  
    ctx.font = textStyle.font
    ctx.strokeStyle = colorToString(borderStyle.color, 1)
    ctx.fillStyle = colorToString(textStyle.fill, 1)
    ctx.textBaseline = textStyle.textBaseline
    ctx.textAlign = textStyle.textAlign
    ctx.lineWidth = borderStyle.width
    ctx.lineCap = borderStyle.lineCap
    ctx.lineJoin = borderStyle.lineJion
  }
  
}