var Track = require('./track');

var Recorder = ffwdme.Class.extend({
  /**
   *  The recorder is an abstract class to record tracks of gps positions.
   *
   *  The recorded tracks can be used together with the player for real time simulation of
   *  navigation use cases on the desktop routes recorded with mobile devices.
   *
   *  In order to use it you must inherit from this class and implement all abstract methods.
   *  Remember: You can NOT use this class directly - only subclasses.
   *
   *  @augments ffwdme.Class
   *  @constructs
   */
  constructor: function() {},

  /**
   *  The track that is recorded by the recorder.
   *  @type {ffwdme.geoprovider.Track}
   */
  track: null,

  recording: false,

  /**
   *  Callback when a new geoposition is recieved.
   */
  onUpdate: function(position) {
    this.track.add(position.geoposition);
  },

  /**
   *  Starts the recording of a track.
   */
  start: function() {
    this.track = new Track();
    this.onUpdate = this.bind(this.onUpdate, this);
    ffwdme.on('geoposition:update', this.onUpdate);
    this.recording = true;
    return this;
  },

  /**
   *  Stops the recording of the track.
   */
  stop: function() {
    ffwdme.off('geoposition:update', this.onUpdate);
    this.recording = false;
    return this;
  },

  /**
   *  An abstract method that needs to be overwritten by inheriting classes.
   *  The save method must be implemented in order to take completely care
   *  of persisting the recorded track.
   */
  save: function() {}

});

module.exports = Recorder;
