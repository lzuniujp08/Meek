/**
 * Created by zhangyong on 2017/5/24.
 */

export const ExtentUtil = {}

/**
 * 创建一个空矩形
 *
 * @method createEmpty
 * @returns {[*,*,*,*]}
 */
ExtentUtil.createEmpty = function () {
  return [Infinity, Infinity, -Infinity, -Infinity]
}

/**
 *
 * @param flatCoordinates
 * @param offset
 * @param end
 * @param stride
 * @param opt_extent
 */
ExtentUtil.createOrUpdateFromFlatCoordinates = function(flatCoordinates, offset, end, stride, opt_extent) {
  const extent = ExtentUtil.createOrUpdateEmpty(opt_extent)
  return extendFlatCoordinates(
    extent, flatCoordinates, offset, end, stride)
}

const extendXY = function(extent, x, y) {
  extent[0] = Math.min(extent[0], x)
  extent[1] = Math.min(extent[1], y)
  extent[2] = Math.max(extent[2], x)
  extent[3] = Math.max(extent[3], y)
}


const extendFlatCoordinates = function(extent, flatCoordinates, offset, end, stride) {
  for (; offset < end; offset += stride) {
    extendXY(
      extent, flatCoordinates[offset], flatCoordinates[offset + 1])
  }
  
  return extent
}

/**
 *
 * @param opt_extent
 * @returns {*}
 */
ExtentUtil.createOrUpdateEmpty = function(opt_extent) {
  return ExtentUtil.createOrUpdate(
    Infinity, Infinity, -Infinity, -Infinity, opt_extent)
}

/**
 * 创建或更新矩形
 *
 * @method createOrUpdate
 * @param minX {Number}
 * @param minY {Number}
 * @param maxX {Number}
 * @param maxY {Number}
 * @param opt_extent {Array}
 * @returns {*}
 */
ExtentUtil.createOrUpdate = function(minX, minY, maxX, maxY, opt_extent) {
  if (opt_extent) {
    opt_extent[0] = minX
    opt_extent[1] = minY
    opt_extent[2] = maxX
    opt_extent[3] = maxY
    return opt_extent
  } else {
    return [minX, minY, maxX, maxY]
  }
}

/**
 * 获取矩形的中心点
 *
 * @method getCenter
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getCenter = function(extent) {
  return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
}

/**
 * Create an empty extent.
 * @returns {[*,*,*,*]}
 */
ExtentUtil.createScaleExtent = function (center,value) {
  return [center.x  - value, center.y  - value, center.x  + value, center.y + value]
}

/**
 *
 * @param point1
 * @param point2
 * @returns {[*,*,*,*]}
 */
ExtentUtil.boundingExtentFromTwoPoints = function (point1, point2) {
  let xmin = 0, ymin = 0, xmax = 0, ymax = 0
  
  if (point1[0] > point2[0]) {
    xmin = point2[0]
    xmax = point1[0]
  } else {
    xmin = point1[0]
    xmax = point2[0]
  }
  
  if (point1[1] > point2[1]) {
    ymin = point2[1]
    ymax = point1[1]
  } else {
    ymin = point1[1]
    ymax = point2[1]
  }
  
  return [xmin, ymin, xmax, ymax]
}

/**
 * 通过坐标数据构建矩形
 *
 * @method boundingExtent
 * @param extent
 * @param coordinate
 */
ExtentUtil.boundingExtent = function (coordinates) {
  let extent = ExtentUtil.createEmpty()
  
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    ExtentUtil.extendCoordinate(extent, coordinates[i])
  }
  
  return [
    ExtentUtil.getBottomLeft(extent),
    ExtentUtil.getBottomRight(extent),
    ExtentUtil.getTopRight(extent),
    ExtentUtil.getTopLeft(extent),
    ExtentUtil.getBottomLeft(extent)
  ]
}

/**
 * Build an extent that includes all given coordinates.
 * @param extent
 * @param coordinate
 */
ExtentUtil.boundingSimpleExtent = function (coordinates) {
  let extent = ExtentUtil.createEmpty()
  
  for (let i = 0, ii = coordinates.length; i < ii; ++i) {
    ExtentUtil.extendCoordinate(extent, coordinates[i])
  }
  
  return extent
}

/**
 * 通过坐标更新矩形
 *
 * @method extendCoordinate
 * @param extent {Geometry}
 * @param coordinate {Array}
 */
