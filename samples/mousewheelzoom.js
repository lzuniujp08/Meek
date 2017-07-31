window.onload = function () {
  
  var extent = [0, 0, 1024, 968];
  
  var map = new Datatang.Map({
    layers: [
      new Datatang.SingleImageLayer({
        url: 'source/online_communities.png',
        imageExtent: extent,
        projection: {
          extent: extent
        }
      })
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
  
}
