/**
 * Created by zhangyong on 2017/7/17.
 */


import {ExtentUtil} from '../../geometry/support/extentutil'
import Polygon from '../../geometry/polygon'

/**
 *
 * 使用直线来切割多边形
 *
 * @method splitPolygonByLine
 * @param polygon 被切割多边形
 * @param line 切割直线
 * @returns {Array}
 */
export default function splitPolygonByLine(polygon, line) {
  
  const polygonCoordinates = polygon.getCoordinates()
  const lineCoordinates = line.getCoordinates()
  
  // 找到直线和面的相交点
  const dividedPointList = findIntersectionPoints(polygonCoordinates, lineCoordinates)
  
  // 0交点或者交点为奇数，则认为非法输入
  if (dividedPointList.length === 0 || dividedPointList.length % 2 === 1) {
    return []
  }
  
  const firstPoint = lineCoordinates[0]
  const endPoint = lineCoordinates[1]
  
  // 安装顺序插入分割点到分割多边形顶多序列中
  const vertexListAfterDivide = insertDividePointsToCoordinates(dividedPointList, polygonCoordinates)
  // console.log('after insert:' + vertexListAfterDivide)
  
  // 找到左右测的坐标集合
  const groupsLeftRigthArr = sortCoordinatesByLineDirection(vertexListAfterDivide, lineCoordinates, dividedPointList)
  
  const leftSideVertexSet = groupsLeftRigthArr.left
  const rightSideVertexSet = groupsLeftRigthArr.right
  
  // 将分割点安装与起始点距离远近排序
  const sortedDividedPointList = dividedPointList.sort(function(point1, point2){
    return distance(point1.point, {x:firstPoint[0],y:firstPoint[1]}) - distance(point2.point, {x:firstPoint[0],y:firstPoint[1]})
  })
  
  // 求直线的方向
  const k = (endPoint[1] - firstPoint[1])
  
  const insertedEdgeLeft = []
  const insertedEdgeRight = []
  for (let i = 0, len = sortedDividedPointList.length; i < len; i += 2) {
    const firstPoint = [sortedDividedPointList[i].point.x, sortedDividedPointList[i].point.y]
    const secodePoint = [sortedDividedPointList[i + 1].point.x, sortedDividedPointList[i + 1].point.y]
    
    if (k > 0) {
      insertedEdgeRight.push([firstPoint, secodePoint])
      insertedEdgeLeft.push([secodePoint, firstPoint])
    } else {
      insertedEdgeLeft.push([firstPoint, secodePoint])
      insertedEdgeRight.push([secodePoint, firstPoint])
    }
  }
  
  // 重塑多边形
  const afterUnionLeft = union(leftSideVertexSet, insertedEdgeLeft, vertexListAfterDivide)
  const afterUnionRight = union(rightSideVertexSet, insertedEdgeRight, vertexListAfterDivide)
  
  const featureCollection = []
  const allSplitCoordinates = afterUnionLeft.concat(afterUnionRight)
  
  // 生成多边形对象
  allSplitCoordinates.forEach(arr => {
    const polygon = new Polygon()
    polygon.setCoordinates(arr)
    featureCollection.push(polygon)
  })
  
  // console.log(afterUnionLeft)
  // console.log(afterUnionRight)
  
  return featureCollection
}

const distance = function(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
}


