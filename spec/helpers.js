beforeEach(function() {

  // fixtures are served by karma and used via jasmine-jquery plugin
  jasmine.getFixtures().fixturesPath = './base/spec/fixtures';

  loadJSON = function(name) {
    return JSON.parse(loadRawJSON(name));
  };

  loadRawJSON = function(name) {
    return jasmine.getFixtures().read(name + '.json');
  };

  initialize = function() {
    ffwdme.initialize({
      routing: 'GraphHopper',
      graphHopper: {
        apiKey: 'XXX'
      }
    });
  };

  restore = function() {
    ffwdme.reset();
  };

  jasmine.addMatchers({
    toBeType: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected) {
          var obj = actual;
          var passed = (typeof obj === expected);

          return {
            pass: passed,
            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to be of type ' + expected
          };
        }
      };
    },

    toBeInstanceOf: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expectedClass) {
          var obj = actual;
          var passed = (obj instanceof expectedClass);

          return {
            pass: passed,
            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to be instance of ' + expectedClass
          };
        }
      };
    },

    toHaveMethod: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expectedMethod) {
          var obj = actual;
          var passed = (typeof obj[expectedMethod] === 'function');

          return {
            pass: passed,
            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to have method ' + expectedMethod
          };
        }
      };
    },

    toHaveProperty: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expectedProperty) {
          var obj = actual;
          var passed = (typeof obj[expectedProperty] !== 'function') && (typeof obj[expectedProperty] !== 'undefined');

          return {
            pass: passed,
            message: 'Expected ' + actual + (passed ? '' : ' not') + ' to have property ' + expectedProperty
          };
        }
      };
    }
  });
});
