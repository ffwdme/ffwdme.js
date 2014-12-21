module.exports =
/**
  * This is a container for helper functions that can be mixed into other objects
  */
{
  EARTH_RADIUS: 6378137,

  DEG_TO_RAD_FACTOR: Math.PI / 180,

  /**
   * Returns the distance between two LatLng objects in meters.
   *
   * Slightly modified version of the harversine formula used in Leaflet:
   *  https://github.com/Leaflet/Leaflet
   */
  distance: function (p1, p2) {
    // convert degrees to radians
    var lat1 = p1.lat * this.DEG_TO_RAD_FACTOR;
    var lat2 = p2.lat * this.DEG_TO_RAD_FACTOR;
    var a = Math.sin(lat1) * Math.sin(lat2) +
        Math.cos(lat1) * Math.cos(lat2) * Math.cos((p2.lng - p1.lng) * this.DEG_TO_RAD_FACTOR);

    return parseInt(this.EARTH_RADIUS * Math.acos(Math.min(a, 1)));
  },

  /**
   * Returns the closest point on a line
   * to another given point.
   *
   */
  closestOnLine: function(s1, s2, p){
    var x1 = s1.lat, y1 = s1.lng, x2 = s2.lat, y2 = s2.lng, px = p.lat, py = p.lng;
    var xDelta = x2 - x1;
    var yDelta = y2 - y1;

    //p1 and p2 cannot be the same point
    if ((xDelta === 0) && (yDelta === 0)) {
      return s1;
    }

    var u = ((px - x1) * xDelta + (py - y1) * yDelta) / (xDelta * xDelta + yDelta * yDelta);

    var closestPoint;
    if (u < 0) {
      closestPoint = [x1, y1];
    } else if (u > 1) {
      closestPoint = [x2, y2];
    } else {
      closestPoint = [x1 + u * xDelta, y1 + u * yDelta];
    }

    return (new ffwdme.LatLng(closestPoint[0], closestPoint[1]));
  }

};
