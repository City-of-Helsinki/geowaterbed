
makeCRS = function() {
  var bounds, crsName, projDef;
  crsName = 'EPSG:3879';
  projDef = '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
  bounds = [25440000, 6630000, 25571072, 6761072];
  return new L.Proj.CRS.TMS(crsName, projDef, bounds, {
    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625]
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

var tileurl = "http://geoserver.hel.fi/geoserver/gwc/service/tms/1.0.0/" + layerName + "@ETRS-GK25@" + layerFmt + "/{z}/{x}/{y}." + layerFmt;

console.log("que", tileurl);

var tileOptions = {
    maxZoom: 12,
    minZoom: 2,
    continuousWorld: true,
    tms: false
};

var layers = {'eka' : new L.Proj.TileLayer.TMS(tileurl, crs, tileOptions)}

// L.tileLayer(tileurl, crs, tileOptions).addTo(map);


var mapOptions = {
  crs: crs,
  continuusWorld: true,
  worldCopyJump: false,
  zoomControl: false,
  closePopupOnClick: false,
  layers:  [new L.Proj.TileLayer.TMS(tileurl, crs, tileOptions)]
};

var map = L.map('map', mapOptions).setView([60.171944, 24.941389], 5);

//L.control.layers(layers).addTo(map);

var marker = L.marker([60.171855296861, 24.9424839040419]).addTo(map);
