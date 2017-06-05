/**
 * Created by zhangyong on 2017/3/20.
 */

import BaseObject from '../../core/BaseObject'
import {Transform} from '../../data/matrix/Transform'
import {ExtentUtil} from '../../geometry/support/ExtentUtil'

export default class LayerRenderer extends BaseObject {
  
  constructor (layer,context) {
    super()
    
    this._context = context
    this._layer = layer
  
    this._transform = ExtentUtil.createEmpty()
  }
  
  getTransform (frameState, offsetX) {
    const viewState = frameState.viewState
    const pixelRatio = 1
    const dx1 = pixelRatio * frameState.size[0] / 2
    const dy1 = pixelRatio * frameState.size[1] / 2
    const sx = pixelRatio / viewState.resolution
    const sy = -sx
    const angle = -viewState.rotation
    const dx2 = -viewState.center[0] + offsetX
    const dy2 = -viewState.center[1]
    return Transform.compose(this._transform, dx1, dy1, sx, sy, angle, dx2, dy2)
  }
  
  /**
   *
   * @returns {*}
   */
  get layer () { return this._layer }
  get context () {return this._context}
  
  /**
   * 渲染准备工作
   * 1、找到渲染器
   * 2、转换坐标系统
   * 3、
   */
  prepareFrame () {}
  
  /**
   *
   */
  composeFrame () {}
  
}