describe('Navigation', function() {
  var navigation;
  var route;
  var point;

  beforeEach(function(){
    initialize();
    navigation = ffwdme.navigation;
    route = new ffwdme.Route();
    route.parse(loadJSON('route_response'));
    point = loadJSON('geoposition_last_in_events');
    ffwdme.geolocation.last = point;
  });

  afterEach(function(){
    restore();
  });

  describe('setting a route', function(){
    it('triggers the reset', function(){
      var spy = spyOn(navigation, 'reset');
      navigation.setRoute(route);
      expect(spy.calls.count()).toBe(1);
    });

    it('sets the new route', function(){
      navigation.setRoute(route);
      expect(navigation.route).toBe(route);
    });
  });

  describe('starting a navigation', function(){

    beforeEach(function(){
      navigation.setRoute(route);
    });

    it('triggers #getPositionOnRoute with the last known position', function(){
      var spy = spyOn(navigation, 'getPositionOnRoute');
      navigation.start();
      expect(spy.calls.count()).toBe(1);
    });

    it('registers the #getPositionOnRoute method for the geoposition:update event', function(){
      var spy = spyOn(ffwdme, 'on');
      navigation.start();
      expect(spy.calls.argsFor(0)).toEqual(['geoposition:update', navigation.getPositionOnRoute]);
    });

    it('sets a new starting time', function(){
      var lastTime = navigation.startTime;
      navigation.start();
      expect(navigation.startTime).toBeGreaterThan(lastTime);
    });
  });

  describe('stopping a navigation', function(){

    beforeEach(function(){
      navigation.setRoute(route);
      navigation.start();
    });

    it('removes the #getPositionOnRoute method from the geoposition:update event', function(){
      expect(ffwdme.callbacks['geoposition:update']).toContain(navigation.getPositionOnRoute);
      navigation.stop();
      expect(ffwdme.callbacks['geoposition:update']).not.toContain(navigation.getPositionOnRoute);
    });
  });

  describe('rerouting a route', function(){
    var fetch;

    beforeEach(function(){
      navigation.setRoute(route);
      navigation.start();
      fetch = jasmine.createSpy('spy');

      ffwdme.routingService = function(){};
      routing = spyOn(ffwdme, 'routingService').and.returnValue({ fetch: fetch });
    });

    afterEach(function(){
      ffwdme.routingService = null;
    });

    it('registers the reroute callback', function(){
      expect(ffwdme.callbacks['reroutecalculation:success']).toBe(undefined);
      navigation.reroute();
      expect(ffwdme.callbacks['reroutecalculation:success']).toContain(navigation.rerouteCallback);
    });

    it('fetches a new route', function(){
      navigation.reroute();
      expect(fetch.calls.count()).toBe(1);
    });

    describe('#rerouteCallback', function(){
      var response;

      beforeEach(function(){
        navigation.reroute();
        response = { route: route };
      });

      it('removes itself from the reroutecalculation:success event', function(){
        expect(ffwdme.callbacks['reroutecalculation:success']).toContain(navigation.rerouteCallback);
        navigation.rerouteCallback(response);
        expect(ffwdme.callbacks['reroutecalculation:success']).not.toContain(navigation.rerouteCallback);
      });

      it('sets the new route', function(){
        var spy = spyOn(navigation, 'setRoute');
        navigation.rerouteCallback(response);
        expect(spy).toHaveBeenCalledWith(response.route);
        expect(spy.calls.count()).toBe(1);
      });
    });
  });

  describe('determing position on a route', function(){
    var position;

    beforeEach(function(){
      route = new ffwdme.Route();
      route.parse(loadJSON('route_response_simplified'));

      navigation.setRoute(route);
      navigation.start();

      position = loadJSON('geoposition_last_in_events');
      position.point.lat = 0;
      position.point.lng = 70;
    });

    describe('successfully', function(){
      var spy;

      beforeEach(function(){
        spy = spyOn(ffwdme, 'trigger');
        navigation.getPositionOnRoute(position);
      });

      it('triggers the navigation:onroute event', function(){
        expect(spy.calls.argsFor(0)[0]).toBe('navigation:onroute');
        expect(spy.calls.count()).toBe(1);
      });

      it('passes a NavigationInfo object to the event', function(){
        var navInfo = spy.calls.argsFor(0)[1].navInfo;
        expect(navInfo).toBeInstanceOf(ffwdme.NavigationInfo);
      });

      it('sets the onRoute property of the NavigationInfo object to true', function(){
        var navInfo = spy.calls.argsFor(0)[1].navInfo;
        expect(navInfo.onRoute).toBe(true);
      });
    });

    describe('unsuccessfully', function(){
      var spy;

      beforeEach(function(){
        spy = spyOn(ffwdme, 'trigger');

        position.point.lat = 70;
        position.point.lng = 70;

        navigation.getPositionOnRoute(position);
      });

      it('triggers the navigation:offroute event', function(){
        expect(spy.calls.argsFor(0)[0]).toBe('navigation:offroute');
        expect(spy.calls.count()).toBe(1);
      });

      it('passes a NavigationInfo object to the event', function(){
        var navInfo = spy.calls.argsFor(0)[1].navInfo;
        expect(navInfo).toBeInstanceOf(ffwdme.NavigationInfo);
      });

      it('sets the onRoute property of the NavigationInfo object to false', function(){
        var navInfo = spy.calls.argsFor(0)[1].navInfo;
        expect(navInfo.onRoute).toBe(false);
      });
    });
  });
});
