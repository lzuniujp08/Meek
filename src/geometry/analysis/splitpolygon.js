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
export default function splitPolygonByPolyline(polygon, line) {
  const polygonCoordinates = polygon.getCoordinates()
  const lineCoordinates = line.getCoordinates()
  
  // 找到直线和面的相交点
  let dividedPointList = findIntersectionPoints(polygonCoordinates, lineCoordinates)
  
  // 0交点或者交点为奇数，则认为非法输入
  if (dividedPointList.length === 0 || dividedPointList.length % 2 === 1) {
    return []
  }
  
  // 参入到原来分割线中
  const afterInsertLineCoords = insertDiveidePointsToSplitLineCoords(dividedPointList, lineCoordinates)
  // console.log('afterInsertLineCoords:' + afterInsertLineCoords)
  
  const allPartsScliedFromLineCoords = sliceDividedPointFromLine(dividedPointList, afterInsertLineCoords)
  // console.log('allPartsScliedFromLineCoords' + allPartsScliedFromLineCoords)
  
  // 按照顺序插入分割点到分割多边形顶多序列中
  const vertexListAfterDivide = insertDividePointsToCoordinates(dividedPointList, polygonCoordinates)
  
  // 重塑多边形
  const results = renewal(vertexListAfterDivide, allPartsScliedFromLineCoords)
  // console.log('最后结果：' + results)
  
  const featureCollection = []
  results.forEach( r=> {
    const coords = []
    r.forEach(arrs => {
      coords.push([arrs[0], arrs[1]])
    })
    const polygon = new Polygon()
    polygon.setCoordinates(coords)
    featureCollection.push(polygon)
  })
  
  return featureCollection
  
}


