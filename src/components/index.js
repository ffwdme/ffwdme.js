var Base = require('./base');
var Arrow = require('./arrow');
var ArrivalTime = require('./arrival_time');
var AudioInstructions = require('./audio_instructions');
var AutoReroute = require('./auto_reroute');
var AutoZoom = require('./auto_zoom');
var DistanceToDestination = require('./distance_to_destination');
var DistanceToNextTurn = require('./distance_to_next_turn');
var Leaflet = require('./leaflet');
var MapRotator = require('./map_rotator');
var NextStreet = require('./next_street');
var RouteOverview = require('./route_overview');
var Speed = require('./speed');
var Zoom = require('./zoom');
var TimeToDestination = require('./time_to_destination');

;(function(ffwdme){
  ffwdme.components = {
    Base: Base,
    ArrivalTime: ArrivalTime,
    Arrow: Arrow,
    AudioInstructions: AudioInstructions,
    AutoReroute: AutoReroute,
    AutoZoom: AutoZoom,
    DistanceToDestination: DistanceToDestination,
    DistanceToNextTurn: DistanceToNextTurn,
    Leaflet: Leaflet,
    MapRotator: MapRotator,
    NextStreet: NextStreet,
    RouteOverview: RouteOverview,
    Speed: Speed,
    TimeToDestination: TimeToDestination,
    Zoom: Zoom
  };
})(ffwdme);
