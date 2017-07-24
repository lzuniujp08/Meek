
//初始化表单

var initList = [{
  "key": "Driving road",
  "title": "行车路面",
  "children": [
    { "key": "motorway",
      "title": "机动车道",
    },
    { "key": "non-motor lane",
      "title": "非机动车道",
    },
    { "key": "footwalk",
      "title": "人行道",
    },
    {
      "key": "depot",
      "title": "停车场",
    },
    {
      "key": "railway",
      "title":"铁轨路",
    },
    {
      "key": "Other road",
      "title": "其他路面",
    },
  ]
},{
  "key": "motor vehicle",
  "title": "机动车辆",
  "children": [
    {
      "key": "Car",
      "title": "小型汽车",
    },
    {
      "key": "truck",
      "title": "卡车",
    },
    {
      "key": "bus",
      "title": "巴士",
    },
    {
      "key": "on rails",
      "title": "有轨电车",
    },
    {
      "key": "motorcycle",
      "title": "摩托车",
    },
    {
      "key": "motor homes",
      "title": "房车",
    },
    {
      "key": "trailer",
      "title": "拖车",
    },
    {
      "key": "tricycle",
      "title": "三轮车",
    },
  ]
},{
  "key": "non-automatic vehicles",
  "title": "非机动车辆",
  "children": [
    {
      "key": "bicycle",
      "title": "自行车",
    },
    {
      "key": "barrow",
      "title": "行李车",
    },
    {
      "key": "baby carriage",
      "title": "婴儿车",
    }
  ]
},{
  "key": "Person",
  "title": "行人",
  "childrn": [
    {
      "key" : "Person",
      "title": "行人",
    },
    {
      "key": "rider",
      "title": "骑车人",
    },
    {
      "key": "sitting",
      "title": "坐着的人",
    },
  ]
},{
  "key": "Other dynamic objects",
  "title": "其他动态物体",
}]

/**
 * 获取表单内容
 * @param  {[type]} treeSource [description]
 * @return {[type]} [description]
 */
var getFormContent = function (treeSource) {
  var treeDom = '';
  if (treeSource) {
    treeSource.forEach(function (item) {
      var childrenDom = '';
      if (item.children) {
        var childrenData = item.children;
        childrenData.forEach(function (child) {
          childrenDom += '<li data-key="' + child.key + '" data-title="' + child.title + '"><span class="leaf">' + child.title + '</span></li>';
        });
        treeDom += '<li data-key="' + item.key + '" data-title="' + item.title + '"><span class="folder">' + item.title + '</span><ul>' + childrenDom + '</ul></li>';
      }else{
        treeDom += '<li data-key="' + item.key + '" data-title="' + item.title + '"><span class="folder">' + item.title + '</span></li>';
      }
    });
    treeDom = '<ul id="J_tree_view" class="filetree treeview">' + treeDom + '</ul>';
    return treeDom;
  }
};


var templet = '<div class="tabCon">'+
  '<div id = "J_attribute_form" class="" style="opacity: 1;"></div>'+
  '</div>'



//表单显示隐藏
function formClose(display) {
  display ? J_mark_form.style.display = 'block' : J_mark_form.style.display = 'none'
}

//表单删除按钮
var J_form_deteleFn = function(overlay,featureLayer,currentFeature, selectTool) {
  overlay.position = undefined
  J_form_delete.blur()
  featureLayer.removeFeature(currentFeature)
  selectTool.clear()
  return false
}

//表单取消 表单叉号
var J_form_cancelFn= function(overlay,featureLayer,currentFeature, selectTool) {
  overlay.position = undefined
  J_form_cancel.blur()

  // 点击关闭，相当于清空选择集
  selectTool.clear()

  if(currentFeature.displayText === undefined){
    featureLayer.removeFeature(currentFeature)
    selectTool.clear()
  }

  return false
}


//切割完成

//	$("#J_tree_view > li").mouseover(function(){
// var title = $(this)[0].getAttribute('data-title')
//   if(title === '机动车道'){
// $(this).children('ul').show()
// }else{
// $('#J_tree_view > li > ul').hide();
//}
//});
