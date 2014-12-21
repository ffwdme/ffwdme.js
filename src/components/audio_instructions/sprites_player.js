/**
  * SpritesPlayer
  * Author: Simon Franzen
  */

/**
  * Constructor
  *
  * Initialize audio player and bind to canplaythrough and
  * timeupdate from audio player
  */

var SpritesPlayer = function(options) {

  this.options = options || {};

  this.audioEl = document.createElement('audio');

  this.srcLoaded = false;

  //check if browser can play audio file
  this.canPlayAudio = this.fileType() !== '';


  this.enabled = false;

  this.audioEl.addEventListener('canplaythrough', this.srcReady.bind(this), false);

  this.audioEl.addEventListener('timeupdate', this.checkProgress.bind(this), false);

};

SpritesPlayer.prototype.options = null;

SpritesPlayer.prototype.audioEl = null;

SpritesPlayer.prototype.loggerEl = null;

SpritesPlayer.prototype.sprite = null;

SpritesPlayer.prototype.spriteMetaData = null;

SpritesPlayer.prototype.currentSprite = null;

SpritesPlayer.prototype.srcLoaded = null;

SpritesPlayer.prototype.canPlayAudio = null;

/**
  * Source ready
  *
  * Called when audio player fires canplaythrough event
  */
SpritesPlayer.prototype.srcReady = function() {

  if (!this.srcLoaded){
    this.srcLoaded = true;
    if (this.playWhenReady){
      this.audioEl.currentTime = this.currentSprite.start;
      this.audioEl.play();
    }
  }

};

/**
  * Check progress
  *
  * Called when audio player fires timeupdate event
  * (when audio player is playing)
  */
SpritesPlayer.prototype.checkProgress = function() {

  if (!this.currentSprite){
    return;
  }

  var maxTime = this.currentSprite.start + this.currentSprite.length;

  if (this.audioEl.currentTime >= maxTime) {
    this.audioEl.pause();
  }

};

/**
  * Play
  *
  * Plays a new part in audio sprite.
  */
SpritesPlayer.prototype.play = function(s) {

  if (!this.enabled) return false;

  if (!this.canPlayAudio) return false;

  if (!this.spriteMetaData) return false;

  this.currentSprite = this.spriteMetaData[s];

  if (!this.currentSprite) return false;

  //set source if not set
  if (!this.audioEl.src.length){
    var src = this.sprite + this.fileType();
    this.audioEl.src = src;
    this.audioEl.load();
    this.playWhenReady = true;
    return true;
  }

  //all fine, play sprite
  if (this.srcLoaded){
    this.audioEl.pause();
    this.audioEl.currentTime = this.currentSprite.start;
    this.audioEl.play();
  }

  return true;

};

/**
  * File Type
  *
  * Determines file type which browser can play.
  */
SpritesPlayer.prototype.fileType = function() {
  // this.log('determine file type');

  if (this.audioEl.canPlayType('audio/mp3')) {
    return '.mp3';
  } else if (this.audioEl.canPlayType('audio/m4a')) {
    return '.m4a';
  } else if (this.audioEl.canPlayType('audio/ogg')) {
    return '.ogg';
  } else if (this.audioEl.canPlayType('audio/wav')){
    return '.wav';
  }else {
    return '';
  }

};

SpritesPlayer.prototype.toggleEnabled = function(){
  if (this.fileType() !== ''){
    this.enabled = !this.enabled;
    if (!this.enabled){
      this.audioEl.pause();
    }
  }
  return this.enabled;

};

/**
  * Set sprite
  *
  * Sets the audio sprite for the player
  */
SpritesPlayer.prototype.setSprite = function(sprite, spriteMetaData) {
  this.sprite = sprite;
  this.spriteMetaData = spriteMetaData;
};

/**
  * Dev Log

SpritesPlayer.prototype.log = function(text) {
  this.loggerEl || (this.loggerEl = document.getElementById('log'));
  this.loggerEl.innerHTML += text + '<br/>';
  return this;
};*/

module.exports = SpritesPlayer;