const union = function(sideVertexSet, divPoints, vertexListAfterDivide) {
  
  const allGroup = []
  
  // 检查当前点是否在整个图形（包括插入点）的边中
  const isInAllVertexsList = function(p1, p2 = [0, 0]) {
    for (let ii = 0, len = vertexListAfterDivide.length - 1; ii < len ;ii++) {
      let fPoint = vertexListAfterDivide[ii]
      let tPoint = vertexListAfterDivide[ii + 1]
      
      if (fPoint[0] === p1[0] &&
          fPoint[1] === p1[1] &&
          tPoint[0] === p2[0] &&
          tPoint[1] === p2[1]
         ) {
        return true
      }
    }
    
    return false
  }
  
  const isInArray = function(item, arr) {
    return arr.find(arrItem => {
      return arrItem[0] === item[0] && arrItem[1] === item[1]
    })
  }
  
  const isInDivVertexList = function(endPoint) {
    const result1 =  divPoints.find(divPoint => {
      const result = divPoint.find(innerPoint => {
        return innerPoint[0] === endPoint[0] && innerPoint[1] === endPoint[1]
      })
      
      return result === undefined ? false : true
    })
    
    return result1 === undefined ? false : true
  }
  
  const getTheSecodeDivPoint = function(firstDivPoint) {
    const _divPoints = divPoints
    for(let i = 0, len = _divPoints.length ;i < len ; i++) {
      const itemPoint = _divPoints[i][0]
      
      if (itemPoint[0] === firstDivPoint[0] && itemPoint[1] === firstDivPoint[1]) {
        return _divPoints[i][1]
      }
    }
    
    return undefined
  }
  
  let i = 0
  let len = sideVertexSet.length
  
  let coords = []
  for(; i < len; i++) {
    let firstPoint = sideVertexSet[i]
  
    if (!isInArray(firstPoint, coords)) {
      coords.push(firstPoint)
    }
    
    let endPoint = undefined
    if (i + 1 < len) {
      endPoint = sideVertexSet[i + 1]
    }
    
    // 最后一次循环
    if (endPoint === undefined) {
      if (firstPoint[0] === coords[0][0] && firstPoint[1] === coords[0][1]) {
        allGroup.push(coords)
        coords = []
        continue
      }
    }
    
    // 如果是边，则添加
    if (isInAllVertexsList(firstPoint, endPoint)) {
      coords.push(endPoint)
    } else if (isInDivVertexList(firstPoint)) {
      // 如果添加了分割点，则必须添加第二个分割点，形成分割边
      // coords.push(endPoint)
      const secodeDivPoint = getTheSecodeDivPoint(firstPoint)
      coords.push(secodeDivPoint)
      
      
      if (secodeDivPoint[0] === coords[0][0] && secodeDivPoint[1] === coords[0][1]) {
        allGroup.push(coords)
        coords = []
  
        continue
      }
      
      // 检查是否闭环,如果闭环则形成一个多边形
      // 如果没有，则继续找
      if (isInAllVertexsList(secodeDivPoint, coords[0])) {
        coords.push(coords[0])
        allGroup.push(coords)
        coords = []
        
        continue
      }
    }
  }
  
  return allGroup
}


const sortCoordinatesByLineDirection = function(vertexListAfterDivide, lineCoordinates, dividedPointList) {
  
  const leftGroup = []
  const rightGroup = []
  
  // 当P在AB左侧时距离为正，右侧时为负
  const _calculatePointSideByLine = calculatePointSideByLine
  const P1 = lineCoordinates[0]
  const P2 = lineCoordinates[1]
  
  const isInDividedPointList = function(point){
    return dividedPointList.find(item => {
      let itemPoint = item.point
      return itemPoint.x === point[0] && itemPoint.y === point[1]
    })
  }
  
  vertexListAfterDivide.forEach(vertex => {
    
    if (isInDividedPointList(vertex)) {
      rightGroup.push(vertex)
      leftGroup.push(vertex)
    } else {
      const isLeft = _calculatePointSideByLine(P1, P2, vertex)
      
      if ( isLeft < 0) {
        rightGroup.push(vertex)
      } else if (isLeft > 0) {
        leftGroup.push(vertex)
      }
    }
  })
  
  
  return {
    left: leftGroup,
    right: rightGroup,
    // leftEdge: leftEdgeGroup,
    // rightEdge: rightEdgeGroup
  }
}

const insertDividePointsToCoordinates = function(dividedPointList, polygonCoordinates) {
  const afterInserted = []
  
  const isInDividedPointList = function(firstPoint, endPoint) {
    return dividedPointList.find(item => {
      const orialPoint = item.originPoint
      const ofPoint = orialPoint.fromPoint
      const oePoint = orialPoint.toPoint
      
      return firstPoint[0] === ofPoint[0] &&
             firstPoint[1] === ofPoint[1] &&
             endPoint[0] === oePoint[0] &&
             endPoint[1] === oePoint[1]
    })
  }
  
  const len = polygonCoordinates.length
  let i = 0
  
  for (; i < len - 1; i++) {
    const fPoint = polygonCoordinates[i]
    const ePoint = polygonCoordinates[i + 1]
  
    afterInserted.push(fPoint)
    const itemDividedPoint = isInDividedPointList(fPoint, ePoint)
    
    if (itemDividedPoint) {
      const point = itemDividedPoint.point
      afterInserted.push([point.x, point.y])
    }
  }
  
  afterInserted.push(afterInserted[0])
  return afterInserted
}


const findIntersectionPoints = function (polygonCoordinates, lineCoordinates) {
  const _ExtentUtil = ExtentUtil
  const lineCoordinatesExtent = _ExtentUtil.boundingExtentFromTwoPoints(lineCoordinates[0], lineCoordinates[1])
  const lineCoordinatesExtentBuffer = _ExtentUtil.buffer(lineCoordinatesExtent, 4)
  
  const seg2 = {
    x1: lineCoordinates[0][0],
    y1: lineCoordinates[0][1],
    x2: lineCoordinates[1][0],
    y2: lineCoordinates[1][1]
  }
  
  const ntersectionPoints = []
  
  for (let j = 0, jj = polygonCoordinates.length - 1; j < jj; j ++) {
  
    let points = polygonCoordinates[j]
    let nextPoints = polygonCoordinates[j + 1]
    
    let pathExtent = _ExtentUtil.boundingExtentFromTwoPoints(points, nextPoints)
    // 如果两边的extent相交，则判断他们是否相交
    if (_ExtentUtil.intersects(pathExtent, lineCoordinatesExtentBuffer)) {
      
      const seg1 = {
        x1: points[0],
        y1: points[1],
        x2: nextPoints[0],
        y2: nextPoints[1]
      }
      
      const intersectPoint = segmentsIntersect(seg1, seg2, {point: true})
      if (intersectPoint instanceof Object) {
        ntersectionPoints.push({
          point: intersectPoint,
          originPoint:{
            fromPoint: points,
            toPoint: nextPoints
          },
          index: j
        })
      }
    }
  }
  
  return ntersectionPoints
}


