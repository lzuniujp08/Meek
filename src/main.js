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

import GeometryUtil from 'geometry/support/geometryutil'
import {ExtentUtil} from 'geometry/support/extentutil'
import {EventType} from 'meek/eventtype'
import {Style} from 'style/style'

import Event from 'core/event'
import EventManager from 'core/eventmanager'

import Geometry from 'geometry/geometry'
import Extent from 'geometry/extent'
import Point from 'geometry/point'
import Line from 'geometry/line'
import Polygon from 'geometry/polygon'
import MutilPolygon from 'geometry/mutilpolygon'
import Parallelogram from 'geometry/parallelogram'

import {ImageState} from 'lyr/image/imagestate'
import {ImageEvent} from 'lyr/image/imageevent'
import SingleImage from 'lyr/image/singleimage'

import PointStyle from 'style/pointstyle'
import LineStyle from 'style/linestyle'
import FillStyle from 'style/fillstyle'
import TextStyle from 'style/textstyle'

import FeatureLayer from 'lyr/featurelayer'
import SingleImageLayer from 'lyr/singleimagelayer'
import Draw from 'components/draw'
import DrawEvent from 'components/drawevent'
import Select from 'components/select'
import Modify from 'components/modify'
import DragPan from 'components/dragpan'
import MouseWheelZoom from 'components/mousewheelzoom'

import BrowserEvent from 'meek/browserevent'
import SelectEvent from 'components/selectevent'
import FeatureEvent from 'meek/featureevent'
import ModifyEvent from 'components/modifyevent'

import Control from 'control/control'
import Zoom from 'control/zoom'

import Feature from 'meek/feature'
import Map from 'meek/map'
import View from 'meek/view'
import Overlay from 'meek/overlay'

import GeoJSON from 'data/json/geojson'

import intersects from 'geometry/analysis/intersects'
import splitPolygonByPolyline from 'geometry/analysis/splitpolygon'
import contains from 'geometry/analysis/contains'
import polygonWithHole from 'geometry/analysis/polygonwithhole'

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
  MutilPolygon,
  Parallelogram,
  Style,
  PointStyle,
  LineStyle,
  FillStyle,
  TextStyle,
  FeatureLayer,
  SingleImageLayer,
  Draw,
  DrawEvent,
  BrowserEvent,
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
  Control,
  Zoom,
  Obj,
  Math,
  MouseWheelZoom,
  GeoJSON,
  version,
  intersects,
  splitPolygonByPolyline,
  contains,
  polygonWithHole
}
