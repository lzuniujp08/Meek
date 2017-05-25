/**
 * Created by zhangyong on 2017/5/25.
 */

import Component from './Component'

export default class ModifyCpt extends Component {
  
  
  constructor(options) {
    super()
  
    
    this._pixelTolerance = options.pixelTolerance ?
        options.pixelTolerance : 10
    
    /**
     * Determine if should snap to vertexs of gemetry
     * @type {boolean}
     * @private
     */
    this._snapToVertex = false
  }
  
  
}