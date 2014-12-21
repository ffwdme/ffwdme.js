var Base = require('../base');

var Zoom = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.render();
  },

  attrAccessible: ['map', 'grid'],

  iconElZoomIn: null,

  iconElZoomOut: null,

  iconZoomIn: 'zoom/plus.svg',

  iconZoomOut: 'zoom/minus.svg',

  classes: 'ffwdme-components-container ffwdme-components-zoom-container ffwdme-grid-w3 ffwdme-grid-h1',

  imgUrl: function(icon){
    return this.getRetinaImageUrl(ffwdme.defaults.imageBaseUrl + icon);
  },

  zoom: function(val){
    this.map && this.map.changeUserZoom(val);
    ffwdme.geolocation.last && ffwdme.trigger('geoposition:update', ffwdme.geolocation.last);
  },

  setIcons: function() {
    var img;

    if (!this.iconElZoomIn) {
      img = document.createElement('img');
      this.iconElZoomIn = $(img).addClass('ffwdme-components-zoom').appendTo($(this.el));
    }
    this.iconElZoomIn[0].src = this.imgUrl(this.iconZoomIn);

    if (!this.iconElZoomOut) {
      img = document.createElement('img');
      this.iconElZoomOut = $(img).addClass('ffwdme-components-zoom').appendTo($(this.el));
    }
    this.iconElZoomOut[0].src = this.imgUrl(this.iconZoomOut);
  },

  make: function(){
    this.base();
    var self = this;
    this.setIcons();
    $(this.iconElZoomIn).click(function(e) { e.stopPropagation(); self.zoom(1);});
    $(this.iconElZoomOut).click(function(e) { e.stopPropagation(); self.zoom(-1);});
    return this;
  }

});

module.exports = Zoom;
