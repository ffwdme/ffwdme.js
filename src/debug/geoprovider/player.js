var Player = ffwdme.Class.extend({

  /**
   *  The player is an abstract class to play back tracks of gps positions.
   *  While it can't manipulate the native navigator.geolocation interface of
   *  the browser it uses the event model of ffwdme and triggers the geoposition:update event.
   *
   *  The recorded are supposed to provide real time simulation of
   *  navigation use cases on the desktop routes recorded with mobile devices.
   *
   *  In order to use it you must inherit from this class and implement all abstract methods.
   *  Remember: You can NOT use this class directly - only its subclasses.
   *
   *  @augments ffwdme.Class
   *  @constructs
   */
  constructor: function(options) {
  },

  /**
   *  The track that is replayed by the player.
   *  @type {ffwdme.geoprovider.Track}
   */
  track: null,

  /**
   *  The current index of the points list on the track.
   *  @type {Integer}
   */
  currentIndex: null,

  /**
   *  The current point of the track that will be passed as geo position
   *  on the next update.
   *  @type {Object}
   */
  currentPoint: null,

  /**
   *  The timeout id of the currently running loop.
   *  @type {Integer}
   */
  watchId: null,

  /**
   *  An abstract method that needs to be overwritten by inheriting classes.
   *  The load method must be implemented in order to take completely care
   *  of loading a recorded track for the player.
   */
  load: function() {},

  /**
   *  This method iterates through the points of the track and
   *  updates the geoposition of ffwdme.
   */
  loop: function() {
    this.currentPoint = this.track.points[this.currentIndex];
    var nextPoint = this.track.points[this.currentIndex+1];

    if (this.currentPoint && nextPoint) {
      var timeToWait = nextPoint.timestampRelative - this.currentPoint.timestampRelative;
      var data = {
        geoposition: this.currentPoint,
        point: new ffwdme.LatLng(this.currentPoint.coords.latitude, this.currentPoint.coords.longitude)
      };
      ffwdme.geolocation.last = data;
      ffwdme.trigger('geoposition:update', data);
      this.watchId = setTimeout(this.bind(this.loop, this), timeToWait);
      this.currentIndex++;
    }
  },

  /**
   *  Starts the playback of the track.
   */
  start: function() {
    if (this.currentIndex === null) {
      this.currentIndex = 0;
    }
    this.loop();
  },

  /**
   *  Pauses the playback of the track.
   */
  pause: function() {
    clearTimeout(this.watchId);
  },

  /**
   *  Resets the playback of the track. This means next time you start it will
   *  start from the beginning.
   */
  reset: function() {
    this.currentIndex = 0;
  },

  /**
   *  Stop the playback of the track (same as pause + reset).
   */
  stop: function() {
    this.pause();
    this.reset();
  },

  /**
   *  @void
   */
  getCurrentPosition: function(successCallback, errorCallback, options) {
    //TODO: Implement for support of the html5 geoposition api
  },

  /**
   *  @return {Integer} The watchId
   */
  watchPosition: function(successCallback, errorCallback, options) {
    //TODO: Implement for support of the html5 geoposition api
  },

  clearWatch: function(watchId) {
    //TODO: Implement for support of the html5 geoposition api
  }

});

module.exports = Player;
