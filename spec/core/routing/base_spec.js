describe('routing.Base', function() {
  var routing;

  beforeEach(function() {
    routing = new ffwdme.routing.Base({
      start: { lat: 11149.945589, lng: 8.845563 },
      dest:  { lat: 49.936982, lng: 118.911113 }
    });
  });

  describe('creating a new  abstract routing object', function() {
    it('provides an abstract fetch method', function() {
      expect(routing.fetch).toThrow();
    });
  });
});

