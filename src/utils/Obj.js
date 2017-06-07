/**
 * Created by zhangyong on 2017/6/5.
 */


const Obj = {}



Obj.getValues = function (object) {
  const values = []
  for (let property in object) {
    values.push(object[property])
  }
  return values
}

Obj.clear = function (object) {
  for (let property in object) {
    delete object[property]
  }
}


export default {
  Obj
}