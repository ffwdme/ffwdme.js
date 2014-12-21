var Base = require('../base');

var BaseWide = Base.extend({

  constructor: function(options) {
    this.base(options);

    if (this.navigationOnRoute) {
      this.bindAll(this, 'navigationOnRoute');
      ffwdme.on('navigation:onroute', this.navigationOnRoute);
    }

    this.render();
  },

  make: function(){
    this.base();
    $(this.el).addClass('ffwdme-components-container').html('<span class="ffwdme-components-text"></span>');
    return this;
  },

  classes: null
});

module.exports = BaseWide;
