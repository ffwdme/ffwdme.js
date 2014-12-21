var BaseIcon = require('../base_icon');

var TimeToDestination = BaseIcon.extend({

  icon: 'time_to_destination/flag.svg',

  defaultUnit: 'h',

  format: function(completeSeconds) {
    var completeMinutes = Math.round(completeSeconds/60),
        mins = completeMinutes % 60,
        hrs  = (completeMinutes - mins) / 60;
        mins = mins < 10 ? '0' + mins : mins;
    return [hrs, ":", mins].join("");
  },

  navigationOnRoute: function(e) {
    var timeLeft = e.navInfo.timeToDestination;
    if (timeLeft) this.label(this.format(timeLeft));
  }
});

module.exports = TimeToDestination;
