var Class = require('./class');

var Geolocation = Class.extend({
  /**
 * Creates a new geo location handler. When initiating a ffwdme application,
 * an geo location handler is automatically created and attached to the app.
 *
 * @class The geo location class is an abstraction layer for accessing the geo
 * location of the device using (i.e. HTML5 Geolocation API).
 *
 * You don't have to worry about initializing this class it is automatically attached
 * to you ffwdme app.
 *
 * To get the informations about the GPS position you should register your callback
 * functions to the corresponding events.
 *
 * @augments ffwdme.Class
 * @constructs
 *
 */
  constructor: function(geoProvider){
    this.geoProvider = geoProvider;
    this.bindAll(this, 'positionUpdate', 'positionError');
  },

  /**
   * True if watching the position, false otherwise.
   *
   * @type Boolean
   */
  watching: false,

  /**
   * The watching id returned by the geo location interface.
   *
   * @type Integer
   */
  watchId: null,

  /**
   * A hashtable containing options passed to the geo location interface.
   *
   * @type Object
   */
  options: null,

  /**
   * The geo location interface used by this class, e.g. HTML5 or Google Gears.
   *
   * @type Object
   */
  geoProvider: null,

  /**
   * The last positionh retrieved by the geoprovider.
   *
   */
  last: null,

  /**
   * Immediately tries to return the current geo position.
   *
   * @param {Function} successCallback
   *   Callback function that gets triggered if the geo position could be determined.
   * @param {Function} errorCallback
   *   Callback function that gets triggered if it's not possible to determine the geo position.
   * @param {Object} options
   *   Hashtable containing options for the geo location interface.
   */
  getCurrentPosition: function(successCallback, errorCallback, options){
    this.geoProvider.getCurrentPosition(successCallback, errorCallback, options);
  },

  /**
   * Starts watching the geo position of the device. When a change is recognized,
   * the callback functions get triggered.
   *
   * Note: It's easier to handle if you register yourself for the corresponding
   * events (see ffwdme.Event).
   *
   * @param {Object} options
   *   Hashtable containing options for the geo location interface.
   * @param {Function} successCallback
   *   Callback function that gets triggered if the geo position could be determined.
   * @param {Function} errorCallback
   *   Callback function that gets triggered if it's not possible to determine the geo position.
   */
  watchPosition: function(options, successCallback, errorCallback){
    if (successCallback) ffwdme.on('geoposition:update', successCallback);
    if (errorCallback) ffwdme.on('geoposition:error', errorCallback);

    // initialize watching only once
    if (this.watching) return;

    this.watchId = this.geoProvider.watchPosition(
      this.positionUpdate,
      this.positionError,
      options
    );

    this.options = options;
    this.watching = true;
    ffwdme.trigger('geoposition:init');
  },

  clearWatch: function(){
    this.geoProvider.clearWatch(this.watchId);
  },

  /**
   * Internal callback (the only one really registered to the geo location interface)
   * triggers the corresponding event on a geo position update.
   *
   * @param {Object} position
   *   The position object recieved by the geo location interface.
   */
  positionUpdate: function(position) {
    var data = {
      geoposition: position,
      point: new ffwdme.LatLng(position.coords.latitude, position.coords.longitude)
    };

    var first = false;
    if (!this.last) first = true;
    this.last = data;

    if (first) ffwdme.trigger('geoposition:ready', data);
    ffwdme.trigger('geoposition:update', data);
  },

  /**
   * Internal callback (the only one really registered to the geo location interface)
   * triggers the corresponding event when an error occurs while a position update.
   *
   * @param {Object} error
   *   The error object recieved by the geo location interface.
   */
  positionError: function(error) {
    ffwdme.trigger('geoposition:error', { error: error });
  }
});

module.exports = Geolocation;
