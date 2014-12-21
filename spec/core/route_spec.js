describe('Route', function() {

  var routeResponse;
  var route;

  beforeEach(function() {
    route = new ffwdme.Route();
    routeResponse = loadJSON('route_response');
  });

  afterEach(function(){
    restore();
  });

  describe('creating a new route', function() {
    it('should provide a parse method', function() {
      expect(route).toHaveMethod('parse');
    });
  });

  describe('parsing a routing response', function() {
    it('takes data from a js object', function() {
      route.parse(routeResponse);
      expect(route.summary).toEqual(routeResponse.summary);
      expect(route.directions).toEqual(routeResponse.directions);
    });
  });

  describe('#nearestTo', function(){
    var route;

    beforeEach(function() {
      route = new ffwdme.Route();
      route.parse(loadJSON('route_response_simplified'));
    });

    it('gets the nearest position on a simple route', function(){
      /*
        Like this                          X -> Point

        |----|------------------|-------------------| -> Route
      */
      var position = new ffwdme.LatLng(1, 75);
      var nearest = route.nearestTo(position, 0, 0);

      expect(nearest).toHaveProperty('distance');
      expect(nearest.point.lat).toBe(0);
      expect(nearest.point.lng).toBe(75);
      expect(nearest.directionIndex).toBe(2);
      expect(nearest.prevPathIndex).toBe(0);
      expect(nearest.nextPathIndex).toBe(1);
    });
  });
});
