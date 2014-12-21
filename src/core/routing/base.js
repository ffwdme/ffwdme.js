var Class = require('../class');

var Base = Class.extend({
  /**
   * desc
   *
   * @class The class represents a base client for a routing service.
   *   You can't use this class directly but must use a child class,
   *   which has implemented the abstract method: fetch.
   *
   * @augments ffwdme.Class
   * @constructs
   *
   *
   */
  constructor: function(options) {
    this.options = options;

    var attrs = ['start', 'dest', 'rerouting'], attr;
    for(var i = 0, len = attrs.length; i < len; i++) {
      attr = attrs[i];
      this[attr] = options && options[attr];
    }

    if (!this.start) this.start = ffwdme.geolocation.last.point;
    return this;
  },

  options: null,

  /**
   * The last successful route response.
   *
   * @type ffwdme.Route
   */
  lastRoute: null,

  // must trigger start event, as a result is must call either success or error
  fetch: function() {
    throw 'ffwdme.routing.Base is an abstract class. You must use a child class.';
  },

  eventPrefix: function() {
    return this.rerouting ? 'reroutecalculation' : 'routecalculation';
  },

  success: function(response, route) {
    this.lastRoute = route;
    ffwdme.trigger(this.eventPrefix() + ':success', {
      routing: this,
      route: route,
      response: response
    });
  },

  error: function(error) {
    ffwdme.trigger(this.eventPrefix() + ':error', {
      routing: this,
      error: error
    });
  }
});

module.exports = Base;
