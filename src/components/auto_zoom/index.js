var Base = require('../base');

var AutoZoom = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'onGeopositionUpdate');

    ffwdme.on('geoposition:update', this.onGeopositionUpdate);
  },

  attrAccessible: ['map'],

  cachedZoomLevel: null,

  cachedZoomCount: 0,

  // meters per second
  zoomLevelBySpeed: function(speed) {
    // up to 40 km/h
    if (speed < 11) {
      return 17;
    } else if (speed < 22) {
      return 15;
    } else {
      return 13;
    }
  },

  onGeopositionUpdate: function(e) {

    if (!this.map.canControlMap(this)) return;

    var speed = e.geoposition.coords.speed;
    var zoom = this.zoomLevelBySpeed(speed);

    if (this.cachedZoomLevel != zoom) {
      this.cachedZoomLevel = zoom;
      this.cachedZoomCount = 0;
      return;
    }

    if (this.cachedZoomCount < 2) return this.cachedZoomCount++;

    this.map.setZoom(zoom);
  }
});

module.exports = AutoZoom;
