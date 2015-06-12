
makeCRS = function() {
  var bounds, crsName, projDef;
  crsName = 'EPSG:3067';
  //projDef = '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

  projDef = '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

  //bounds = [-548576.0, 6291456.0, 1548576.0, 8388608.0]

  bounds = L.bounds(L.point(-548576, 6291456), L.point(1548576, 8388608));

  console.log(bounds);
  originNw = [bounds.min.x, bounds.max.y];

  return new L.Proj.CRS.TMS(crsName, projDef, bounds, {
      resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
      transformation : new L.Transformation(1, -originNw[0], -1, originNw[1])
  });
};

makeHistoricalMapLayer = function(layerName, crs) {
  var geoserverUrl;

  geoserverUrl = function(layerName, layerFmt) {
    return "http://geoserver.hel.fi/geoserver/gwc/service/tms/1.0.0/" + layerName + "@ETRS-GK25@" + layerFmt + "/{z}/{x}/{y}." + layerFmt;
  };

    return new L.Proj.TileLayer.TMS(geoserverUrl(layerName, "png"), crs, {
    maxZoom: 12,
    minZoom: 2,
    continuousWorld: true,
    tms: false
  });
};

var crs = makeCRS();

console.log(crs);

var layerFmt = "png";

var layerName = "historical:1999_opaskartta";

// var tileurl = "http://geoserver.hel.fi/geoserver/gwc/service/tms/1.0.0/" + layerName + "@ETRS-GK25@" + layerFmt + "/{z}/{x}/{y}." + layerFmt;

var tileurl = 'http://geoserver.hel.fi/mapproxy/wmts/osm-sm/etrs_tm35fin/{z}/{x}/{y}.png';

console.log("que", tileurl);

var tileOptions = {
    maxZoom: 15,
    minZoom: 6,
    continuousWorld: true,
    tms: false

};

var layer = new L.TileLayer(tileurl, crs, tileOptions)

// L.tileLayer(tileurl, crs, tileOptions).addTo(map);


var mapOptions = {
  crs: crs,
  continuousWorld: true,
  worldCopyJump: false,
  zoomControl: false,
  closePopupOnClick: false,
  layers:  [layer]
};

var map = L.map('map', mapOptions).setView([60.171855296861, 24.9424839040419], 12);

//L.control.layers(layers).addTo(map);

// var marker = L.marker([60.171855296861, 24.9424839040419]).addTo(map);
