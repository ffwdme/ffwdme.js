var Track = ffwdme.Class.extend({
/**
 * @augments ffwdme.Class
 * @constructs
 *
 */
  constructor: function(){
    this.points = [];
  },

  /**
   *  The geo points of this track.
   *  A point has the same interface as a HTML5 geolocation api Position object.
   *  (see http://dev.w3.org/geo/api/spec-source.html#position), except on additional
   *  attribute "timestampRelative" which represents the time in milliseconds passed since the
   *  beginning of the track.
   */
  points: null,

  /**
   *  The first timestamp of the track (in milliseconds) that was passed
   *  by the geolocation interface.
   *  @type {Integer}
   */
  startTime: null,

  /**
   *  Appends a position object to the track.
   *  If using the navigator.geolocation interface it will be
   *  a html5 geoposition Position object.
   *
   *  @type {Position}
   */
  add: function(geoposition) {
    if (!this.points.length) {
      this.startTime = geoposition.timestamp;
    }

    var geoAttr = Track.locationAttributes,
        newLocation = {
          coords:             {},
          timestamp:          geoposition.timestamp,
          timestampRelative:  geoposition.timestamp - this.startTime
        };

    for (var i = 0, len = geoAttr.length; i < len; i++) {
      try {
        newLocation.coords[geoAttr[i]] = geoposition.coords[geoAttr[i]];
      } catch (e) {
        console.info("error while working with: " + geoAttr[i]);
      }
    }

    this.points.push(newLocation);
    return this;
  },

  /**
   *  Returns a JSON representation of the track.
   *
   *  @return {String}
   */
  toJSON: function() {
    var obj = {
      track: {
        points: this.points
      }
    };

    return JSON.stringify(obj);
  },

  /*
   *  Parses the track information from a JSON string.
   *
   *  @param {String} jsonStr
   *    A string representation of a track.
   */
  parseJSON: function(jsonStr) {
    if (!jsonStr) return;
    var trackObj = JSON.parse(jsonStr);
    this.points = trackObj.track.points;
  }
},
{
  /**
   *  The attributes from a html5 position object that should be copied into a new track point.
   *  @type {Array}
   */
  locationAttributes: [ "latitude", "longitude", "altitude", "accuracy", "altitudeAccuracy", "heading", "speed" ]
});

module.exports = Track;
