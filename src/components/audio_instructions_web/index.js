var Base = require('../base');
var WebAudioPlayer = require('./web_audio_player');

var AudioInstructionsWeb = Base.extend({

  constructor: function(options) {
    this.base(options);
    this.bindAll(this, 'navigationOnRoute', 'onGeopositionUpdate', 'toggleSound');

     //init audio player
    this.player = new WebAudioPlayer({audioData: options.audioData});

    ffwdme.on('navigation:onroute', this.navigationOnRoute);
    ffwdme.on('geoposition:update', this.onGeopositionUpdate);

    this.render();
  },

  lastAction: '',

  player: null,

  iconSoundOff: 'audio_instructions_web/sound-off.svg',

  icon: 'audio_instructions_web/sound-off.svg',

  iconSoundOn: 'audio_instructions_web/sound-on.svg',

  classes: 'ffwdme-components-container ffwdme-grid-w2 ffwdme-grid-h1',

  logoEl: null,

  forwardMeters: 50,

  navigationOnRoute: function(e) {

    var destinationDistance = e.navInfo.distanceToDestination;
    var distance = e.navInfo.distanceToNextDirection;
    var nextDirection = e.navInfo.nextDirection;

    if (destinationDistance && destinationDistance < this.forwardMeters && action != this.lastAction){
      this.player.play('FINISH');
      this.lastAction = action;
      return;
    }

    if (!distance || !nextDirection) return;

    var action = this.audioAction(distance, nextDirection.turnType);
    if (action.length && action != this.lastAction){
      this.player.play(action, nextDirection);
      this.lastAction = action;
    }

  },

  onGeopositionUpdate: function(e) {
    var speed = e.geoposition.coords.speed;
    this.forwardMeters = this.forwardMetersBySpeed(speed);
  },

  // meters per second
  forwardMetersBySpeed: function(speed) {
    //something wrong
    if (speed === 0) return 40;

    var fm = 20;

    if (speed < 11) {
      fm = speed * 4;
    } else if (speed < 22) {
      fm = speed * 5;
    } else {
      fm = speed * 6;
    }

    if (fm < 25) return 25;

    return fm;
  },

  audioAction: function(distance, turnType) {

    var _distance = '';
    var acceptedBackwardsMeters = this.forwardMeters / 4;

    if (turnType == 'TU'){
      return turnType;
    }

    if (/^EXIT/.test(turnType) && distance > 500){
      return '';
    }

    if (/^EXIT/.test(turnType)){
      return turnType;
    }

    if (distance > (1200-acceptedBackwardsMeters) &&
        distance < (10000+this.forwardMeters)){
      return 'C';
    } else if (distance > 10000){
      return 'C_LONG';
    }

    //distance
    if (distance > (1000-acceptedBackwardsMeters) && distance < (1000+this.forwardMeters)) {
      _distance = '_1000';
    } else if ( distance > (500-acceptedBackwardsMeters) && distance < (500+this.forwardMeters)) {
      _distance = '_500';
    } else if (distance > (100-acceptedBackwardsMeters) && distance < (100+this.forwardMeters)) {
      _distance = '_100';
    } else if (distance > 0 && distance < (10 + this.forwardMeters) && turnType != 'C') {
      _distance = '_now';
    }
    if (_distance.length){
      return turnType + _distance;
    } else {
      return '';
    }
  },


  imgUrl: function(){
    return this.getRetinaImageUrl(ffwdme.defaults.imageBaseUrl + this.icon);
  },

  iconEl: null,

  setIcon: function() {
    if (!this.iconEl) {
      var img = document.createElement('img');
      this.iconEl = $(img).addClass('ffwdme-components-audio-instructions-web').appendTo($(this.el));
    }

    this.iconEl[0].src = this.imgUrl();
  },

  toggleSound: function(e){

    if (this.player.toggleEnabled()){
      this.icon = this.iconSoundOn;

      this.player.play('INIT');
    } else {
      this.icon = this.iconSoundOff;
    }

    if (!this.player.canPlayAudio){
      this.icon = this.iconSoundOff;
      console.info('Browser does not support audio instructions');
      ffwdme.trigger('audio:error', { player: this.player });
    }


    this.setIcon();

  },

  make: function(){
    this.base();
    var self = this;
    $(this.el).click(function(e) { e.stopPropagation(); self.toggleSound(); });

    this.setIcon();
    return this;
  }
});

module.exports = AudioInstructionsWeb; // done
