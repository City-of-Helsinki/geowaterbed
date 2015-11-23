// Generated by CoffeeScript 1.9.3
(function() {
  var center_marker, create_map, makeMap;

  makeMap = function() {
    var RETINA_MODE, crs, getMaxBounds, layerMaker, makeLayer, mapOptions, options, tileLayer, wmtsPath;
    RETINA_MODE = window.devicePixelRatio > 1;
    getMaxBounds = function(layer) {
      return L.latLngBounds(L.latLng(59.5, 24.2), L.latLng(60.5, 25.5));
    };
    wmtsPath = function(style, language) {
      var path, stylePath;
      stylePath = style === 'accessible_map' ? language === 'sv' ? "osm-sm-visual-sv/etrs_tm35fin" : "osm-sm-visual/etrs_tm35fin" : RETINA_MODE ? language === 'sv' ? "osm-sm-sv-hq/etrs_tm35fin_hq" : "osm-sm-hq/etrs_tm35fin_hq" : language === 'sv' ? "osm-sm-sv/etrs_tm35fin" : "osm-sm/etrs_tm35fin";
      path = ["http://geoserver.hel.fi/mapproxy/wmts", stylePath, "{z}/{x}/{y}.png"];
      return path.join('/');
    };
    makeLayer = {
      tm35: {
        crs: function() {
          var bounds, crsName, crsOpts, originNw, projDef;
          crsName = 'EPSG:3067';
          projDef = '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
          bounds = L.bounds(L.point(-548576, 6291456), L.point(1548576, 8388608));
          originNw = [bounds.min.x, bounds.max.y];
          crsOpts = {
            resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125],
            bounds: bounds,
            transformation: new L.Transformation(1, -originNw[0], -1, originNw[1])
          };
          return new L.Proj.CRS(crsName, projDef, crsOpts);
        },
        layer: function(opts) {
          return L.tileLayer(wmtsPath(opts.style, opts.language), {
            maxZoom: 15,
            minZoom: 6,
            continuousWorld: true,
            tms: false
          });
        }
      },
      gk25: {
        crs: function() {
          var bounds, crsName, projDef;
          crsName = 'EPSG:3879';
          projDef = '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';
          bounds = [25440000, 6630000, 25571072, 6761072];
          return new L.Proj.CRS.TMS(crsName, projDef, bounds, {
            resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125]
          });
        },
        layer: function(opts) {
          var geoserverUrl, guideMapOptions, guideMapUrl;
          geoserverUrl = function(layerName, layerFmt) {
            return "http://geoserver.hel.fi/geoserver/gwc/service/tms/1.0.0/" + layerName + "@ETRS-GK25@" + layerFmt + "/{z}/{x}/{y}." + layerFmt;
          };
          if (opts.style === 'ortographic') {
            return new L.Proj.TileLayer.TMS(geoserverUrl("hel:orto2013", "jpg"), opts.crs, {
              maxZoom: 12,
              minZoom: 2,
              continuousWorld: true,
              tms: false
            });
          } else {
            guideMapUrl = geoserverUrl("hel:Karttasarja", "gif");
            guideMapOptions = {
              maxZoom: 12,
              minZoom: 2,
              continuousWorld: true,
              tms: false
            };
            return (new L.Proj.TileLayer.TMS(guideMapUrl, opts.crs, guideMapOptions)).setOpacity(0.8);
          }
        }
      }
    };
    layerMaker = makeLayer['tm35'];
    crs = layerMaker.crs();
    options = {
      crs: crs,
      language: 'fi',
      style: null
    };
    tileLayer = layerMaker.layer(options);
    mapOptions = {
      crs: crs,
      continuousWorld: true,
      worldCopyJump: false,
      closePopupOnClick: false,
      maxBounds: getMaxBounds(options.style),
      layers: [tileLayer]
    };
    return window.map = L.map('map', mapOptions).setView([60.179343303652864, 24.934389], 10);
  };

  window.markers = {};

  create_map = function() {
    var makeMark, makeMarks;
    makeMap();
    makeMark = function(data) {
      var blueMarker, markers, redMarker;
      markers = window.markers;
      blueMarker = L.ExtraMarkers.icon({
        icon: 'fa-map-marker',
        markerColor: 'blue',
        prefix: 'fa'
      });
      redMarker = L.ExtraMarkers.icon({
        icon: 'fa-map-marker',
        markerColor: 'red',
        prefix: 'fa'
      });
      markers[data.title] = L.marker([data.x, data.y], {
        'title': data.title,
        riseOnHover: true,
        icon: blueMarker
      }).addTo(map);
      markers[data.title].bindPopup(data.content);
      return markers[data.title].on('click', function(ev) {
        var key, marker;
        for (key in markers) {
          marker = markers[key];
          marker.setIcon(blueMarker);
        }
        markers[data.title].setIcon(redMarker);
        console.log(data);
        update_observator(data.title);
        return $('#container').show();
      });
    };
    makeMarks = function() {
      var id, obs, ref, results;
      ref = SERIES.observators;
      results = [];
      for (id in ref) {
        obs = ref[id];
        results.push(makeMark({
          x: obs.location.x,
          y: obs.location.y,
          title: obs.name,
          content: "Keskiarvo " + obs.avg
        }));
      }
      return results;
    };
    return makeMarks();
  };

  center_marker = function(mark_id) {
    var cM, marker;
    marker = window.markers[mark_id];
    cM = map.project(marker._latlng);
    return map.setView(map.unproject(cM), 11, {
      animate: true
    });
  };

  window.create_map = create_map;

  window.center_marker = center_marker;

}).call(this);

//# sourceMappingURL=servicemap.js.map
