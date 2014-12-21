/**
 * @class
 * This singleton provides a script tag proxy for asynchronous cross domain
 * requests using JSONP.
 *
 */
var Proxy = {

  /**
   *
   * A hashtable that holds references to all generated script tags.
   * The key is the generated id for the tag.
   *
   * @property
   * @type Object
   */
  _tags: {},

  callbacks: {},

  errorCallbacks: {},

  successfullCallbacks: {},

  devNull: function(){},

  /**
   * Counter for the generated ids of the script tags.
   *
   * @type Integer
   */
  _idCounter: 0,

  /**
   * The prefix that is used to generate the ids of
   * the script tags.
   *
   * @type String
   */
  _idPrefix: 'ffwdme-Proxy-',

  _callbackPrefix: 'ffwdme.utils.Proxy.callbacks.',

  _headTag: document.getElementsByTagName('head')[0],

  checkForTimeout: function(callbackId) {
    if (this.successfullCallbacks[callbackId] === true) return;
    this.errorCallbacks[callbackId]();
  },

  removeTimeoutCheck: function(callbackId) {
    this.callbacks[callbackId] = this.devNull;
    delete(this.errorCallbacks[callbackId]);
  },

  get: function(options) {

    options = options || {};

    var callback   = options.callback || 'callback',
        tagId = this._idPrefix + this._idCounter++,
        callbackId = 'cb' + this._idCounter,
        self = this;

    var url = [
      options.url,
      options.url.indexOf('?') > -1 ? '&' : '?',
      callback,
      '=',
      this._callbackPrefix, callbackId
    ].join('');

    var scriptTag = this.buildScriptTag(url, tagId);

    var onSuccess = options.success;

    this.callbacks[callbackId]  = function(response) {
      self.successfullCallbacks[callbackId] = true;
      self.removeTimeoutCheck(callbackId);
      if (onSuccess){
        onSuccess(response);
      }
    };

    var onError = options.error;

    this.errorCallbacks[callbackId]  = function() {
      self.removeTimeoutCheck(callbackId);
      if (onError){
        onError({ error: 'timeout' });
      }
    };

    this._tags[tagId]       = scriptTag;
    this._headTag.appendChild(scriptTag);

    window.setTimeout(ffwdme.Class.prototype.bind.call(this, this.checkForTimeout, this), options.timeout || 10000, callbackId);
  },


  /**
   * Creates a new script tag and adds it to the header of
   * the DOM of the current page.
   *
   * @param {String} url
   *   The url to use for the 'src' attribute of the script tag.
   *
   * @returns {String} The id of the generated tag.
   */
  buildScriptTag: function(url, id) {
    var scriptTag = document.createElement('script');
    scriptTag.setAttribute('type', 'text/javascript');
    scriptTag.setAttribute('charset', 'utf-8');
    scriptTag.setAttribute('src', url);
    scriptTag.setAttribute('id', id);

    return scriptTag;
  },

  /**
   * Removes the script tag with the passed id, if exists.
   *
   * @param {String} tagId
   *   The id of the tag to be removed.
   */
  removeScriptTag: function(tagId) {
    if (this._tags[tagId]) {
      this._headTag.removeChild(this._tags[tagId]);
      delete this._tags[tagId];
    }
  }

};

module.exports = Proxy;
