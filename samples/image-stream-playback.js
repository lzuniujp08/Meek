window.onload = function () {
  var extent = [0, 0, 960, 670];
  
  var imageLen = 15
  
  var images = new Array(imageLen)
  for (var i = 0;i < imageLen; i++) {
    var img = new Image()
    img.src = 'source/weather/weather-'+i+'.jpg'
    images[i] = img
  }
  
  var imageLayer = new Datatang.SingleImageLayer({
    url: 'source/weather/weather-0.jpg',
    imageExtent: extent,
    projection: {
      extent: extent
    }
  })
  
  var map = new Datatang.Map({
    layers: [
      imageLayer
    ],
    target: 'map',
    view: new Datatang.View({
      projection: {
        extent: extent
      },
      center: Datatang.ExtentUtil.getCenter(extent),
      zoom: 2,
      maxZoom: 8
    })
  });
  
  setInterval(changeImages, 500)
  
  var count = 1
  function changeImages() {
    
    if (count > imageLen - 1) {
      count = 1
    }
    
    var url = images[count]
    imageLayer.imageSrc = url.src
  
    count ++
    
    map.render()
  }
}