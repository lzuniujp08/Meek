/**
 * Created by zhangyong on 2017/3/17.
 */

/**
 *
 * @param optWidth
 * @param optHeight
 * @returns {CanvasRenderingContext2D|WebGLRenderingContext}
 */
export function createCanvasContext2D (optWidth, optHeight) {
  let canvas = document.createElement('CANVAS')
  if (optWidth) {
    canvas.width = optWidth
  }
  
  if (optHeight) {
    canvas.height = optHeight
  }
  
  return canvas.getContext('2d')
}

/**
 *
 * @param element
 * @returns {number}
 */
export function outerWidth (element) {
  let width = element.offsetWidth
  const style = getComputedStyle(element)
  width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10)
  
  return width
}

/**
 *
 * @param element
 * @returns {number}
 */
export function outerHeight (element) {
  let height = element.offsetHeight
  const style = getComputedStyle(element)
  height += parseInt(style.marginTop, 10) + parseInt(style.marginBottom, 10)
  
  return height
}


export function removeNode (node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null
}

/**
 *
 * @param node
 */
export function removeChildren (node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild)
  }
}

export default {
  createCanvasContext2D,
  outerWidth,
  outerHeight,
  removeChildren,
  removeNode
}