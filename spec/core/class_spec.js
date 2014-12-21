describe('Class', function() {
  var myClass;
  var myChildClass;
  var myOtherChildClass;
  var myInstance;
  var myOtherInstance;
  var myOtherChildInstance;


  beforeEach(function() {
    // a simple class
    myClass = ffwdme.Class.extend({
      constructor: function(name){
        this._name = name;
      },
      _name: null,
      sayName: function() {
        return this._name;
      }
    });

    // a simple child class
    myChildClass = myClass.extend({
      sayHelloAndName: function() {
        return "Hello " + this.sayName();
      }
    });

    // another child class overwriting a parent method
    myOtherChildClass = myClass.extend({
      sayName: function() {
        return "Name is " + this._name;
      }
    });

    // another simple class
    myOtherClass = ffwdme.Class.extend({
      constructor: function(name){
      }
    });

    // instances of first class
    myInstance = new myClass('Elvis');
    myOtherInstance = new myClass('Mira');
    myOtherChildInstance = new myOtherChildClass('Petra');
  });

  describe('define classes', function() {
    it('creates class constructs', function() {
      expect(typeof myClass).toBe('function');
    });
  });

  describe('use defined classes', function() {
    it('defines classes that can create instances', function() {
      expect(myInstance).toBeInstanceOf(myClass);
    });

    it('creates objects that are instances of the right class', function() {
      expect(myInstance).not.toBeInstanceOf(myOtherClass);
    });

    it('has a constructor to be called', function() {
      expect(myInstance._name).toEqual('Elvis');
    });

    it('has properties that are object based', function() {
      expect(myOtherInstance._name).toEqual('Mira');
    });

    it('has methods that are object based', function() {
      expect(myInstance.sayName()).toEqual('Elvis');
      expect(myOtherInstance.sayName()).toEqual('Mira');
    });

    it('should be able to overwrite inherited methods', function() {
      expect(myOtherChildInstance._name).toEqual('Petra');
      expect(myOtherChildInstance.sayName()).toEqual('Name is Petra');
    });
  });

  describe('object methods', function() {
    it('provides a bind method', function() {
      var method = myInstance.bind(myInstance.sayName, myInstance);
      expect(method()).toEqual('Elvis');
    });

    it('provides a bindAll method', function() {
      myInstance.bindAll(myInstance, 'sayName');
      var method = myInstance.sayName;
      expect(method()).toEqual('Elvis');
    });

    it('provides a bindAll method that works with inheritance', function() {
      myOtherChildInstance.bindAll(myOtherChildInstance, 'sayName');
      var method = myOtherChildInstance.sayName;
      expect(method()).toEqual('Name is Petra');
    });
  });
});
