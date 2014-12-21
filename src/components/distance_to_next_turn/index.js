var BaseWide = require('../base_wide');
var DistanceToDestination = require('../distance_to_destination');

var DistanceToNextTurn = BaseWide.extend({

  classes: 'ffwdme-components-container ffwdme-grid-w9 ffwdme-grid-h1 ffwdme-components-text-only ffwdme-components-big-typo',

  format: DistanceToDestination.prototype.format,

  navigationOnRoute: function(e) {
    var distance = e.navInfo.distanceToNextDirection;
    if (!distance) return;

    var formatted = this.format(distance);
    $(this.el).find('.ffwdme-components-text').html([formatted.distance, formatted.unit].join(' '));
  }
});

module.exports = DistanceToNextTurn;
