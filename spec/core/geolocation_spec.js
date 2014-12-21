describe('Geolocation', function() {

  var geolocation;

  beforeEach(function() {
    geolocation = new ffwdme.Geolocation(window.navigator.geolocation);
  });

  beforeEach(function() {
    restore();
  });


  describe('#getCurrentPosition', function(){
    it('calls the Geolocation interface of the browser', function(){
      spyOn(window.navigator.geolocation, 'getCurrentPosition');
      geolocation.getCurrentPosition();
      expect(window.navigator.geolocation.getCurrentPosition.calls.count()).toBe(1);
    });
  });

  describe('#watchPosition', function(){
    beforeEach(function() {
      spyOn(window.navigator.geolocation, 'watchPosition');
      geolocation.watching = false;
    });

    it('calls the Geolocation interface of the browser', function(){
      geolocation.watchPosition();
      expect(window.navigator.geolocation.watchPosition.calls.count()).toBe(1);
    });

    it('saves the passed options to the object', function(){
      var options = { foo: 'bar' };
      geolocation.watchPosition(options);
      expect(geolocation.options).toBe(options);
    });

    it('adds the passed callbacks to ffwdme event handlers', function(){
      var success = jasmine.createSpy('success');
      var error = jasmine.createSpy('error');
      geolocation.watchPosition({}, success, error);
      expect(ffwdme.callbacks['geoposition:error']).toContain(error);
      expect(ffwdme.callbacks['geoposition:update']).toContain(success);
    });

    it('triggers the geoposition:init event', function(){
      var callback = jasmine.createSpy('callback');
      ffwdme.on('geoposition:init', callback);
      geolocation.watchPosition();
      expect(callback.calls.count()).toBe(1);
    });

    it('triggers the geoposition:init event only once', function(){
      var callback = jasmine.createSpy('callback');
      ffwdme.on('geoposition:init', callback);
      // call it two times
      geolocation.watchPosition();
      geolocation.watchPosition();
      expect(callback.calls.count()).toBe(1);
    });
  });

  describe('#positionUpdate', function(){
    var position;

    beforeEach(function(){
      position = loadJSON('geoposition').geoposition;
    });

    it('triggers the geoposition:update event', function(){
      var callback = jasmine.createSpy('callback');
      ffwdme.on('geoposition:update', callback);

      geolocation.positionUpdate(position);
      expect(callback.calls.count()).toBe(1);
    });

    it('triggers the geoposition:ready event only once', function(){
      var callback = jasmine.createSpy('callback');
      ffwdme.on('geoposition:ready', callback);

      geolocation.positionUpdate(position);
      geolocation.positionUpdate(position);
      expect(callback.calls.count()).toBe(1);
    });
  });

  describe('#positionError', function(){
    it('triggers the geoposition:error event', function(){
      var callback = jasmine.createSpy('callback');
      ffwdme.on('geoposition:error', callback);

      geolocation.positionError({});
      expect(callback.calls.count()).toBe(1);
    });
  });

  describe('the W3C Geolocation interface is implemented', function() {
    it('has a getCurrentPosition method', function() {
      expect(geolocation).toHaveMethod('getCurrentPosition');
    });

    it('has a watchPosition method', function() {
      expect(geolocation).toHaveMethod('watchPosition');
    });

    it('has a clearWatch method', function() {
      expect(geolocation).toHaveMethod('clearWatch');
    });

    it('has a watchId property', function() {
      expect(geolocation).toHaveProperty('watchId');
    });
  });
});
