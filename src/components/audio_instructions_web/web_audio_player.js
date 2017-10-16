/**
 * WebAudioPlayer
 * Author: Simon Franzen
 */

/**
 * Constructor
 *
 * Initialize audio player and bind to canplaythrough and
 * timeupdate from audio player
 */

var WebAudioPlayer = function (options) {

    this.options = options || {};

    this.audioData = options.audioData;

    //check if browser can play audio file
    this.canPlayAudio = ('speechSynthesis' in window);

    this.enabled = false;

};

WebAudioPlayer.prototype.options = null;

WebAudioPlayer.prototype.canPlayAudio = null;

/**
 * Play a string with a street name
 *
 * .
 */
WebAudioPlayer.prototype.play = function (directionCode, nextDirection) {

    if (!this.enabled) return false;

    if (!this.canPlayAudio) return false;

    direction =  this.audioData[directionCode];
    if (typeof direction === 'undefined') {
        console.log('no phrase for ' + directionCode);
        return false;
    }

    if (typeof nextDirection !== 'undefined') {
        direction = direction.replace('{{street}}', nextDirection.street);
    }

    var msg = new SpeechSynthesisUtterance(direction);
    window.speechSynthesis.speak(msg);

    return true;

};

WebAudioPlayer.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled;
    return this.enabled;

};


module.exports = WebAudioPlayer;
