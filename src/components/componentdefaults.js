/**
 * Created by zhangyong on 2017/6/15.
 */


import Kinetic from './kinetic'
import DragPan from './dragpan'
import MouseWheelZoom from './mousewheelzoom'
import KeyboardHome from './keyboardhome'
import KeyboardZoom from './keyboardzoom'
import KeyboardPan from './keyboardpan'

/**
 *
 * @param options
 * @returns {Set}
 */
export function componentsDefaults (options = {}) {
  const components = new Set()
  
  const kinetic = new Kinetic(-0.005, 0.05, 100)
  
  const dragPan = options.dragPan !== undefined ? options.dragPan : true
  if (dragPan) {
    components.add(new DragPan({
      kinetic: kinetic
    }))
  }
  
  const mouseWheelZoom = options.mouseWheelZoom !== undefined ?
    options.mouseWheelZoom : true
  if (mouseWheelZoom) {
    components.add(new MouseWheelZoom({
      constrainResolution: options.constrainResolution,
      duration: options.zoomDuration
    }))
  }
  
  const keyboard = options.keyboard !== undefined ? options.keyborad : true
  if (keyboard) {
    components.add(new KeyboardHome(options))
    components.add(new KeyboardPan(options))
    components.add(new KeyboardZoom({
      delta: options.zoomDelta
    }))
  }
  
  return components
}


export default {
  componentsDefaults
}