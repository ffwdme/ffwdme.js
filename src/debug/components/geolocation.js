var Geolocation = ffwdme.components.Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'navigationOnRoute',
                       'onGeopositionUpdate',
                       'navigationOffRoute',
                       'watchHtml5Position');
    ffwdme.on('navigation:onroute', this.navigationOnRoute);
    ffwdme.on('navigation:offroute', this.navigationOffRoute);
    ffwdme.on('geoposition:update', this.onGeopositionUpdate);
    navigator.geolocation.watchPosition(this.watchHtml5Position, this.errorWatchHtml5Position);

    this.render();
  },

  classes: 'ffwdme-widget-container ffwdme-grid-w8 ffwdme-grid-h5',

  html5GeoUpdateCounter: 0,

  ffwdmeGeoUpdateCounter: 0,

  ffwdmeOnRouteCounter: 0,

  ffwdmeOffRouteCounter: 0,

  currentAccuracy: 0,

  currentHeading: 0,

  errorWatchHtml5Position: function(){
    //error?
  },

  watchHtml5Position: function(position){
    this.html5GeoUpdateCounter += 1;
    this.label('.ffwdme-components-html5GeoUpdateCounter',this.html5GeoUpdateCounter);
  },

  navigationOnRoute: function(e) {
    this.ffwdmeOnRouteCounter += 1;
    this.label('.ffwdme-components-ffwdmeOnRouteCounter',this.ffwdmeOnRouteCounter);
  },

  navigationOffRoute: function(e) {
    this.ffwdmeOffRouteCounter += 1;
    this.label('.ffwdme-components-ffwdmeOffRouteCounter',this.ffwdmeOffRouteCounter);
  },

  onGeopositionUpdate: function(e) {
    this.ffwdmeGeoUpdateCounter += 1;

    heading = e.geoposition.coords.heading;
    if (heading) this.currentHeading = Number((heading).toFixed(2));

    accuracy = e.geoposition.coords.accuracy;
    if (accuracy) this.currentAccuracy = Number((accuracy).toFixed(2));

    this.label('.ffwdme-components-ffwdmeGeoUpdateCounter',this.ffwdmeGeoUpdateCounter);
    this.label('.ffwdme-components-currentAccuracy',this.currentAccuracy);
    this.label('.ffwdme-components-currentHeading',this.currentHeading);
  },

  make: function(){
    this.base();
    var content = [
      '<div class="ffwdme-components-geolocation-debug ffwdme-components-label-small">',
        '<div>Html5 geo update: <span class="ffwdme-components-html5GeoUpdateCounter">-</span></div>',
        '<div>ffwdme geo update: <span class="ffwdme-components-ffwdmeGeoUpdateCounter">-</span></div>',
        '<div>Accuracy: <span class="ffwdme-components-currentAccuracy">-</span></div>',
        '<div>Heading: <span class="ffwdme-components-currentHeading">-</span></div>',
        '<div>On Route: <span class="ffwdme-components-ffwdmeOnRouteCounter">-</span></div>',
        '<div>Off Route: <span class="ffwdme-components-ffwdmeOffRouteCounter">-</span></div>',
      '</div>'
    ].join('');


    $(this.el).addClass('ffwdme-components-container').html(content);
    return this;
  },

  label: function(cssClass, val) {
    return this.accessor(cssClass, val);
  },

  accessor: function(selector, val) {
    var el = this.$(selector);
    if (typeof val === 'undefined') return el.html();
    el.html(val);
    return el;
  }
});

module.exports = Geolocation;
