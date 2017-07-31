/**
 * Created by zhangyong on 2017/6/9.
 */

import BaseEvent from '../core/baseevent'

/**
 * FeatureEvent类
 *
 * @class FeatureEvent
 * @extends baseevent
 * @module meek
 */
export default class FeatureEvent extends BaseEvent {
  
  constructor (type, feature) {
    super(type)
    
    this.feature = feature
  }
  
}


/**
 * Feature event definition
 * @type {{ADD_FEATURE: string, REMOVE_FEATURE: string, CLEAR: string}}
 */
FeatureEvent.EventType = {
  
  /**
   * Triggered when a feature is added.
   */
  ADD_FEATURE: 'addfeature',
  
  /**
   * Triggered when a feature is removed.
   */
  REMOVE_FEATURE: 'removefeature',
  
  /**
   * Triggered when all features are removed.
   */
  CLEAR: 'clear',
  
  /**
   * Triggered when the feature collection has been changed.
   */
  FEATURE_COLLECTION_CHANGED: 'featurecollectionchanged'
  
}