var Base = ffwdme.Class.extend({

  constructor: function(options) {
    this.options = options || {};
    this.setAccessibleAttributes();

    if (this.onResize) {
      this.bindAll(this, 'onResize');
      $(window).bind('resize', this.onResize);
    }

    if (this.onOrientationChange) {
      this.bindAll(this, 'onOrientationChange');
      $(window).bind('orientationchange', this.onOrientationChange);
    }

    if (!ffwdme.components.Base.testElement) {
      this.createTestElement();
      $(window).bind('orientationchange', ffwdme.components.Base.updateOrientationClass);
      // TODO: create a trigger for this
      window.setTimeout(ffwdme.components.Base.updateOrientationClass, 200);
    }
  },

  classes: null,

  grid: null,

  $: function(selector) {
    return $(selector, this.el);
  },

  attrAccessible: ['el', 'grid'],

  setAccessibleAttributes: function() {
    var attributes = this.attrAccessible;
    for (var i = -1, l = attributes.length, attr; attr = attributes[++i],i < l;) {
      if (typeof this.options[attr] !== 'undefined') this[attr] = this.options[attr];
    }
  },

  make: function(){
    this.el = document.createElement('div');
    if (this.options.css) $(this.el).css(this.options.css);

    $(this.el).addClass(this.classes);
    this.setPosition();
    return this;
  },

  setPosition: function() {
    var grid = this.grid;
    if (!grid) return;
    var el = $(this.el);

    grid.x && el.addClass('ffwdme-grid-x' + grid.x);
    grid.y && el.addClass('ffwdme-grid-y' + grid.y);
  },

  createTestElement: function() {
    ffwdme.components.Base.testElement = $(document.createElement('div'))
      .addClass('ffwdme-components-test-size ffwdme-components-container ffwdme-grid-h1')
      .appendTo($('.ffwdme-components-wrapper'));

    var lastHeight = null;
    var updateHeights = function(){
      var el = ffwdme.components.Base.testElement;
      var testHeight = parseInt(el.height(), 10);
      if (lastHeight != testHeight) {
        $('.ffwdme-components-container').not(el).css({ fontSize: testHeight+ "px", lineHeight: testHeight + "px" })
      }
      lastHeight = testHeight;
    };

    $(window).bind('resize', updateHeights);
    // TODO: create a trigger for this
    window.setTimeout(updateHeights, 200);
  },

  render: function(){
    if (!this.el) this.make();
    $(this.options.parent).append(this.el);
    return this;
  },

  getRetinaImageUrl: function(imgPath){
    if (!!document.createElementNS &&
      !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect){
      return imgPath;
    } else {
      return imgPath.replace("svg", "png");
    }
  }
}, {
  testElement: null,

  updateOrientationClass: function() {
    var orientation = ffwdme.components.Base.determineOrientationClass();
    $('.ffwdme-components-container').removeClass('landscape portrait').addClass(orientation);
  },

  determineOrientationClass: function() {
    var orientation;

    if (typeof window.orientation === 'undefined') {
      orientation = 'portrait';
    } else if (window.orientation === 0 || window.orientation === 180) {
      orientation = 'portrait';
    } else if (window.orientation === 90 || window.orientation === -90) {
      orientation = 'landscape';
    }

    return orientation;
  }
});

module.exports = Base;
