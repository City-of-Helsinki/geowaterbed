makeMap = ->
    RETINA_MODE = window.devicePixelRatio > 1

    getMaxBounds = (layer) ->
        L.latLngBounds L.latLng(59.5, 24.2), L.latLng(60.5, 25.5)

    wmtsPath = (style, language) ->
        stylePath =
            if style == 'accessible_map'
                if language == 'sv'
                    "osm-sm-visual-sv/etrs_tm35fin"
                else
                    "osm-sm-visual/etrs_tm35fin"
            else if RETINA_MODE
                if language == 'sv'
                    "osm-sm-sv-hq/etrs_tm35fin_hq"
                else
                    "osm-sm-hq/etrs_tm35fin_hq"
            else
                if language == 'sv'
                    "osm-sm-sv/etrs_tm35fin"
                else
                    "osm-sm/etrs_tm35fin"
        path = [
            "http://geoserver.hel.fi/mapproxy/wmts",
            stylePath,
            "{z}/{x}/{y}.png"
        ]
        path.join '/'

    makeLayer =
        tm35:
            crs: ->
                crsName = 'EPSG:3067'
                projDef = '+proj=utm +zone=35 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
                bounds = L.bounds L.point(-548576, 6291456), L.point(1548576, 8388608)
                originNw = [bounds.min.x, bounds.max.y]
                crsOpts =
                    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125]
                    bounds: bounds
                    transformation: new L.Transformation 1, -originNw[0], -1, originNw[1]
                new L.Proj.CRS crsName, projDef, crsOpts

            layer: (opts) ->
                L.tileLayer wmtsPath(opts.style, opts.language),
                    maxZoom: 15
                    minZoom: 6
                    continuousWorld: true
                    tms: false

        gk25:
            crs: ->
                crsName = 'EPSG:3879'
                projDef = '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'

                bounds = [25440000, 6630000, 25571072, 6761072]
                new L.Proj.CRS.TMS crsName, projDef, bounds,
                    resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125]

            layer: (opts) ->
                geoserverUrl = (layerName, layerFmt) ->
                    "http://geoserver.hel.fi/geoserver/gwc/service/tms/1.0.0/#{layerName}@ETRS-GK25@#{layerFmt}/{z}/{x}/{y}.#{layerFmt}"
                if opts.style == 'ortographic'
                    new L.Proj.TileLayer.TMS geoserverUrl("hel:orto2013", "jpg"), opts.crs,
                        maxZoom: 12
                        minZoom: 2
                        continuousWorld: true
                        tms: false
                else
                    guideMapUrl = geoserverUrl("hel:Karttasarja", "gif")
                    guideMapOptions =
                        maxZoom: 12
                        minZoom: 2
                        continuousWorld: true
                        tms: false
                    (new L.Proj.TileLayer.TMS guideMapUrl, opts.crs, guideMapOptions).setOpacity 0.8

    layerMaker = makeLayer['tm35']
    crs = layerMaker.crs()

    options = {crs: crs, language: 'fi', style: null}
    tileLayer = layerMaker.layer options

    mapOptions =
        crs: crs
        continuusWorld: true
        worldCopyJump: false
        closePopupOnClick: false
        maxBounds: getMaxBounds options.style
        layers: [tileLayer]

    window.map = L.map('map', mapOptions).setView [60.171944, 24.941389], 10

makeMap()


makeMark = (data) ->
    console.log data.title, data.x, data.y
    marker = L.marker([data.x, data.y], { #60.171855296861, 24.9424839040419
        'title' : data.title,
        riseOnHover: true}
    ).addTo(map);
    marker.bindPopup(data.content);


makeMarks = () ->
    for id, obs of SERIES.observators
        makeMark
            x: obs.location.x
            y: obs.location.y
            title: obs.name
            content: obs.avg


makeMarks()