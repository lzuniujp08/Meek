/**
 * Created by zhangyong on 2017/6/5.
 */



export function clamp (value, min, max) {
  return Math.min(Math.max(value, min), max)
}