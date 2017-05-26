/**
 * Created by zhangyong on 2017/5/24.
 */


export const ExtentUtil = {}

/**
 * Create an empty extent.
 * @returns {[*,*,*,*]}
 */
ExtentUtil.createEmpty = function () {
  return [Infinity, Infinity, -Infinity, -Infinity]
}

/**
 * Create an empty extent.
 * @returns {[*,*,*,*]}
 */
ExtentUtil.createScaleExtent = function (center,value) {
  return [center.x  - value, center.y  - value, center.x  + value, center.y + value]
}


/**
 * Build an extent that includes all given coordinates.
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
 * Combine an extent from the given coordinates.
 * @param extent
 * @param coordinate
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
 * Get the bottom right coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getBottomRight = function (extent) {
  return [extent[2], extent[1]]
}


/**
 * Get the bottom left coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getBottomLeft = function (extent) {
  return [extent[0], extent[1]]
}


/**
 * Get the top right coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getTopRight = function (extent) {
  return [extent[2], extent[3]]
}


/**
 * Get the top left coordinate of an extent
 * @param extent
 * @returns {[*,*]}
 */
ExtentUtil.getTopLeft = function (extent) {
  return [extent[0], extent[3]]
}

/**
 * Check if a passed point is contained or on the edge of the extent.
 * @param extent
 * @param point
 */
ExtentUtil.containsPoint = function(extent, point){
  const x = point[0]
  const y = point[1]
  
  return extent.xmin <= x && x <= extent.xmax &&
         extent.ymin <= y && y <= extent.ymax
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