ExtentUtil.extendCoordinate = function(extent, coordinate) {
  if (coordinate[0] < extent[0]) {
    extent[0] = coordinate[0]
  }
  
  if (coordinate[0] > extent[2]) {
    extent[2] = coordinate[0]
  }
  
  if (coordinate[1] < extent[1]) {
    extent[1] = coordinate[1]
  }
  
  if (coordinate[1] > extent[3]) {
    extent[3] = coordinate[1]
  }
}


/**
 * 获取矩形右侧线段坐标
 *
 * getBottomRight
 * @param extent {Geometry}
 * @returns {[*,*]}
 */
ExtentUtil.getBottomRight = function (extent) {
  return [extent[2], extent[1]]
}


/**
 * 获取矩形左侧线段坐标
 *
 * getBottomLef
 * @param extent {Geometry}
 * @returns {[*,*]}
 */
ExtentUtil.getBottomLeft = function (extent) {
  return [extent[0], extent[1]]
}


/**
 * Get the top right coordinate of an extent
 * extent
 * @returns {[*,*]}
 */
ExtentUtil.getTopRight = function (extent) {
  return [extent[2], extent[3]]
}


/**
 * Get the top left coordinate of an extent
 *  extent
 * @returns {[*,*]}
 */
ExtentUtil.getTopLeft = function (extent) {
  return [extent[0], extent[3]]
}

/**
 * 判断点是否在矩形上
 *
 * @method containsPoint
 * @param extent {Geometry}
 * @param point {Array}
 * @returns {Boolean}
 */
ExtentUtil.containsPoint = function(extent, point){
  const x = point[0]
  const y = point[1]
  
  if (Array.isArray(extent)) {
    return extent[0] <= x && x <= extent[2] &&
           extent[1] <= y && y <= extent[3]
  } else {
    return (extent.xmin - 10) <= x && x <= (extent.xmax + 10) &&
      (extent.ymin - 10)<= y && y <= (extent.ymax + 10)
  }
}

/**
 * Return extent increased by the provided value.
 * @param extent
 * @param value
 * @param optExtent
 * @returns {*}
 */
ExtentUtil.buffer = function(extent, value, optExtent) {
  if (optExtent) {
    optExtent[0] = extent[0] - value
    optExtent[1] = extent[1] - value
    optExtent[2] = extent[2] + value
    optExtent[3] = extent[3] + value
    return optExtent
  } else {
    return [
      extent[0] - value,
      extent[1] - value,
      extent[2] + value,
      extent[3] + value
    ]
  }
}

/**
 * Convert xmin, ymin, xmax, ymax of an extent to a ring array
 * @param xmin
 * @param ymin
 * @param xmax
 * @param ymax
 * @returns {[*,*,*,*,*]}
 */
ExtentUtil.minMaxToRing = function (xmin, ymin, xmax, ymax) {
  const ring = [
    [xmin, ymin],
    [xmax, ymin],
    [xmax, ymax],
    [xmin, ymax],
    [xmin, ymin]
  ]
  
  return ring
}

/**
 * 获取图形的高
 *
 * @method getHeight
 * @param extent {Geometry}
 * @returns {Number}
 */
ExtentUtil.getHeight = function(extent) {
  return extent[3] - extent[1]
}

/**
 * 获取图形的宽
 *
 * @method getWidth
 * @param extent {Geometry}
 * @returns {Number}
 */
ExtentUtil.getWidth = function(extent) {
  return extent[2] - extent[0]
}

/**
 * 矩形坐标点更新
 *
 * @method updateExtent
 * @param geometry {Geometry}
 * @param newCoordinates {Array}
 * @param dragSegments
 * @returns {Array}
 */
