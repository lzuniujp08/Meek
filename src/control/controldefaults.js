/**
 * Created by zhangyong on 2017/8/2.
 */

import Zoom from './zoom'

export function controlDefaults (options = {}) {
  
  const controls = []
  
  const zoomControl = options.zoom !== undefined ? options.zoom : true
  if (zoomControl) {
    controls.push(new Zoom(options.zoomOptions))
  }
  
  // const rotateControl = options.rotate !== undefined ? options.rotate : true
  // if (rotateControl) {
  //   controls.push(new ol.control.Rotate(options.rotateOptions))
  // }
  //
  // const attributionControl = options.attribution !== undefined ?
  //   options.attribution : true
  // if (attributionControl) {
  //   controls.push(new ol.control.Attribution(options.attributionOptions))
  // }
  
  return controls
}

export default {
  controlDefaults
}