var BaseWide = require('../base_wide');

var NextStreet = BaseWide.extend({

  classes: 'ffwdme-components-container ffwdme-components-text-only ffwdme-grid-w9 ffwdme-grid-h1',

  showNextStreet: function(e) {
    $(this.el).find('.ffwdme-components-text')
      .html(e.navInfo.nextDirection.street)
      .css('background', '');
  },

  showFinalStreet: function(e) {
    $(this.el).find('.ffwdme-components-text')
      .html(e.navInfo.currentDirection.street);
  },

  navigationOnRoute: function(e) {
    if (e.navInfo.finalDirection === true) {
      this.showFinalStreet(e);
    } else if (e.navInfo.nextDirection && e.navInfo.nextDirection.street) {
      this.showNextStreet(e);
    }
  }
});

module.exports = NextStreet;
