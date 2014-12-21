var Routing = ffwdme.components.Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'start', 'error', 'success', 'calculateRouteByForm', 'fetchCombination');

    $('#load-combination').click(this.fetchCombination);
    $('#calc-route-by-form').click(this.calculateRouteByForm);

    var self = this;
    $('#player-start').click(function(){ self.player.start(); });
    $('#player-pause').click(function(){ self.player.pause(); });
    $('#player-reset').click(function(){ self.player.reset(); });

    $('#routing-trigger').click(function(){
      $('#routing').toggleClass('hidden');
      $('#nav-info').addClass('hidden');
    });

    ffwdme.on('routecalculation:start', this.start);
    ffwdme.on('routecalculation:error', this.error);
    ffwdme.on('routecalculation:success', this.success);
  },

  player: null,

  start: function(data) {
    console.info('routing started');
  },

  error: function(data) {
    console.error('routing FAILED');
  },

  success: function(response) {
    console.info('routing SUCCESSFULL!');
    console.dir(response);
    ffwdme.navigation.setRoute(response.route).start();
  },

  fetchCombination: function() {
    var values = $('#select-combination').val().split(';');
    var trackId = values[0];

    $('#custom-route-start-lat').val(values[1]);
    $('#custom-route-start-lng').val(values[2]);
    $('#custom-route-dest-lat').val(values[3]);
    $('#custom-route-dest-lng').val(values[4]);

    try {
      this.player = new ffwdme.debug.geoprovider.PlayerLocal({
        // dieburg industriegebiet
        //id: '2011-03-18-16-48-12'
        id: trackId
      });
      $('#geoprovider-track').text(trackId);
    } catch(e) {
      $('#geoprovider-track').text('Could not fetch the recorded track!: ' + trackId);
    }
  },

  calculateRouteByForm: function() {
    var slat = document.getElementById('custom-route-start-lat').value;
    var slng = document.getElementById('custom-route-start-lng').value;
    var dlat = document.getElementById('custom-route-dest-lat').value;
    var dlng = document.getElementById('custom-route-dest-lng').value;

    var route = new ffwdme.routingService({
      start: { lat: slat, lng: slng },
      dest:  { lat: dlat, lng: dlng }
    }).fetch();
  }
});

module.exports = Routing;
