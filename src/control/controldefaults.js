/**
 * Created by zhangyong on 2017/8/2.
 */

import Zoom from './zoom'
import Home from './home'
import zoomPercentage from './zoompercentage'

export function controlDefaults (options = {}) {
  
  const controls = []
  
  const zoomControl = options.zoom !== undefined ? options.zoom : true
  if (zoomControl) {
    controls.push(new Zoom(options.zoomOptions))
  }
  
  const homeControl = options.home !== undefined ? options.home : true
  if (homeControl) {
    controls.push(new Home(options.homeOptions))
  }
  
  const zoomPercentageControl = options.zoomPercentage !== undefined ? options.zoomPercentage : true
  if (zoomPercentageControl) {
    controls.push(new zoomPercentage(options.zoomPercentageOptions))
  }
  
  return controls
}

export default {
  controlDefaults
}