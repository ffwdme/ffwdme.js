var Class = require('./class');
var geoUtils = require('./utils/geo');

var Route = Class.extend({
  /**
   * Creates a new route object.
   *
   * @class The route object represents a calculated route
   *  as it is returned by one of the routing services.
   *
   * @augments ffwdme.Class
   * @constructs
   *
   */
  constructor: function(){

  },

  summary: null,

  directions: null,

  parse: function(json) {
    this.summary = json.summary;
    this.directions = json.directions;

    for (var i = 0, len = this.directions.length; i < len; i++) {
      var path = this.directions[i].path, newPath = [];
      for (var j = 0, plen = path.length; j < plen; j++) {
        newPath.push(new ffwdme.LatLng(path[j][0], path[j][1]));
      }
      this.directions[i].path = newPath;
    }
    return this;
  },

  start: function() {
    var firstDirection = this.directions[0];
    var firstPosition  = firstDirection.path[0];
    return firstPosition;
  },

  destination: function() {
    var lastDirection = this.directions[this.directions.length - 1];
    var lastPosition  = lastDirection.path[lastDirection.path.length - 1];
    return lastPosition;
  },

  /**
   * Tries to map the current position on the route.
   *
   * @param {ffwdme.LatLng} pos
   *   A ffwdme LatLng object
   * @param {Object} direction_index
   *   The index of the directions of the route to start
   *   searching for the nearest point of the route.
   * @param {Object} path_index
   *   The index of the single paths representing the direction
   *   above the start searching.
   * @param {Object} direction_max
   *   The maximum number of directions to go through.
   *
   * @return {Object}
   *   A hashtable containing the following information:
   *   directionIndex (int): The direction index of the nearest point found.
   *   prevPathIndex (int): The path index of the nearest point found.
   *   nextPathIndex (int): The path index of the nearest point found.
   *   distance (float): The distance to from the nearest point found to the captured position.
   *   point: (ffwdme.LatLng):The nearest point found on the route (keys: lat, lng).
   */
  nearestTo: function(pos, directionIndex, pathIndex, maxIterations){

    var nearest = {
      distance: 999999,
      point:    null,
      directionIndex: null,
      prevPathIndex: null,
      nextPathIndex: null
    };

    var geo = geoUtils;
    var len = maxIterations ? Math.min(maxIterations, this.directions.length) : this.directions.length;

    for (var i = directionIndex; i < len; i++) {
      var direction = this.directions[i];
      var pathLen = direction.path.length - 1;
      var pathStart = (i === directionIndex) ? pathIndex : 0;

      for (var j = pathStart; j < pathLen; j++) {
        var point = geo.closestOnLine(
          direction.path[j],
          direction.path[j + 1],
          pos
        );

        var distance = geo.distance(pos, point);

        // not closer than before
        if (nearest.distance < distance) continue;

        nearest.distance = distance;
        nearest.point    = point;
        nearest.directionIndex = i;
        nearest.prevPathIndex = j;
        nearest.nextPathIndex = j + 1;
      }
    }
    return nearest;
  }
}, {

  // This function is from Google's polyline utility.
  decodePolyline: function(polylineStr) {
    var len = polylineStr.length;
    var index = 0;
    var array = [];
    var lat = 0;
    var lng = 0;

    while (index < len) {
      var b;
      var shift = 0;
      var result = 0;
      do {
        b = polylineStr.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = polylineStr.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      array.push([lat * 1e-5, lng * 1e-5]);
    }

    return array;
  }
});

module.exports = Route;
