var NavInfo = ffwdme.components.Base.extend({

  constructor: function(options) {
    this.base(options);

    for (var i = 0; i < this.nodeIds.length; i++) {
      this.nodes[this.nodeIds[i]] = $('#' + this.nodeIds[i]);
    }

    this.nodes.ratioCompletedDirectionProgress  = $("#ratio-completed-direction-progress");
    this.nodes.ratioCompletedRouteProgress      = $("#ratio-completed-route-progress");

    $('#nav-info-trigger').click(function(){
      $('#nav-info').toggleClass('hidden');
      $('#routing').addClass('hidden');
    });

    this.bindAll(this, 'navigationOnRoute', 'navigationOffRoute');
    ffwdme.on('navigation:onroute', this.navigationOnRoute);
    ffwdme.on('navigation:offroute', this.navigationOffRoute);
  },

  nodes: {},

  nodeIds: [
    "street", "turnAngle", "distanceToNextDirection", "distanceToDestination", "timeToDestination", "timeToNextDirection", "ratioCompletedDirection", "ratioCompletedRoute"
  ],

  navigationOnRoute: function(e) {
    var p = e.navInfo.position, id;
    try {
      for (var i = 0; i < this.nodeIds.length; i++) {
        id = this.nodeIds[i];
        this.nodes[id].html(e.navInfo.nextDirection[id] || e.navInfo[id]);
      }

      this.nodes.ratioCompletedDirectionProgress.css('width', (e.navInfo.ratioCompletedDirection * 100) + "%");
      this.nodes.ratioCompletedRouteProgress.css('width', (e.navInfo.ratioCompletedRoute * 100) + "%");
    } catch(e) {
      console.warn("Error while updating the nodes");
      console.dir(e);
    }
  },

  navigationOffRoute: function(e) {
    console.warn(ffwdme.navigation.routePointCounter + ": NO NEAREST POINT # " + ffwdme.navigation.offRouteCounter + " -> distance: " + e.navInfo.nearest.distance + " m");
  }
});

module.exports = NavInfo;
