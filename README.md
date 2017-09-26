# Meek

Meek 是一个集成绘图、编辑、渲染、空间分析的javascript库，基于 HTML5 Canvas 来实现，

主要功能包括：

- 图片地图放大、缩小、拖动，全图切换和缩放比例显示（支持快捷键操作）

- 点、多段线、多边形、矩形、平行四边形的绘制，多段线、多边形的自由绘制
 
- 点、矩形平移，矩形、多边形、多段线边和顶点编辑，平行四边形编辑
 
- 支持复合多边形(`mutilpolygon`)、带洞多边形(`holepolygon`)
 
- 支持图形的点选、鼠标悬浮选中，支持图形多选(ctrl键)
 
- 支持点、线、面的样式设置与渲染
 
- 支持图形的相交、包含判断，支持线分割多边形操作
 
- 支持`geojson` 数据格式

- 图片坐标映射、简单坐标转换

## 功能截图

- 绘图

<div align=center>
  <img src= "https://github.com/DTFED2017/Meek/blob/master/screenshot/meek-draw-features.png">
</div>

- 选择、渲染等

<div align=center>
  <img src= "https://github.com/DTFED2017/Meek/blob/master/screenshot/meek-select-features.png">
</div>

## Supported Browsers

需要支持 HTML5 的浏览器

## Installation

- 下载 [meek](https://github.com/DTFED2017/Meek.git)

- cd 到源码根目录

- 执行 ` npm install`

- 执行 `npm run build`

- 发布版本 `npm run release`

## Samples

- 执行 `npm run build` 生成 meek.js

- 进入 `samples` 目录下，运行感兴趣的 `html` 示例 

## API

使用 yuidoc 来生成 api 文档，cd到源代码目录，执行命令

    yuidoc

## Authors

**zy**

- [Email](1106408264@qq.com )
- [QQ](1106408264)