const renewal = function(vertexListAfterDivide, allPartsScliedFromLineCoords) {
  
  let i = 0
  let len = vertexListAfterDivide.length
  
  const isInArray = function(point, singlePolygonCoords) {
    return singlePolygonCoords.find( item => {
      return item[0] === point[0] &&
        item[1] === point[1]
    })
  }
  
  // 找到分割点在同一分割边上的其他点
  const findPartners = function(point) {
    for (let j = 0, jLen = allPartsScliedFromLineCoords.length; j < jLen; j++) {
      const parts = allPartsScliedFromLineCoords[j]
      const fp = parts[0]
      const ep = parts[parts.length - 1]
      
      // 如果是首点
      if (fp[0] === point[0] && fp[1] === point[1]) {
        return parts
      }
      
      if (ep[0] === point[0] && ep[1] === point[1]) {
        const newParts = [].concat(parts)
        return newParts.reverse()
      }
    }
  }
  
  // 寻找点在多边形序列的下一点
  const findNextPoint = function(point) {
    for (let m = 0, mlen = vertexListAfterDivide.length; m < mlen; m++) {
      const item = vertexListAfterDivide[m]
      if (item[0] === point[0] && item[1] === point[1]) {
        if (m === vertexListAfterDivide.length - 1) {
          return item
        } else {
          return vertexListAfterDivide[m + 1]
        }
      }
    }
  }
  
  let singlePolygonCoords = []
  let allPolygonCoords = []
  
  // 递归分割
  const goThrough = function(ePoint, singlePolygonCoords ) {
    if (singlePolygonCoords.length > 1) {
      const firstPoint = singlePolygonCoords[0]
      if (firstPoint[0] === ePoint[0] && firstPoint[1] === ePoint[1]) {
        singlePolygonCoords.push(ePoint)
        return true
      }
    }
    
    // 找到分割点，就需要添加它的伙伴（不管顺逆方向）
    if (ePoint.length >= 3 && ePoint[2] === 'isDividedPoint') {
      const parts = findPartners(ePoint)
      parts.forEach(p => {
        singlePolygonCoords.push(p)
      })
  
      // 判断此时是否已经完成绘制
      const ffpoint = singlePolygonCoords[0]
      const eepoint = singlePolygonCoords[singlePolygonCoords.length - 1]
      if (ffpoint[0] === eepoint[0] && ffpoint[1] === eepoint[1]) {
        return true
      }
    
      const endPoint = parts[parts.length - 1]
      const nextPoint = findNextPoint(endPoint)
      goThrough(nextPoint, singlePolygonCoords)
    } else if(ePoint.length === 2) {
      singlePolygonCoords.push(ePoint)
      
      const nextPoint = findNextPoint(ePoint)
      goThrough(nextPoint, singlePolygonCoords)
    }
  }
  
  // 更新多边形顶点的状态
  const updataStatus = function(singlePolygonCoords, vertexListAfterDivide) {
    vertexListAfterDivide.forEach(vertex => {
      if (isInArray(vertex, singlePolygonCoords)) {
        // 如果是原多边形顶点，则设置为'alreadyUsed'
        if (vertex.length === 2) {
          vertex.push('alreadyUsed')
        }
        // 如果是分割点，则只能使用2次
        else if (vertex.length === 3 && vertex[2] === 'isDividedPoint') {
          vertex.push('1')
        }
        //
        else if(vertex.length === 4 ) {
          if (vertex[3] === '1') {
            vertex[3] = '2'
          }
        }
      }
    })
  }
  
  // 检测这两个点是否是切割边
  const isInOneSegment = function(onePoint, otherPoint) {
    const allPartsScliedFromLineCoordsTemp = allPartsScliedFromLineCoords
    let findCount = 0
    
    for (let i = 0, len = allPartsScliedFromLineCoordsTemp.length; i < len; i++) {
      const group = allPartsScliedFromLineCoordsTemp[i]
      findCount = 0
      
      for (let j = 0, jjlen = group.length; j < jjlen; j++) {
        const item = group[j]
        if (item[0] === onePoint[0] && item[1] === onePoint[1]) {
          findCount ++
        }
        
        if (item[0] === otherPoint[0] && item[1] === otherPoint[1]) {
          findCount ++
        }
        
        if (findCount === 2) {
          return true
        }
      }
    }
  
    return false
  }
  
  
  for (; i < len - 1; i++) {
    const fPoint = vertexListAfterDivide[i]
    // 如果是普通点
    if (fPoint.length === 2) {
      if (!isInArray(fPoint, singlePolygonCoords)) {
        singlePolygonCoords.push(fPoint)
      }
  
      const ePoint = vertexListAfterDivide[i + 1]
      goThrough(ePoint, singlePolygonCoords)
  
      updataStatus(singlePolygonCoords, vertexListAfterDivide)
      
      allPolygonCoords.push(singlePolygonCoords)
      singlePolygonCoords = []
    }
    // 如果是分割点
    else if (fPoint.length === 3 && fPoint[2] === 'isDividedPoint') {
      if (!isInArray(fPoint, singlePolygonCoords)) {
        singlePolygonCoords.push(fPoint)
      }
  
      const ePoint = vertexListAfterDivide[i + 1]
      goThrough(ePoint, singlePolygonCoords)
  
      updataStatus(singlePolygonCoords, vertexListAfterDivide)
  
      allPolygonCoords.push(singlePolygonCoords)
      singlePolygonCoords = []
    } else if (fPoint.length === 4 && fPoint[3] === '1') {
      let ePoint = vertexListAfterDivide[i + 1]
      
      // 分割点，必须是构成同一边，不能是异边
      if(ePoint.length >= 3 && ePoint[2] === 'isDividedPoint' && isInOneSegment(fPoint, ePoint)) {
        ePoint = fPoint
      }
      // 异边，则重新启动分割流程
      else {
        if (!isInArray(fPoint, singlePolygonCoords)) {
          singlePolygonCoords.push(fPoint)
        }
      }
  
      goThrough(ePoint, singlePolygonCoords)
      updataStatus(singlePolygonCoords, vertexListAfterDivide)
  
      const fp = singlePolygonCoords[0]
      const tp = singlePolygonCoords[singlePolygonCoords.length - 1]
      if (fp[0] !== tp[0] || fp[1] !== tp[1]) {
        singlePolygonCoords.push(fp)
      }
      
      allPolygonCoords.push(singlePolygonCoords)
      singlePolygonCoords = []
    }
  }
  
  return allPolygonCoords
}

