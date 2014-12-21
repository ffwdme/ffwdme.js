describe('LatLng', function() {

  describe('initializing a LatLng object', function() {
    it('can be initialized with two parameters', function() {
      var latLng = new ffwdme.LatLng(50, 9);
      expect(latLng.lat).toBe(50);
      expect(latLng.lng).toBe(9);
    });

    it('can be initialized with an array', function() {
      var latLng = new ffwdme.LatLng([50, 9]);
      expect(latLng.lat).toBe(50);
      expect(latLng.lng).toBe(9);
    });
  });

  describe('#toString', function(){
    it('can be initialized with an array', function() {
      var latLng = new ffwdme.LatLng([50, 9]);
      expect(latLng.toString()).toEqual('LatLng: 50, 9');
    });
  });

  describe('normalizing of coordinates', function(){
    it('clamps the latitude at max 90', function() {
      var latLng = new ffwdme.LatLng([99, 9]);
      expect(latLng.lat).toBe(90);
    });

    it('clamps the latitude at min 90', function() {
      var latLng = new ffwdme.LatLng([-99, 9]);
      expect(latLng.lat).toBe(-90);
    });

    it('clamps the longitude around if bigger than 180', function() {
      var latLng = new ffwdme.LatLng([50, 190]);
      expect(latLng.lng).toBe(-170);
    });

    it('wraps the longitude around if smaller than 0', function() {
      var latLng = new ffwdme.LatLng([50, -190]);
      expect(latLng.lng).toBe(170);
    });
  });
});
