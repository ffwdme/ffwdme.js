describe('routing.GraphHopper', function() {
  var routing;
  var fakeResponse;
  var routeStartCalled;
  var routeSuccCalled;
  var routeErrCalled;
  var rerouteStartCalled;
  var rerouteSuccCalled;
  var rerouteErrCalled;
  var orgGet;

  beforeEach(function() {
    fakeResponse = loadJSON('route_graphhopper');

    attrs = {
      start: { lat: 11149.945589, lng: 8.845563 },
      dest:  { lat: 49.936982, lng: 118.911113 },
      rerouting: false
    };

    routing = new ffwdme.routing.GraphHopper(attrs);

    routeStartCalled = false;
    routeSuccCalled = false;
    routeErrCalled = false;
    rerouteStartCalled = false;
    rerouteSuccCalled = false;
    rerouteErrCalled = false;

    ffwdme.on('routecalculation:start', function(){
      routeStartCalled = true;
    });
    ffwdme.on('routecalculation:success', function(){
      routeSuccCalled = true;
    });
    ffwdme.on('routecalculation:error', function(){
      routeErrCalled = true;
    });

    ffwdme.on('reroutecalculation:start', function(){
      rerouteStartCalled = true;
    });
    ffwdme.on('reroutecalculation:success', function(){
      rerouteSuccCalled = true;
    });
    ffwdme.on('reroutecalculation:error', function(){
      rerouteErrCalled = true;
    });
  });

  describe('creating a new routing object', function() {
    it('saves the passed start point', function() {
      expect(routing.start).toEqual(attrs.start);
    });
    it('saves the passed dest point', function() {
      expect(routing.dest).toEqual(attrs.dest);
    });
    it('saves the passed rerouting flag', function() {
      expect(routing.rerouting).toEqual(attrs.rerouting);
    });
  });

  describe('successfully calculating a route', function() {
    beforeEach(function() {
      spyOn(ffwdme.utils.Proxy, 'get').and.callFake(function(options) {
        options.success(fakeResponse);
      });

      routing.fetch();
    });

    it('creates a route and saves it as lastRoute', function() {
      expect(routing.lastRoute).toBeInstanceOf(ffwdme.Route);
    });

    it('triggers the routecalculation:start event', function() {
      expect(routeStartCalled).toBe(true);
    });

    it('triggers the routecalculation:success event', function() {
      expect(routeSuccCalled).toBe(true);
    });

    it('triggers the routecalculation:error event', function() {
      expect(routeErrCalled).toBe(false);
    });
  });

  describe('successfully recalculating a route', function() {
    beforeEach(function() {
      spyOn(ffwdme.utils.Proxy, 'get').and.callFake(function(options) {
        options.success(fakeResponse);
      });
      routing.rerouting = true;
      routing.fetch();
    });

    it('creates a route and saves it as lastRoute', function() {
      expect(routing.lastRoute).toBeInstanceOf(ffwdme.Route);
    });

    it('triggers the reroutecalculation:start event', function() {
      expect(rerouteStartCalled).toBe(true);
    });

    it('triggers the reroutecalculation:success event', function() {
      expect(rerouteSuccCalled).toBe(true);
    });

    it('triggers the reroutecalculation:error event', function() {
      expect(rerouteErrCalled).toBe(false);
    });
  });

  describe('unsuccessfully calculating a route', function() {
    beforeEach(function() {
      spyOn(ffwdme.utils.Proxy, 'get').and.callFake(function(options) {
        options.error('');
      });

      routing.fetch();
    });

    it('creates no lastRoute', function() {
      expect(routing.lastRoute).toBe(null);
    });

    it('triggers the routecalculation:start event', function() {
      expect(routeStartCalled).toBe(true);
    });

    it('triggers the routecalculation:success event', function() {
      expect(routeSuccCalled).toBe(false);
    });

    it('triggers the routecalculation:error event', function() {
      expect(routeErrCalled).toBe(true);
    });
  });

  describe('unsuccessfully recalculating a route', function() {
    beforeEach(function() {
      spyOn(ffwdme.utils.Proxy, 'get').and.callFake(function(options) {
        options.error({ status: 500, responseText: '{}' });
      });

      routing.rerouting = true;
      routing.fetch();
    });

    it('creates no lastRoute', function() {
      expect(routing.lastRoute).toBe(null);
    });

    it('triggers the reroutecalculation:start event', function() {
      expect(rerouteStartCalled).toBe(true);
    });

    it('triggers the reroutecalculation:success event', function() {
      expect(rerouteSuccCalled).toBe(false);
    });

    it('triggers the reroutecalculation:error event', function() {
      expect(rerouteErrCalled).toBe(true);
    });
  });

});
