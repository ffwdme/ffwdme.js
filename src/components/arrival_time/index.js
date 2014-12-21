var BaseIcon = require('../base_icon');

var ArrivalTime = BaseIcon.extend({

  icon: 'arrival_time/clock.svg',

  defaultUnit: 'Uhr',

  format: function(date) {
    var min = date.getMinutes();
    return [ date.getHours(), min > 10 ? min : ("0" + min) ].join(':');
  },

  navigationOnRoute: function(e) {
    var timeLeft = e.navInfo.timeToDestination;
    if (!timeLeft) return;

    var now = (new Date()).valueOf(),
        then = new Date(now + timeLeft * 1000);

     this.label(this.format(then));
  }
});

module.exports = ArrivalTime;