ExtentUtil.updateExtent = function (geometry, newCoordinates, dragSegments) {
  const dragSegment = dragSegments[0]
  const index = dragSegment.index
  const extentCoordinates = geometry.getCoordinates()
  const segment1 = extentCoordinates[index]
  const segment2 = extentCoordinates[index + 1]
  
  const isVertex = dragSegment.isVertex
  if (isVertex) {
    if (index === 0 || index === 4) {
      extentCoordinates[0] = newCoordinates
      extentCoordinates[4] = newCoordinates
      extentCoordinates[1][1] = newCoordinates[1]
      extentCoordinates[3][0] = newCoordinates[0]
    } else if (index === 1) {
      extentCoordinates[1] = newCoordinates
      
      extentCoordinates[2][0] = newCoordinates[0]
      extentCoordinates[0][1] = newCoordinates[1]
      extentCoordinates[4] = extentCoordinates[0]
    } else if (index === 2) {
      extentCoordinates[2] = newCoordinates
      extentCoordinates[1][0] = newCoordinates[0]
      extentCoordinates[3][1] = newCoordinates[1]
    } else if (index === 3) {
      extentCoordinates[3] = newCoordinates
      extentCoordinates[2][1] = newCoordinates[1]
      extentCoordinates[0][0] = newCoordinates[0]
      extentCoordinates[4] = extentCoordinates[0]
    }
  } else {
    if (segment1[0] === segment2[0]) {
      extentCoordinates[index][0] = newCoordinates[0]
      extentCoordinates[index + 1][0] = newCoordinates[0]
    }
  
    if (segment1[1] === segment2[1]) {
      extentCoordinates[index][1] = newCoordinates[1]
      extentCoordinates[index + 1][1] = newCoordinates[1]
    }
  
    if (index === 3 ) {
      extentCoordinates[0] = extentCoordinates[4]
    }
    if (index === 0 ) {
      extentCoordinates[4] = extentCoordinates[0]
    }
  }
  
  
  return extentCoordinates
}

/**
 *
 * @param extent1
 * @param extent2
 * @param opt_extent
 * @returns {(*|*|*|*)[]}
 */
ExtentUtil.getIntersection = function(extent1, extent2, opt_extent) {
  const intersection = opt_extent ? opt_extent : ExtentUtil.createEmpty()
  if (ExtentUtil.intersects(extent1, extent2)) {
    if (extent1[0] > extent2[0]) {
      intersection[0] = extent1[0]
    } else {
      intersection[0] = extent2[0]
    }
    
    if (extent1[1] > extent2[1]) {
      intersection[1] = extent1[1]
    } else {
      intersection[1] = extent2[1]
    }
    
    if (extent1[2] < extent2[2]) {
      intersection[2] = extent1[2]
    } else {
      intersection[2] = extent2[2]
    }
    
    if (extent1[3] < extent2[3]) {
      intersection[3] = extent1[3]
    } else {
      intersection[3] = extent2[3]
    }
  }
  
  return intersection
}

/**
 * 判断两个矩形是否相交
 *
 * @method intersects
 * @param extent1 {Geometry}
 * @param extent2 {Geometry}
 * @returns {Boolean}
 */
ExtentUtil.intersects = function(extent1, extent2) {
  return extent1[0] <= extent2[2] &&
    extent1[2] >= extent2[0] &&
    extent1[1] <= extent2[3] &&
    extent1[3] >= extent2[1]
}

/**
 * 判断矩形是否包含在另一个矩形中
 *
 * @method containsExtent
 * @param extent1
 * @param extent2
 * @returns {Boolean}
 */
ExtentUtil.containsExtent = function(extent1, extent2) {
  return extent1[0] <= extent2[0] &&
         extent2[2] <= extent1[2] &&
         extent1[1] <= extent2[1] &&
         extent2[3] <= extent1[3]
}

/**
 *
 * @param extent
 * @returns {boolean}
 */
ExtentUtil.isEmpty = function(extent) {
  return extent[2] < extent[0] || extent[3] < extent[1]
}

/**
 *
 * @param center
 * @param resolution
 * @param rotation
 * @param size
 * @param opt_extent
 * @returns {*}
 */
ExtentUtil.getForViewAndSize = function(center, resolution, rotation, size, opt_extent) {
  const dx = resolution * size[0] / 2
  const dy = resolution * size[1] / 2
  const cosRotation = Math.cos(rotation)
  const sinRotation = Math.sin(rotation)
  const xCos = dx * cosRotation
  const xSin = dx * sinRotation
  const yCos = dy * cosRotation
  const ySin = dy * sinRotation
  const x = center[0]
  const y = center[1]
  const x0 = x - xCos + ySin
  const x1 = x - xCos - ySin
  const x2 = x + xCos - ySin
  const x3 = x + xCos + ySin
  const y0 = y - xSin - yCos
  const y1 = y - xSin + yCos
  const y2 = y + xSin + yCos
  const y3 = y + xSin - yCos
  
  return ExtentUtil.createOrUpdate(
    Math.min(x0, x1, x2, x3), Math.min(y0, y1, y2, y3),
    Math.max(x0, x1, x2, x3), Math.max(y0, y1, y2, y3),
    opt_extent)
}

export default {
  ExtentUtil
}
