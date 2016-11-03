var Base = require('./base');

var GraphHopper = Base.extend({
  /**
   * Creates a new instance of the GraphHopper routing service class.
   * When doing so, this object adds itself as the a global handler for route
   * responses.
   *
   * Options:
   * - apiKey
   *
   * @class The class represents a client for the ffwdme routing service
   * using GraphHopper.
   *
   * @augments ffwdme.Class
   * @constructs
   *
   */
  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'parse', 'error');

    this.apiKey = ffwdme.options.graphHopper.apiKey;

    if (options.anchorPoint) {
      this.anchorPoint = options.anchorPoint;
      this.direction = this.start;
      this.start = this.anchorPoint;
    }
  },

  /**
   * The base url for the service.
   *
   * @type String
   */
  BASE_URL: '//graphhopper.com/api/1/',

  // set via constructor
  apiKey: null,

  modifier: 'fastest',

  routeType: 'car',

  lang: 'en_EN',

  route: null,

  anchorPoint: null,

  direction: null,

  fetch: function() {

    var via = '';

    if (this.direction) {
      via += '&point=' + [this.direction.lat, this.direction.lng].join('%2C');
    }

    var reqUrl = [
      this.BASE_URL,
      'route?type=jsonp',
      '&key=',
      this.apiKey,
      '&locale=',
      this.lang,
      '&vehicle=',
      this.routeType,
      '&weighting=',
      this.modifier,
      '&point=',
      [
        this.start.lat,
        this.start.lng,
      ].join('%2C'),
      via,
      '&point=',
      [
        this.dest.lat,
        this.dest.lng
      ].join('%2C')
    ];

    ffwdme.trigger(this.eventPrefix() + ':start', { routing: this });

    ffwdme.utils.Proxy.get({
      url: reqUrl.join(''),
      success: this.parse,
      error: this.error
    });

    return ffwdme;
  },

  error: function(error) {
    this.base(error);
  },

  parse: function(response) {

    // check for error codes
    // https://github.com/graphhopper/graphhopper/blob/master/docs/web/api-doc.md
    if (response.info.errors) return this.error(response);

    var route = response.paths[0];

    var routeStruct = { directions: [] };
    routeStruct.summary = {
      distance: parseInt(route.distance, 10),
      duration: route.time / 1000
    };

    var path = ffwdme.Route.decodePolyline(route.points);

    var instruction, d, extractedStreet, geomArr;
    var instructions = route.instructions;

    // we remove the last instruction as it only says "Finish!" in
    // GraphHopper and has no value for us.
    instructions.pop();

    for (var i = 0, len = instructions.length; i < len; i++) {
      instruction = instructions[i];
      d = {
        instruction:  instruction.text,
        distance:     parseInt(instruction.distance, 10),
        duration:     instruction.time / 1000,
        turnAngle:    this.extractTurnAngle(instruction.sign),
        turnType:     this.extractTurnType(instruction)
      };

      d.path = path.slice(instruction.interval[0], instruction.interval[1] + 1);

      // Strip the streetname out of the route description
      extractedStreet = d.instruction.split(/(?:on |near |onto |at |Head )/).pop();
      d.street = extractedStreet.length == d.instruction.length ? '' : extractedStreet;

      routeStruct.directions.push(d);
    }

    this.route = new ffwdme.Route().parse(routeStruct);

    this.success(response, this.route);
  },

  // "FINISH"
  // "EXIT1"
  // "EXIT2"
  // "EXIT3"
  // "EXIT4"
  // "EXIT5"
  // "EXIT6"
  // "TU"
  extractTurnType: function(instruction) {
    var name;
    switch (instruction.sign) {
    case 0: //continue (go straight)
      name = 'C';
      break;
    case -2: // turn left
       name = 'TL';
       break;
    case -1: // turn slight left
      name = 'TSLL';
      break;
    case -3: // turn sharp left
      name = 'TSHL';
      break;
    case 2: // turn right
      name = 'TR';
      break;
    case 1: // turn slight right
      name = 'TSLR';
      break;
    case 3: // turn sharp right
      name = 'TSHR';
      break;
    case 6:
      name = 'EXIT' + instruction.exit_number;
      break;
    // case 'TU': // U-turn
    //   name = 180;
    //   break;
    }
    return name;
  },

  // see https://github.com/graphhopper/graphhopper/blob/master/docs/web/api-doc.md
  extractTurnAngle: function(indication) {
    var angle;
    switch (indication) {
    case 0: //continue (go straight)
      angle = 0;
      break;
    case -2: // turn left
       angle = 90;
       break;
    case -1: // turn slight left
      angle = 45;
      break;
    case -3: // turn sharp left
      angle = 135;
      break;
    case 2: // turn right
      angle = -90;
      break;
    case 1: // turn slight right
      angle = -45;
      break;
    case 3: // turn sharp right
      angle = -135;
      break;
    // case 'TU': // U-turn
    //   angle = 180;
    //   break;
    }
    return angle;
  }
});

module.exports = GraphHopper;
