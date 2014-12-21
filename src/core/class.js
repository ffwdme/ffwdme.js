/**
 * @class The ffwdme base class which is heavily based on the Base.js lib of Dean Edwards.
 *
 * - Base.js, version 1.1a
 * - Copyright 2006-2009, Dean Edwards
 * - http://dean.edwards.name/weblog/2006/03/base/
 * - http://dean.edwards.name/weblog/2006/05/prototype-and-base/
 * - License: http://www.opensource.org/licenses/mit-license.php
 *
 */

var Class = function() {
  // dummy
};
/**
 * Extends a class by the given methods and properties.
 *
 * @memberOf ffwdme.Class
 *
 * @param {Object} _instance
 *   An object containing the instance properties and methods.
 * @param {Object} _static
 *   An object containing static properties and methods.
 *
 * @return {ffwdme.Class}
 *   The new defined class.
 */
Class.extend = function(_instance, _static) { // subclass
  var extend = Class.prototype.extend;

  // build the prototype
  Class._prototyping = true;
  var proto = new this;
  extend.call(proto, _instance);
  proto.base = function() {
    // call this method from any other method to invoke that method's ancestor
  };
  delete Class._prototyping;

  var constructor = proto.constructor;
  var klass = proto.constructor = function() {
    if (!Class._prototyping) {
      if (this._constructing || this.constructor == klass) { // instantiation
        this._constructing = true;
        constructor.apply(this, arguments);
        delete this._constructing;
      } else if (arguments[0] != null) { // casting
        return (arguments[0].extend || extend).call(arguments[0], proto);
      }
    }
  };

  // build the class interface
  klass.ancestor = this;
  klass.extend = this.extend;
  //klass.forEach = this.forEach;
  klass.implement = this.implement;
  klass.prototype = proto;
  klass.toString = this.toString;
  klass.valueOf = function(type) {
    return (type == 'object') ? klass : constructor.valueOf();
  };
  extend.call(klass, _static);
  // class initialisation
  if (typeof klass.init == 'function') klass.init();
  return klass;
};

Class.prototype = {
  extend: function(source, value) {
    if (arguments.length > 1) { // extending with a name/value pair
      var ancestor = this[source];
      if (ancestor && (typeof value == 'function') && // overriding a method?
        // the valueOf() comparison is to avoid circular references
        (!ancestor.valueOf || ancestor.valueOf() != value.valueOf()) &&
        /\bbase\b/.test(value)) {
        // get the underlying method
        var method = value.valueOf();
        // override
        value = function() {
          var previous = this.base || Class.prototype.base;
          this.base = ancestor;
          var returnValue = method.apply(this, arguments);
          this.base = previous;
          return returnValue;
        };
        // point to the underlying method
        value.valueOf = function(type) {
          return (type == 'object') ? value : method;
        };
        value.toString = Class.toString;
      }
      this[source] = value;
    } else if (source) { // extending with an object literal
      var extend = Class.prototype.extend;
      // if this object has a customised extend method then use it
      if (!Class._prototyping && typeof this != 'function') {
        extend = this.extend || extend;
      }
      var proto = {toSource: null};
      // do the 'toString' and other methods manually
      var hidden = ['constructor', 'toString', 'valueOf'];
      // if we are prototyping then include the constructor
      var i = Class._prototyping ? 0 : 1;
      while (key = hidden[i++]) {
        if (source[key] != proto[key]) {
          extend.call(this, key, source[key]);

        }
      }
      // copy each of the source object's properties to this object
      for (var key in source) {
        if (!proto[key]) extend.call(this, key, source[key]);
      }
    }
    return this;
  }
};

/**
 * This hashtable proves access to the basic ffwdme.Class methods
 * within ancestors of ffwdme.Class.
 *
 * It is NOT available within ffwdme.Class itself because it represents
 * it itself.
 *
 * @example
 * SomeClass = ffwdme.Class.extend({
 *   constructor: function() {
 *     //access the bind method of the base class
 *     this.aMethodInContext = this.base.bind(this.aMethod, this);
 *   },
 *   aProperty: 'hello world',
 *   aMethod: function() {
 *     alert(this.aProperty);
 *   }
 * });
 *
 * @name base
 * @memberOf ffwdme.Class
 * @property
 * @type ffwdme.Class
 */

// initialise
Class = Class.extend({
  constructor: function() {
    this.extend(arguments[0]);
  },

  /**
    * Provides a wrapper function for method binding.
    *
    * @memberOf ffwdme.Class
    *
    * @param {Function} funct
    *   The method to be applied to the context.
    * @param {Object} ctx
    *   The context to bind the function to.
    *
    * @return {Function}
    *   The method wrapped to be bound to the passed context.
    */
   bind: function(funct, ctx) {
     return function() {
       return funct.apply(ctx, arguments);
     };
   },

   /**
     * Overwrites all passed methods of an object with the
     * same method with scope on the object.
     * Heavily inspired by underscore.js.
     */
   bindAll: function(object) {
     var functs = Array.prototype.slice.call(arguments, 1);

     for(var i = 0, len = functs.length; i < len; i++) {
       var funcName = functs[i];
        object[funcName] = this.bind(object[funcName], object);
     }

     return object;
   }
},

  {
  /**
   * Points to the parent class from which the current class or object is derived.
   *
   * @memberOf ffwdme.Class#
   *
   * @type ffwdme.Class
   */
  ancestor: Object,

  /**
   * Extends the ffwdme Class with all the passed classes.
   * Use it for mixins or easier multiple inheritance.
   *
   * @memberOf ffwdme.Class#
   *
   * @param {ffwdme.Class} klass
   *   One or more classes to extend the current class with
   *
   * @return {ffwdme.Class}
   *   The extended class.
   *
   */
  implement: function() {
    for (var i = 0; i < arguments.length; i++) {
      if (typeof arguments[i] == 'function') {
        // if it's a function, call it
        arguments[i](this.prototype);
      } else {
        // add the interface using the extend method
        this.prototype.extend(arguments[i]);
      }
    }
    return this;
  },

  toString: function() {
    return String(this.valueOf());
  }
});

module.exports = Class;
