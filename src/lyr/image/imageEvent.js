/**
 * Created by zhangyong on 2017/6/6.
 */

import BaseEvent from '../../core/baseevent'

export default class ImageEvent extends BaseEvent {
  constructor (type, image) {
    super(type)
    
    this.image = image
  }
  
}


ImageEvent.Type = {
  
  /**
   * Triggered when an image starts loading.
   * @api
   */
  IMAGELOADSTART: 'imageloadstart',
  
  /**
   * Triggered when an image finishes loading.
   * @api
   */
  IMAGELOADEND: 'imageloadend',
  
  /**
   * Triggered if image loading results in an error.
   * @api
   */
  IMAGELOADERROR: 'imageloaderror'
  
}