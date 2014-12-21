// for performance reasons we don't use ffwdme.Class
 var LatLng = function(lat, lng) {

  if (toString.call(lat) === '[object Array]') {
    lng = lat[1];
    lat = lat[0];
  }

  lat = parseFloat(lat);
  lng = parseFloat(lng);

  lat = Math.max(Math.min(lat, 90), -90);
  lng = (lng + 180) % 360 + (lng < -180 ? 180 : -180);

  this.lat = lat;
  this.lng = lng;
};

LatLng.prototype = {
  toString: function() {
    return 'LatLng: ' + this.lat + ', ' + this.lng;
  }
};

module.exports = LatLng;
