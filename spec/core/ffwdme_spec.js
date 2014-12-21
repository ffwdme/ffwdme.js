describe('ffwdme', function() {

  afterEach(function(){
    ffwdme.reset();
  });

  describe('version', function() {
    it('defines a VERSION param', function() {
      expect(ffwdme.VERSION).toBeDefined();
    });
  });

  describe('initialize', function() {
    afterEach(function() {
      ffwdme.reset();
    });

    it('initializes a geolocation object', function() {
      initialize();
      expect(ffwdme.geolocation).toBeInstanceOf(ffwdme.Geolocation);
    });

    it('starts watching the geolocation if initialized', function() {
      var watchPosition = spyOn(ffwdme.Geolocation.prototype, 'watchPosition');
      initialize();
      expect(watchPosition.calls.count()).toBe(1);
    });

    it('does not start watching the geolocation if initialized', function() {
      var watchPosition = spyOn(ffwdme.Geolocation.prototype, 'watchPosition');
      restore();
      ffwdme.initialize({ ingoreGeolocation: true });
      expect(watchPosition.calls.count()).toBe(0);
    });

    it('initializes a routing object if given', function() {
      restore();
      ffwdme.initialize({ routing: 'GraphHopper' });
      expect(ffwdme.routingService).toBe(ffwdme.routing.GraphHopper);
    });

    it('initializes no routing object if none given', function() {
      ffwdme.initialize();
      expect(ffwdme.routingService).toBe(null);
    });

    it('initializes a navigation object', function() {
      initialize();
      expect(ffwdme.navigation).toBeInstanceOf(ffwdme.Navigation);
    });
  });

  describe('#toString', function(){
    it('returns a custom toString representation', function(){
      expect(ffwdme.toString()).toEqual('ffwdme.js v0.4.0');
    });
  });

  describe('adding event callbacks', function() {
    it('allows adding callbacks on events', function() {
      expect(ffwdme.on).toBeDefined();
    });

    it('returns the ffwdme singleton when binding to an event', function() {
      expect(ffwdme.on('testevent', function(){})).toBe(ffwdme);
    });

    it('adds the callback to the callbacks hash', function() {
      var cb = function(){};
      ffwdme.on('testevent', cb);
      expect(ffwdme.callbacks.testevent).toContain(cb);
    });

    it('adds the callback to the callbacks hash for multiple events', function() {
      var cb = function(){};
      ffwdme.on('testevent1 testevent2', cb);
      expect(ffwdme.callbacks.testevent1).toContain(cb);
      expect(ffwdme.callbacks.testevent2).toContain(cb);
    });
  });

  describe('adding event callbacks once', function() {
    it('allows adding callbacks on events for only once', function() {
      expect(ffwdme.once).toBeDefined();
    });

    it('returns the ffwdme singleton when binding to an event', function() {
      expect(ffwdme.once('testevent', function(){})).toBe(ffwdme);
    });

    it('removes the callback once it was fired', function() {
      var spy = jasmine.createSpy('spy');
      ffwdme.once('testevent', spy);
      expect(spy.calls.count()).toEqual(0);
      ffwdme.trigger('testevent', { oh: 'hai' });
      expect(spy.calls.count()).toEqual(1);
      ffwdme.trigger('testevent', { oh: 'hai' });
      expect(spy.calls.count()).toEqual(1);
    });
  });

  describe('removing event callbacks', function() {
    var cb;
    beforeEach(function(){
      cb = function(){};
      ffwdme.on('testevent', cb);
    });

    it('allows to remove callbacks', function() {
      expect(ffwdme.off).toBeDefined();
    });

    it('returns the ffwdme singleton when unbinding from an event', function() {
      expect(ffwdme.off('testevent', cb)).toBe(ffwdme);
    });

    it('removes the callback from the callbacks hash', function() {
      ffwdme.off('testevent', cb);
      expect(ffwdme.callbacks.testevent).not.toContain(cb);
    });
  });

  describe('triggering event callbacks', function() {
    it('allows to trigger callbacks', function() {
      expect(ffwdme.trigger).toBeDefined();
    });

    it('returns ffwdme if an event does not exist', function() {
      expect(ffwdme.trigger('nonExistingEvent')).toBe(ffwdme);
    });

    it('triggers a registered callback', function() {
      var callback = jasmine.createSpy('callback');
      ffwdme.on('testevent', callback);
      ffwdme.trigger('testevent');
      expect(callback.calls.count()).toBe(1);
    });

    it('transports passed event data', function() {
      var callback = jasmine.createSpy('callback');
      ffwdme.on('testevent', callback);
      ffwdme.trigger('testevent', { hello: 'world' });
      expect(callback.calls.argsFor(0)[0].hello).toEqual('world');
    });

    it('adds the event type to the event data as a type property', function() {
      var callback = jasmine.createSpy('callback');
      ffwdme.on('testevent', callback);
      ffwdme.trigger('testevent');
      expect(callback.calls.argsFor(0)[0].type).toEqual('testevent');
    });
  });
});
