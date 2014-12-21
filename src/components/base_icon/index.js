var Base = require('../base');

var BaseIcon = Base.extend({

  constructor: function(options) {
    this.base(options);

    if (this.navigationOnRoute) {
      this.bindAll(this, 'navigationOnRoute');
      ffwdme.on('navigation:onroute', this.navigationOnRoute);
    }

    this.render();
  },

  iconSrc: function() {
    return this.getRetinaImageUrl(ffwdme.defaults.imageBaseUrl + this.icon);
  },

  icon: null,

  defaultUnit: null,

  classes: 'ffwdme-grid-w3 ffwdme-grid-h1 ffwdme-components-icon',

  accessor: function(selector, val) {
    var el = this.$(selector);
    if (typeof val === 'undefined') return el.html();
    el.html(val);
    return el;
  },

  label: function(val) {
    return this.accessor('.ffwdme-components-label', val);
  },

  unit: function(val) {
    return this.accessor('.ffwdme-components-label-unit', val);
  },

  make: function(){
    this.base();

    var content = [
      '<span class="ffwdme-components-icon-container"><img class="ffwdme-components-icon-img" src="', this.iconSrc(), '" /></span>',
      '<span class="ffwdme-components-label">-</span>',
      '<span class="ffwdme-components-label-unit"> ', this.defaultUnit, '</span>'
    ].join('');

    $(this.el).addClass('ffwdme-components-container').html(content);
    return this;
  }
});

module.exports = BaseIcon;