const sliceDividedPointFromLine = function(dividedPointList, afterInsertLineCoords) {
  let allParts = []
  let singleParts = []
  let isDividePointStart = false
  
  for (let i = 0, len = afterInsertLineCoords.length; i < len; i++) {
    const item = afterInsertLineCoords[i]
    
    if (isDividePointStart === false && item.length === 3) {
      singleParts.push([item[0], item[1]])
      isDividePointStart = true
      
      continue
    }
    
    if (isDividePointStart) {
      if (item.length === 2) {
        singleParts.push(item)
        
        continue
      }
    }
    
    if (isDividePointStart && item.length === 3) {
      singleParts.push([item[0], item[1]])
      isDividePointStart = false
      
      allParts.push(singleParts)
      singleParts = []
    }
  }
  
  return allParts
}

const insertDiveidePointsToSplitLineCoords = function(dividedPointList, lineCoordinates) {
  
  const getDividePoints = function (fP, eP) {
    return dividedPointList.filter(dp => {
      const dfPoint = dp.intersectFrom.fromPoint
      const dePoint = dp.intersectFrom.endPoint
      
      return dfPoint[0] === fP[0] &&
             dfPoint[1] === fP[1] &&
             dePoint[0] === eP[0] &&
             dePoint[1] === eP[1]
    })
  }
  
  const isInArray = function(point) {
    return afterArr.find( item => {
      return item[0] === point[0] &&
             item[1] === point[1]
    })
  }
  
  let len = lineCoordinates.length
  let i = 0
  const afterArr = []
  for (;i < len - 1; i ++) {
    const fPoint = lineCoordinates[i]
    const ePoint = lineCoordinates[i + 1]
  
    if (!isInArray(fPoint)) {
      afterArr.push(fPoint)
    }
    
    const dividePoints = getDividePoints(fPoint, ePoint)
    if (dividePoints.length !== 0) {
      // 插入分割点
      if (dividePoints.length === 1) {
        afterArr.push([dividePoints[0].point.x, dividePoints[0].point.y, 'dividePoint'])
      } else {
        // 多个分割点需要排序
        
        const firstPointXY = {
          x: fPoint[0],
          y: fPoint[1]
        }
        
        dividePoints.sort((item1, item2) => {
          return distance(item1.point, firstPointXY) - distance(item2.point, firstPointXY)
        })
  
        dividePoints.forEach(item => {
          afterArr.push([item.point.x, item.point.y, 'dividePoint'])
        })
      }
    }
  
    if (!isInArray(ePoint)) {
      afterArr.push(ePoint)
    }
  }
  
  return afterArr
}


const distance = function(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
}

const insertDividePointsToCoordinates = function(dividedPointList, polygonCoordinates) {
  const afterInserted = []
  
  const isInDividedPointList = function(firstPoint, endPoint) {
    return dividedPointList.filter(item => {
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
    
    if (itemDividedPoint.length > 0) {
      if (itemDividedPoint.length > 1) {
        const firstPointXY = {
          x: fPoint[0],
          y: fPoint[1]
        }
    
        itemDividedPoint.sort((item1, item2) => {
          return distance(item1.point, firstPointXY) - distance(item2.point, firstPointXY)
        })
      }
  
      itemDividedPoint.forEach(item => {
        const point = item.point
        afterInserted.push([point.x, point.y, 'isDividedPoint'])
      })
    }
  }
  
  afterInserted.push(afterInserted[0])
  return afterInserted
}

const findOneIntersectionPoints = function(polygonCoordinates, lineCoordinates) {
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

const findIntersectionPoints = function (polygonCoordinates, lineCoordinates) {
  const _findOneIntersectionPoints = findOneIntersectionPoints
  let ntersectionPoints = []
  
  for (let i = 0, len = lineCoordinates.length - 1; i < len ; i++) {
    const firstPoint = lineCoordinates[i]
    const endPoint = lineCoordinates[i + 1]
    
    const intersectionPoints = _findOneIntersectionPoints(polygonCoordinates, [firstPoint, endPoint])
    intersectionPoints.forEach( ntp => {
      ntp.intersectIndex = i
      ntp.intersectFrom = {
        fromPoint: firstPoint,
        endPoint: endPoint
      }
    })
    
    ntersectionPoints = ntersectionPoints.concat(intersectionPoints)
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
