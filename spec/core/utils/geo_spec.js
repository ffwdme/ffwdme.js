describe('utils.Geo', function() {

  var geo = ffwdme.utils.Geo;

  describe('#distance', function() {
    it('calculates medium distances correctly', function() {
      // gmaps: 14455
      var A = new ffwdme.LatLng(50, 8.6);
      var B = new ffwdme.LatLng(50, 8.8);
      expect(geo.distance(A, B)).toBeGreaterThan(14305);
      expect(geo.distance(A, B)).toBeLessThan(14315);
    });

    it('calculates small distances correctly', function() {
      // gmaps: 471.249 m
      var A = new ffwdme.LatLng(49.901411, 8.854543);
      var B = new ffwdme.LatLng(49.902152, 8.861013);
      expect(geo.distance(A, B)).toBeGreaterThan(470);
      expect(geo.distance(A, B)).toBeLessThan(473);
    });
  });

  describe('#closestOnLine', function(){
    var S1, S2;

    beforeEach(function(){
      S1 = new ffwdme.LatLng(0, 0);
      S2 = new ffwdme.LatLng(0, 100);
    });

    it('finds the closest Point on a line', function(){
      var A =  new ffwdme.LatLng(50, 50);
      var closest = geo.closestOnLine(S1, S2, A);

      expect(closest.lat).toBe(0);
      expect(closest.lng).toBe(50);
    });

    it('finds the closest Point on line with an overstretched ankle (smaller value)', function(){
      var A =  new ffwdme.LatLng(-50, -50);
      var closest = geo.closestOnLine(S1, S2, A);

      expect(closest.lat).toBe(0);
      expect(closest.lng).toBe(0);
    });

    it('finds the closest Point on line with an overstretched ankle (bigger value)', function(){
      var A =  new ffwdme.LatLng(150, 150);
      var closest = geo.closestOnLine(S1, S2, A);

      expect(closest.lat).toBe(0);
      expect(closest.lng).toBe(100);
    });
  });
});
