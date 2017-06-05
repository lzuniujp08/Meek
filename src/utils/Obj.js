/**
 * Created by zhangyong on 2017/6/5.
 */


const Obj = {}



Obj.getValues = function(object) {
  const values = []
  for (let property in object) {
    values.push(object[property])
  }
  return values
}




export default {
  Obj
}