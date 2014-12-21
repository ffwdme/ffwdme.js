var Base = require('../base');

var MapRotator = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this,'rotateMap', 'setupRotation');

    $(window).on('resize', this.setupRotation);
    ffwdme.on('geoposition:update', this.rotateMap);

    this.setupRotation();
  },

  attrAccessible: ['map'],

  rotating: false,

  setupRotation: function() {
    if (!this.map.canControlMap(this)) return;
    var size = Math.ceil(Math.sqrt(Math.pow($(window).width(), 2) + Math.pow($(window).height(), 2)));
    this.map.setMapContainerSize(size, size, (($(window).height() - size) / 2), (($(window).width() - size) / 2), 0);
  },

  rotateMap: function(e) {
    if (!this.map.canControlMap(this)){
      this.rotating = false;
      return;
    }

    //has control first time
    if (this.rotating === false){
      this.setupRotation();
      this.rotating = true;
    }

    var heading = - e.geoposition.coords.heading;
    heading && this.map.el && this.map.el.animate({ rotate: heading + 'deg' }, 1000, 'ease-in-out');

  }

});

module.exports = MapRotator;
