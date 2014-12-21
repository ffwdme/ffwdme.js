var BaseIcon = require('../base_icon');

var Speed = BaseIcon.extend({

  icon: 'speed/car.svg',

  defaultUnit: 'km/h',

  format: function(metersPerSecond) {
    return Math.round(metersPerSecond*3.6);
  },

  navigationOnRoute: function(e) {
    var speed = e.navInfo.raw.geoposition.coords.speed;
    if (speed) this.label(this.format(speed));
  }
});

module.exports = Speed;
