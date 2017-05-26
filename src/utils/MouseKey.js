/**
 * Created by zhangyong on 2017/5/23.
 */


import BrowserEvent from '../meek/BrowserEvent'


export function singleClick (browserEvent) {
  return browserEvent.type === BrowserEvent.SINGLE_CLICK
}





