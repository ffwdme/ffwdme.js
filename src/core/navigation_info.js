var Class = require('./class');

var NavigationInfo = Class.extend({
  /**
   * Creates a new navigation info object.
   *
   * @class The navigation info object is passed by the
   * navigation handler via the onRoute/offRoute events
   * and contains useful information for interactive
   * route guidance.
   *
   * It is passed to the event listeners of the
   * ffwdme.Event.NAVIGATION_ON_ROUTE and ffwdme.Event.NAVIGATION_OFF_ROUTE
   * events when a navigation was started.
   *
   * @augments ffwdme.Class
   * @constructs
   *
   */
  constructor: function(options) {
    this.position = options.nearest.point;
    this.positionRaw = options.raw.point;
    this.nearest = options.nearest;
    this.raw = options.raw;
    this.navigation = options.navigation;
    this.route = options.route;

    this.finalDirection = (this.nearest.directionIndex + 1 === this.route.directions.length);

    this.arrived = this.finalDirection && ffwdme.utils.Geo.distance(this.positionRaw, this.route.destination()) <= 35; // you arrived

    this.onRoute = options.onRoute;

    if (!this.onRoute) return;
    // Set directions
    this.currentDirection = this.route.directions[this.nearest.directionIndex];
    this.nextDirection = this.route.directions[this.nearest.directionIndex + 1];

    this.calculateDistances();
    this.calculateRatios();
    this.calculateTimes();
  },

  calculateRatios: function() {
    // The already completed distance of the direction
    var completedDistanceOfDirection = this.currentDirection.distance - this.distanceToNextDirection;
    var ratioCompletedDirection = completedDistanceOfDirection / this.currentDirection.distance;
    var round = Math.round;

    ratioCompletedDirection = round(ratioCompletedDirection * 100)/ 100;

    // TODO - This is a pretty dirty fix to prevent a negative ratio.
    if (ratioCompletedDirection < 0.01) ratioCompletedDirection = 0.01;

    this.ratioCompletedDirection = ratioCompletedDirection;

    var ratioCompletedRoute = (this.route.summary.distance - this.distanceToDestination) / this.route.summary.distance;
    ratioCompletedRoute = round(ratioCompletedRoute * 100)/ 100;

    // TODO - This is a pretty dirty fix to prevent a negative ratio.
    if (ratioCompletedRoute < 0.01) ratioCompletedRoute = 0.01;

    this.ratioCompletedRoute = ratioCompletedRoute;
  },

  calculateTimes: function() {
    // estimated time to the next direction in seconds...
    this.timeToNextDirection = Math.round( (1 - this.ratioCompletedRoute) * this.currentDirection.duration );
    this.timeToDestination = Math.round( (1 - this.ratioCompletedRoute) * this.route.summary.duration );
  },

  calculateDistances: function() {

    var geo = ffwdme.utils.Geo;
    // practical tests have proven we should
    // substract 10m from the distances to
    // because of the fuzzy gps position
    var manualDistanceOffset = 10;
    var directions = this.route.directions;

    // data
    var currentDirection =  this.route.directions[this.nearest.directionIndex];
    var nextPathPoint = currentDirection.path[this.nearest.nextPathIndex];

    // distance vars
    var distanceToNextPath = geo.distance(this.position, nextPathPoint);
    var distanceToNextDirection, distanceToDestination, i, len;

    distanceToNextDirection = distanceToNextPath;
    for (i = this.nearest.nextPathIndex, len = currentDirection.path.length - 1; i < len; i++) {
      if (!currentDirection.path[i+1]) break;
      distanceToNextDirection += geo.distance(currentDirection.path[i], currentDirection.path[i+1]);
    }
    if (distanceToNextDirection >= 10) distanceToNextDirection -= manualDistanceOffset;
    this.distanceToNextDirection = distanceToNextDirection;

    distanceToDestination = distanceToNextDirection;
    for (i = this.nearest.directionIndex + 1, len = directions.length; i < len; i++) {
      distanceToDestination += directions[i].distance;
    }
    this.distanceToDestination = distanceToDestination;
  },

  /**
   * @type {Object}
   */
  nearest: null,

  /**
   * @type {Object}
   */
  raw: null,

  /**
   * The raw GPS values derived by the device.
   *
   * @type {Position}
   */
  positionRaw: null,

  /**
   * The interpolated GPS values as the
   * navigation tried to map them to the current
   * route.
   *
   * @type {Position}
   */
  position: null,

  /**
   * The distance to the next direction in meters.
   *
   * @type {Int}
   */
  distanceToNextDirection: null,

  /**
   * The distance to the destination in meters.
   *
   * @type {Int}
   */
  distanceToDestination: null,

  /**
   * The time to the next direction in seconds.
   *
   * @type {Int}
   */
  timeToNextDirection: null,

  /**
   * The time to the destination in seconds.
   *
   * @type {Int}
   */
  timeToDestination: null,

  /**
   * The ratio of how much of the current direction has been
   * completed (from 0.00 to 1.00).
   *
   * @type {String}
   */
  ratioCompletedDirection: null,

  /**
   * The ratio of how much of the whole route has been
   * completed (from 0.00 to 1.00).
   *
   * @type {String}
   */
  ratioCompletedRoute: null,

  /**
   * The next direction/turn on the route.
   *
   * @type {ffwdme.RoutingServiceResponse.Direction}
   */
  nextDirection: null,

  /**
   * If true, this is the last direction and the driver is approaching the finishing line.
   *
   * @type {Boolean}
   */
  finalDirection: null,

  /**
   * If true, the driver arrived at his destination.
   * At the moment this is if the driver is on the last direction and the linear distance between
   * driver and destination is below 35 meters.
   *
   * @type {Boolean}
   */
  arrived: null

});

module.exports = NavigationInfo;
