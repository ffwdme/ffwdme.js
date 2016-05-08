var Base = require('../base');

var MapRotator = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'rotateMap', 'setupRotation');

    $(window).on('resize', this.setupRotation);
    ffwdme.on('geoposition:update', this.rotateMap);

    this.setupRotation();
  },

  attrAccessible: ['map'],

  last_heading: 0,

  rotating: false,

  setupRotation: function() {
    if (!this.map.canControlMap(this)) return;
    var size = Math.ceil(Math.sqrt(Math.pow($(window).width(), 2) + Math.pow($(window).height(), 2)));
    this.map.setMapContainerSize(size, size, (($(window).height() - size) / 2), (($(window).width() - size) / 2), 0);
  },

  rotateMap: function(e) {
    if (!this.map.canControlMap(this)) {
      this.rotating = false;
      return;
    }

    //has control first time
    if (this.rotating === false) {
      this.setupRotation();
      this.rotating = true;
    }

    var heading = -e.geoposition.coords.heading;
    if (isNaN(heading) || heading === null) {
      return;
    }
    var diff = heading - this.last_heading;
    // rotate in shortest direction
    if (diff > 180) {
      heading -= 360;
    } else if (diff < -180) {
      heading += 360;
    }
    this.last_heading = heading;

    this.map.el && (this.map.el[0].style.transform = "rotate(" + heading + "deg)");
  }

});

module.exports = MapRotator;