'use strict';

/**
 * Module dependencies.
 */
var Emitter = require('jvent');

/**
 * Normalize events
 */
var on = window.addEventListener ? 'addEventListener' : 'attachEvent',
    off = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
    prefix = on !== 'addEventListener' ? 'on' : '';

/**
 * extend
 */
function extend(destination, from) {
  for (var prop in from) {
    if (from[prop]) {
      destination[prop] = from[prop];
    }
  }
  return destination;
}

/**
 * Inherits
 */
function inherits(child, uber) { child.prototype = extend(child.prototype || {}, uber.prototype); }

/**
 * Editable
 */
function Editable(el, title) {
  if (!(this instanceof Editable)) { return new Editable(el, title); }
  this.initialize(el, title);
}

/**
 * Inherits from Emitter
 */
inherits(Editable, Emitter);

/**
 * Initialize
 */
Editable.prototype.initialize = function(el, title) {
  this.el = el;
  this.title = title || 'Click to edit.';
  this.content = this.el.innerHTML;
  this.initialContent = this.el.innerHTML;

  this.el.setAttribute('title', this.title);
  this.el.setAttribute('tabindex', '0');

  this.bindEvents();
};

/**
 * Bind events
 */
Editable.prototype.bindEvents = function() {
  var that = this;
  this.el[on](prefix + 'focus', function() {
    that.el.setAttribute('contentEditable', true);
  }, false);
  this.el[on](prefix + 'keydown', this.onKeydown.bind(this), false);
  this.el[on](prefix + 'blur', this.onBlur.bind(this), false);
};

/**
 * onKeydown
 */
Editable.prototype.onKeydown = function(eve) {
  var esc = eve.which === 27,
      enter = eve.which === 13;

  if (esc) {
    this.el.innerHTML = this.content;
    this.el.blur();
    this.emit('cancel', this.content);
  } else if (enter) {
    this.el.blur();
  }
};

/**
 * onBlur
 */
Editable.prototype.onBlur = function() {
  this.el.removeAttribute('contentEditable');
  if (this.content !== this.el.innerHTML) {
    this.content = this.el.innerHTML;
    this.emit('done', this.content);
  }
};

/**
 * Destroy
 */
Editable.prototype.destroy = function() {
  this.el.innerHTML = this.initialContent;
  this.el.removeAttribute('contentEditable');
  this.el.removeAttribute('title');
  this.el[off](prefix + 'keydown');
  this.el[off](prefix + 'blur');
};

/**
 * Expose Editable
 */
module.exports = Editable;
