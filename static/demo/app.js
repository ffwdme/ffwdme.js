function init() {

  ffwdme.on('geoposition:init', function() {
    console.info("Waiting for initial geoposition...");
  });

  ffwdme.on('geoposition:ready', function() {
    console.info("Received initial geoposition!");
    $('#loader').remove();
  });

  // setup ffwdme
  ffwdme.initialize({
    routing: 'GraphHopper',
    graphHopper: {
      apiKey: CREDENTIALS.graphHopper
    }
  });

  var tileURL = "https://api.tiles.mapbox.com/v4/" + CREDENTIALS.mapboxId + "/{z}/{x}/{y}.png?access_token=" + CREDENTIALS.mapboxToken;
  var map = new ffwdme.components.Leaflet({ el: $('#map'), tileURL: tileURL, center: { lat: 49.90179, lng: 8.85723 } });

  var audioData = {"file": ffwdme.defaults.audioBaseUrl + 'male/voice',
                    "meta_data": { "INIT": { "start": 0.01, "length": 8.01 }, "C": { "start": 8.01, "length": 8.01 }, "TL_now": { "start": 16.01, "length": 8.01 }, "TL_100": {"start": 24.01,"length": 8.01},"TL_500": {"start": 32.01,"length": 8.01},"TL_1000": {"start": 40.01,"length": 8.01},"TSLL_now": {"start": 48.01,"length": 8.01 },"TSLL_100": {"start": 56.01,"length": 8.01},"TSLL_500": {    "start": 64.01,    "length": 8.01  },  "TSLL_1000": {    "start": 72.01,    "length": 8.01  },  "TSHL_now": {    "start": 80.01,    "length": 8.01  },  "TSHL_100": {    "start": 88.01,    "length": 8.01  },  "TSHL_500": {    "start": 96.01,    "length": 8.01  },  "TSHL_1000": {    "start": 104.01,    "length": 8.01  },  "TR_now": {    "start": 112.01,    "length": 8.01  },  "TR_100": {    "start": 120.01,    "length": 8.01  },  "TR_500": {    "start": 128.01,    "length": 8.01  },  "TR_1000": {    "start": 136.01,    "length": 8.01  },  "TSLR_now": {    "start": 144.01,    "length": 8.01  },  "TSLR_100": {    "start": 152.01,    "length": 8.01  },  "TSLR_500": {    "start": 160.01,    "length": 8.01  },  "TSLR_1000": {    "start": 168.01,    "length": 8.01  },  "TSHR_now": {    "start": 176.01,    "length": 8.01  },  "TSHR_100": {    "start": 184.01,    "length": 8.01  },  "TSHR_500": {    "start": 192.01,    "length": 8.01  },  "TSHR_1000": {    "start": 200.01,    "length": 8.01  },  "TU": {    "start": 208.01,    "length": 8.01  },  "C_100": {    "start": 216.01,    "length": 8.01  },  "C_500": {    "start": 224.01,    "length": 8.01  },  "C_1000": {    "start": 232.01,    "length": 8.01  },  "C_LONG":{    "start": 240.01,    "length": 8.01  },  "FINISH":{    "start": 248.01,    "length": 8.01  },  "EXIT1":{    "start": 256.01,    "length": 8.01  },  "EXIT2":{    "start": 264.01,    "length": 8.01  },  "EXIT3":{    "start": 272.01,    "length": 8.01  },  "EXIT4":{    "start": 280.01,    "length": 8.01  },  "EXIT5":{    "start": 288.01,    "length": 8.01  }}};

  window.widgets = {
    map       : map,
    autozoom  : new ffwdme.components.AutoZoom({ map: map }),
    reroute   : new ffwdme.components.AutoReroute({ parent: '#playground' }),

    speed     : new ffwdme.components.Speed({ parent: '#playground', grid: { x: 1, y: 12 } }),
    destTime  : new ffwdme.components.TimeToDestination({ parent: '#playground', grid: { x: 4, y: 12 } }),
    destDist  : new ffwdme.components.DistanceToDestination({ parent: '#playground', grid: { x: 7, y: 12 } }),
    arrival   : new ffwdme.components.ArrivalTime({ parent: '#playground', grid: { x: 10, y: 12 } }),
    nextTurn  : new ffwdme.components.NextStreet({ parent: '#playground', grid: { x: 4, y: 11 } }),
    distance  : new ffwdme.components.DistanceToNextTurn({ parent: '#playground', grid: { x: 4, y: 10 } }),
    arrow     : new ffwdme.components.Arrow({ parent: '#playground', grid: { x: 0, y: 10 } }),
    audio     : new ffwdme.components.AudioInstructions({ parent: '#playground', grid: { x: 0, y: 6 }, bootstrapAudioData: audioData}),

    // experimental
    //  mapRotator: new ffwdme.components.MapRotator({ map: map }),
    // zoom      : new ffwdme.components.Zoom({ map: map, parent: '#playground', grid: { x: 3, y: 3 }}),
    // overview  : new ffwdme.components.RouteOverview({ map: map, parent: '#playground', grid: { x: 2, y: 2 }}),

    // debugging
    // geoloc  : new ffwdme.debug.components.Geolocation({ parent: '#playground', grid: { x: 5, y: 1 }}),
    navInfo : new ffwdme.debug.components.NavInfo(),
    routing : new ffwdme.debug.components.Routing()
  };

  if ((/debug=/).test(window.location.href)){
    $('#views-toggle').click(function(){
      $('#playground').toggleClass('hidden');
    });
    $('#views-toggle, #nav-info-trigger, #routing-trigger').removeClass('hidden');
  }
}
