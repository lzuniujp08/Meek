/**
 * Created by zypc on 2016/11/28.
 */

import {Config} from 'meek/config'
import Counter from 'utils/counter'
import Helpers from 'utils/helpers'
import Obj from 'utils/obj'
import {Math} from 'utils/math'
import {Coordinate} from 'utils/coordinate'
import {Canvas} from 'utils/canvas'

import {GeometryUtil} from 'geometry/support/geometryutil'
import {ExtentUtil} from 'geometry/support/extentutil'
import {EventType} from 'meek/eventtype'
import {Style} from 'style/style'

import Event from 'core/event'
import EventManager from 'core/eventmanager'
import BaseObject from 'core/baseobject'

import Geometry from 'geometry/geometry'
import Extent from 'geometry/extent'
import Point from 'geometry/point'
import Line from 'geometry/line'
import Polygon from 'geometry/polygon'

import {ImageState} from 'lyr/image/imagestate'
import {ImageEvent} from 'lyr/image/imageevent'
import SingleImage from 'lyr/image/singleimage'

import BaseStyle from 'style/basestyle'
import PointStyle from 'style/pointstyle'
import LineStyle from 'style/linestyle'
import FillStyle from 'style/fillstyle'
import TextStyle from 'style/textstyle'

import BaseLayer from 'lyr/baselayer'
import FeatureLayer from 'lyr/featurelayer'
import SingleImageLayer from 'lyr/singleimagelayer'
import Renderer from 'renderer/renderer'
import CanvasRenderer from 'renderer/canvas/canvasrenderer'
import Component from 'components/component'
import Draw from 'components/draw'
import DrawEvent from 'components/drawevent'
import Select from 'components/select'
import Modify from 'components/modify'
import DragPan from 'components/dragpan'
import Kinetic from 'components/kinetic'
import MouseWheelZoom from 'components/mousewheelzoom'


import BrowserEvent from 'meek/browserevent'
import SelectEvent from 'components/selectevent'
import FeatureEvent from 'meek/featureevent'
import ModifyEvent from 'components/modifyevent'

import BrowserEventHandler from 'meek/browsereventhandler'
import Feature from 'meek/feature'
import Map from 'meek/map'
import View from 'meek/view'
import Overlay from 'meek/overlay'

import GeoJSON from 'data/json/geojson'

import intersects from 'geometry/analysis/intersects'
import splitPolygonByPolyline from 'geometry/analysis/splitpolygon'

const version = VERSION

export default {
  Config,
  Coordinate,
  Canvas,
  Event,
  SelectEvent,
  FeatureEvent,
  ModifyEvent,
  EventManager,
  BaseObject,
  Counter,
  Helpers,
  ImageState,
  ImageEvent,
  SingleImage,
  Geometry,
  Extent,
  Point,
  Line,
  Polygon,
  Style,
  BaseStyle,
  PointStyle,
  LineStyle,
  FillStyle,
  TextStyle,
  BaseLayer,
  FeatureLayer,
  SingleImageLayer,
  Renderer,
  CanvasRenderer,
  Component,
  Draw,
  DrawEvent,
  BrowserEvent,
  BrowserEventHandler,
  EventType,
  Feature,
  Map,
  View,
  Overlay,
  GeometryUtil,
  ExtentUtil,
  Select,
  Modify,
  DragPan,
  Kinetic,
  Obj,
  Math,
  MouseWheelZoom,
  GeoJSON,
  version,
  intersects,
  splitPolygonByPolyline
}
