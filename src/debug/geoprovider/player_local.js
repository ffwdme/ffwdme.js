var Player = require('./player');
var Track = require('./track');

var PlayerLocal = Player.extend({
  /**
   *  A geoprovider player that loads recorded tracks from the hard disk.
   *  It uses ajax and the ffwdme development server, so it will probably only work
   *  on the localhost.
   *
   *  @augments ffwdme.geoprovider.Player
   *  @constructs
   *
   *  @params {Integer} id
   *    The id of the track to load from the server.
   */
  constructor: function(options){
    this.base(options);
    this.id = options.id;

    this.load();
  },

  /**
   *  The base url to load the files from.
   *  @type {String}
   */
  BASE_URL: "/recorded_routes/",

  /**
   *  The id of the track to load (which is actually the file name,
   *  which itself is actually a timestamp)
   *
   *  @type {String}
   */
  id: null,

  /**
   *  Loads the track from the server.
   */
  load: function() {
    var url = this.BASE_URL + this.id + '.json', self = this;

    $.getJSON(url, function(data) {
      self.track = new Track();
      self.track.points = data.track.points;
    });
  }
});

module.exports = PlayerLocal;