const segmentsIntersect = function (seg1, seg2, options) {
  const point = options && options.point
  const tolerance = options && options.tolerance
  let intersection = false
  const x11_21 = seg1.x1 - seg2.x1
  const y11_21 = seg1.y1 - seg2.y1
  const x12_11 = seg1.x2 - seg1.x1
  const y12_11 = seg1.y2 - seg1.y1
  const y22_21 = seg2.y2 - seg2.y1
  const x22_21 = seg2.x2 - seg2.x1
  const d = (y22_21 * x12_11) - (x22_21 * y12_11)
  const n1 = (x22_21 * y11_21) - (y22_21 * x11_21)
  const n2 = (x12_11 * y11_21) - (y12_11 * x11_21)
  
  if (d == 0) {
    // parallel
    if (n1 == 0 && n2 == 0) {
      // coincident
      intersection = true
    }
  } else {
    const along1 = n1 / d
    const along2 = n2 / d
    if (along1 >= 0 && along1 <= 1 && along2 >=0 && along2 <= 1) {
      // intersect
      if (!point) {
        intersection = true
      } else {
        // calculate the intersection point
        const x = seg1.x1 + (along1 * x12_11)
        const y = seg1.y1 + (along1 * y12_11)
        intersection = { 'x':x, 'y':y }
      }
    }
  }
  
  if (tolerance) {
    let dist
    if (intersection) {
      if (point) {
        const segs = [seg1, seg2]
        let seg, x, y
        // check segment endpoints for proximity to intersection
        // set intersection to first endpoint within the tolerance
        for (let i = 0; i < 2; ++i) {
          seg = segs[i]
          for (let j = 1; j < 3; ++j) {
            x = seg['x' + j]
            y = seg['y' + j]
            
            dist = Math.sqrt(
              Math.pow(x - intersection.x, 2) +
              Math.pow(y - intersection.y, 2)
            )
            
            if (dist < tolerance) {
              intersection.x = x
              intersection.y = y
              break
            }
          }
        }
        
      }
    } else {
      // no calculated intersection, but segments could be within
      // the tolerance of one another
      const segs = [seg1, seg2]
      let source, target, p, result
      // check segment endpoints for proximity to intersection
      // set intersection to first endpoint within the tolerance
      for (let i = 0; i < 2; ++i) {
        source = segs[i]
        target = segs[(i + 1) % 2]
        for (let j = 1; j < 3; ++j) {
          p = {x: source['x' + j], y: source['y' + j]}
          result = distanceToSegment(p, target)
          if (result.distance < tolerance) {
            if (point) {
              intersection = { 'x':p.x, 'y':p.y }
            } else {
              intersection = true
            }
            
            break
          }
        }
      }
    }
  }
  return intersection
}

const distanceToSegment = function (point, segment) {
  let result = distanceSquaredToSegment(point, segment)
  result.distance = Math.sqrt(result.distance)
  return result
}

const distanceSquaredToSegment = function (point, segment) {
  const x0 = point.x
  const y0 = point.y
  const x1 = segment.x1
  const y1 = segment.y1
  const x2 = segment.x2
  const y2 = segment.y2
  const dx = x2 - x1
  const dy = y2 - y1
  const along = ((dx * (x0 - x1)) + (dy * (y0 - y1))) / (Math.pow(dx, 2) + Math.pow(dy, 2))
  let x, y
  
  if(along <= 0.0) {
    x = x1
    y = y1
  } else if(along >= 1.0) {
    x = x2
    y = y2
  } else {
    x = x1 + along * dx
    y = y1 + along * dy
  }
  
  return {
    distance: Math.pow(x - x0, 2) + Math.pow(y - y0, 2),
    x: x, y: y,
    along: along
  }
}


const calculatePointSideByLine = function(P1, P2, point){
  return ((P2[1] - P1[1]) * point[0] + (P1[0] - P2[0]) * point[1] + (P2[0] * P1[1] - P1[0] * P2[1]))
}

// const calculatePointSideByLine = function(p1, p2, c){
//   return [(p1[0] - c[0]) * (p2[1] - c[1]) - (p1[1] - c[1]) * (p2[0] - c[0])] / 2
// }