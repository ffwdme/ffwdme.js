var GeoProviderPlayerLocal = require('./geoprovider/player_local');
var GeoProviderRecorder = require('./geoprovider/recorder');
var ComponentGeolocation = require('./components/geolocation');
var ComponentNavInfo = require('./components/nav_info');
var ComponentRouting = require('./components/routing');

;(function(ffwdme){
  ffwdme.debug = {
    geoprovider: {
      PlayerLocal: GeoProviderPlayerLocal,
      Recorder: GeoProviderRecorder
    },
    components: {
      Geolocation: ComponentGeolocation,
      NavInfo: ComponentNavInfo,
      Routing: ComponentRouting
    }
  };
})(ffwdme);
