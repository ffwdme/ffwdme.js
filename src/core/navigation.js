var Class = require('./class');
var geoUtils = require('./utils/geo');

var Navigation = Class.extend({
  /**
     * Creates a new navigation handler.
     *
     * @class The route navigation will check if the
     * geoposition of the device is still on the
     * calculated route.
     *
     * @augments ffwdme.Class
     * @constructs
     */
  constructor: function(options) {
    this.bindAll(this, 'getPositionOnRoute', 'rerouteCallback');
  },

  /**
     * The route object to handle.
     *
     * @type Object
     */
  route: null,

  /**
     * Holds an Array of the positions that could be
     * mapped to the route.
     *
     * Basically these are HTML GeoPosition objects
     * enriched with a _positionOnRoute hashtable.
     *
     * @type Array
     */
  _lastPositionsOnRoute: [],

  _currentPositionOnRoute: null,

  _lastDirectionPathIndex: null,

  _lastDrivingDirectionIndex: null,

  startTime: null,

  startTimeByDirection: {},

  /**
     * In case the position of the device can't
     * be mapped on the route this counter holds the
     * number of times it happened in a row.
     *
     * Will be resetted once the position can be mapped
     * again on the route.
     *
     * @type Integer
     */
  offRouteCounter: 0,

  /**
     * In case the position of the device can't
     * be mapped on the route this timestamp saves
     * the first time this occured.
     *
     * Will be resetted once the position can be mapped
     * again on the route.
     *
     * @type Integer
     */
  offRouteStartTimestamp: 0,

  // debug only
  routePointCounter: 0,

  /**
     * Time in ms that the position could not be
     * mapped to the route.
     *
     * Will be resetted once the position can be mapped
     * again on the route.
     *
     * @type Integer
     */
  offRouteTime: 0,

  reset: function(){
    this._lastPositionsOnRoute = [];
    this._currentPositionOnRoute = null;
    this._lastDirectionPathIndex = null;
    this._lastDrivingDirectionIndex = null;
    this.offRouteCounter = 0;
    this.offRouteStartTimestamp = 0;
    this.routePointCounter = 0;
  },

  /**
     *
     *
     * @param {Object} route
     *   The calculated route to handle.
     *
     */
  setRoute: function(route) {
    this.reset();
    this.route = route;

    return this;
  },


  reroute: function(options) {
    options || (options = {});

    var directions = this.route.directions,
    lastDirection = directions[directions.length-1],
    destLat = lastDirection.path ? lastDirection.path[lastDirection.path.length - 1].lat : lastDirection.start.lat,
    destLng = lastDirection.path ? lastDirection.path[lastDirection.path.length - 1].lng : lastDirection.start.lng;

    ffwdme.on('reroutecalculation:success', this.rerouteCallback);

    options.dest = new ffwdme.LatLng(destLat, destLng);
    options.rerouting = true;

    var route = new ffwdme.routingService(options).fetch();

  },

  rerouteCallback: function(response) {
    ffwdme.off('reroutecalculation:success', this.rerouteCallback);
    this.setRoute(response.route);
  },


  /**
     * Starts the navigation.
     */
  start: function() {
    // repeat last position
    this.getPositionOnRoute(ffwdme.geolocation.last);

    ffwdme.on('geoposition:update', this.getPositionOnRoute);
    this.startTime = Date.now();
  },

  /**
     * Stops the navigation
     */
  stop: function() {
    ffwdme.off('geoposition:update', this.getPositionOnRoute);
  },

  notFoundOnRoute: function(result) {

    if (this.offRouteCounter === 0) {
      this.offRouteStartTimestamp = Date.now();
    } else {
      this.offRouteTime = Date.now() - this.offRouteStartTimestamp;
    }

    this.offRouteCounter++;

    ffwdme.trigger('navigation:offroute', { navInfo: result });
  },

  getPositionOnRoute: function(position) {

    var MAX_DISTANCE = 30;//Math.max(35, Math.min(pos.coords.accuracy.toFixed(1), 50));// OR 35?!

    var nearest;
    // try to find the current position on the route
    if (!this._lastDrivingDirectionIndex) {
      nearest = this.route.nearestTo(position.point, 0, 0);
    } else {

      var jumping = this.approachInSteps();

      var jumpLen = jumping.length, currJump;
      for (var i = 0; i < jumpLen; i++) {
        currJump = jumping[i];
        nearest = this.route.nearestTo(position.point, currJump.dIndex, currJump.pIndex, currJump.max);
        if (nearest.point && nearest.distance < MAX_DISTANCE) break;
      }
    }

    this.routePointCounter++;

    var navInfo = new ffwdme.NavigationInfo({
      nearest: nearest,
      raw: position,
      navigation: this,
      route: this.route,
      onRoute: !!(nearest.point && nearest.distance < MAX_DISTANCE)
    });

    if (!navInfo.onRoute) {
      return this.notFoundOnRoute(navInfo);
    }

    this.offRouteCounter = 0;

    return ffwdme.trigger('navigation:onroute', { navInfo: navInfo });
  },

  approachInSteps: function() {
    return [
      {
        dIndex: this._lastDrivingDirectionIndex,
        pIndex: this._lastDirectionPathIndex,
        max: 2
      },
      {
        dIndex: Math.max(this._lastDrivingDirectionIndex - 2 ,0),
        pIndex: 0,
        max: 5
      },
      {
        dIndex: Math.max(this._lastDrivingDirectionIndex - 4 ,0),
        pIndex: 0,
        max: 10
      },
      {
        dIndex: 0,
        pIndex: 0,
        max: false
      }
    ];
  }

}).implement(geoUtils);


module.exports = Navigation;
