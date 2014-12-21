describe('components.Base', function() {

  describe('attrAccessible', function(){
    var component;

    beforeEach(function(){
      component = new ffwdme.components.Base({
        el:  'myEl',
        other: 'myOther'
      });
    });

    it('automatically parses the default attributes', function(){
      expect(component.el).toEqual('myEl');
    });

    it('rejects non-whitelisted attributes', function(){
      expect(component.other).toBe(undefined);
    });

    it('does not overwrite default values when attribute not passed in options hash', function(){
      var Component = ffwdme.components.Base.extend({
        given: 'hello',
        attrAccessible: ['given']
      });

      var component = new Component();

      expect(component.given).toBe('hello');
    });
  });

  describe('automatically adds listeners to resize and orientationchange events', function(){
    var w;
    var resize;
    var orientation;

    beforeEach(function(){
      resize = jasmine.createSpy();
      orientation = jasmine.createSpy();
      var klass = ffwdme.components.Base.extend({
        onResize: resize,
        onOrientationChange: orientation
      });
      w = new klass();
    });

    it('binds the resize listener to the window orientationchange event if they exist', function(){
      $(window).trigger('orientationchange', {});
      expect(orientation.calls.count()).toBe(1);
    });

    it('binds the resize listener to the window resize event if they exist', function(){
      $(window).trigger('resize', {});
      expect(resize.calls.count()).toBe(1);
    });
  });

  describe('getRetinaImageUrl', function(){

    var component;

    beforeEach(function(){
      component = new ffwdme.components.Base();
    });

    it('returns svg path when svg is supported (local browser)', function(){
      expect(component.getRetinaImageUrl("images/imagetest.svg")).toBe('images/imagetest.svg'); //local browser
    });

    it('returns svg path when svg is supported (android 3.*)', function(){
      navigator.__defineGetter__('userAgent', function () { return 'Mozilla/5.0 (Linux; U; Android 3.0.1; en-us; A500 Build/HRI66) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13'; });
      expect(component.getRetinaImageUrl("images/imagetest.svg")).toBe('images/imagetest.svg');
    });

    it('returns svg path when svg is supported (android 4.*)', function(){
      navigator.__defineGetter__('userAgent', function () { return 'Mozilla/5.0 (Linux; Android 4.1.1; Transformer Prime TF201 Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166  Safari/535.19'; });
      expect(component.getRetinaImageUrl("images/imagetest.svg")).toBe('images/imagetest.svg');
      navigator.__defineGetter__('userAgent', function () { return 'Mozilla/5.0 (Linux; U; Android 4.0.4; en-us; Transformer TF101 Build/IMM76I) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30'; });
      expect(component.getRetinaImageUrl("images/imagetest.svg")).toBe('images/imagetest.svg');
    });

  });
});
