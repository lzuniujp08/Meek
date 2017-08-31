<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Draw features</title>
  <link rel="stylesheet" href="../css/dt.css">


</head>
<body>

<div id="map" style="width:100%;height:100%;background:#b5d0d0"></div>

<form class="form-inline">
  <label>选择绘图类型 &nbsp;</label>
  <select id="type">
    <option value="Line">line</option>
    <option value="Polygon">polygon</option>
  </select>
</form>

<script src="../dist/meek.js"></script>
<script src="freehand-draw-features.js"></script>
</body>
</html>
