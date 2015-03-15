var Class = require('./class');
var Geolocation = require('./geolocation');
var LatLng = require('./lat_lng');
var Navigation = require('./navigation');
var Route = require('./route');
var NavigationInfo = require('./navigation_info');
var RoutingBase = require('./routing/base');
var RoutingGraphHopper = require('./routing/graph_hopper');
var UtilsGeo = require('./utils/geo');
var UtilsProxy = require('./utils/proxy');

(function(global, undefined) {
  /**
    * @name ffwdme
    * @class The ffwdme base singleton
    */
  var ffwdme = {
    Class: Class,
    Geolocation: Geolocation,
    LatLng: LatLng,
    Navigation: Navigation,
    NavigationInfo: NavigationInfo,
    Route: Route,


    routing: {
      Base: RoutingBase,
      GraphHopper: RoutingGraphHopper
    },

    utils: {
      Geo: UtilsGeo,
      Proxy: UtilsProxy
    },


    /**
     * @augments ffwdme.Class
     * @constructs
     *
     * @param {Boolean} [options.ingoreGeolocation="false"]
     *   If true, the geo position of the device is not
     *   watched automatically.
     */
    initialize: function(options) {
      options = options || {};
      this.options = options;

      options.geoProvider || (options.geoProvider = window.navigator.geolocation);

      this.geolocation = new ffwdme.Geolocation(options.geoProvider);
      // start watching the geoposition
      if (!options.ingoreGeolocation) {
        this.geolocation.watchPosition({
          enableHighAccuracy: true,
          maximumAge: 30 * 1000,
          timeout: 30 * 1000
        });
      }

      if (options.routing && ffwdme.routing[options.routing]) {
        this.routingService = ffwdme.routing[options.routing];
      }

      this.navigation = new ffwdme.Navigation();
    },

    /**
     * The version of ffwdme.
     *
     * @type String
     */
    VERSION: '0.4.0',

    /**
     * Holds all callbacks for ffwdme events.
     */
    callbacks: null,

    defaults: {
      imageBaseUrl: 'components/',
      audioBaseUrl: 'components/audio_instructions/voices/'
    },

    options: {},

    /**
     * The Geolocation handler of the app that
     * is able to determine the geographic information.
     *
     * The framework will automatically choose the right
     * interface for accessing GPS informations, depending
     * on the device executing the application.
     *
     * @type ffwdme.Geolocation
     */
    geolocation: null,

    /**
     * The navigation handler used by the app.
     *
     * When a route was calculated it can be passed to
     * the navigation handler for later turn by turn
     * navigation.
     *
     * @type ffwdme.Navigation
     */
    navigation: null,

    routingService: null,

    reset: function() {
      this.callbacks = null;
      this.geolocation && this.geolocation.clearWatch();
      this.geolocation = null;
      this.routingService = null;
      this.navigation = null;
    },

    /**
     * Adds a callback for the passed event.
     *
     * @param {String} events
     *   The name of the event to register the listener to.
     * @param {Function} callback
     *   The callback to be registered.
     * @return {ffwdme}
     *   The ffwdme singleton
     */
    on: function(events, callback) {
      // create callback hashtable if it doesn't exist
      this.callbacks = this.callbacks || {};

      var list = events.split(' '), event;

      for (var i = 0, len = list.length; i < len; i++) {
        event = list[i];
        // create array for event type if it doesn't exist
        this.callbacks[event] || (this.callbacks[event] = []);
        this.callbacks[event].push(callback);
      }

      return this;
    },

    /**
     * Registers a callback for an event that only gets triggered
     * once and then detaches itself from the callback chain automatically.
     *
     * @param {String} event
     *   The name of the event to register the listener to once.
     * @param {Function} callback
     *   The callback to be registered once.
     * @return {ffwdme}
     *   The ffwdme singleton
     */
    once: function(event, callback) {
      var wrapper = function(data){
        callback(data);
        ffwdme.off(event, wrapper);
      };
      this.on(event, wrapper);
      return this;
    },

    /**
     * Removes a callback for the passed event.
     *
     * @param {String} events
     *   The event to remove the callback from.
     * @param {Function} callback
     *   The callback to be removed.
     * @return {ffwdme}
     *   The ffwdme singleton
     */
    off: function(event, callback) {
      if (!this.callbacks || !this.callbacks[event]) return this;

      var callbacks = this.callbacks[event];
      for (var i = 0, len = callbacks.length; i < len; i++) {
        if (callbacks[i] === callback) {
          this.callbacks[event].splice(i,1);
          return this;
        }
      }
      return this;
    },

    /**
     * Triggers all callbacks for the passed event type.
     * Mainly used internal by the system. Usually you DON'T have to use this method.
     *
     * @param {String} event
     *   The name of the event to be triggered.
     * @param {Object} data
     *   A hashtable containing relevant data related to the event.
     *
     * @return {ffwdme}
     *   Returns the ffwdme singleton event.
     */
    trigger: function(event, data) {
      this.callbacks = this.callbacks || {};
      // no event handler found
      if (!this.callbacks[event]) return this;
      var callbacks = this.callbacks[event];

      data || (data = {});
      data.type = event;

      // walk array backwards
      for (var len = callbacks.length, i = len-1; i >= 0; i--) {
        // call event handler
        callbacks[i](data);
      }
      return this;
    },

    /**
     * Overwrites toString to provide a better readable
     * information about the app.
     *
     * @private
     */
    toString: function() {
      return 'ffwdme.js v' + this.VERSION;
    }
  };

  // attach ffwdme to the global namespace
  global.ffwdme = ffwdme;

})(typeof window !== 'undefined' ? window : global);
