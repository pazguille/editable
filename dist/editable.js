!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Editable=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"jvent":2}],2:[function(require,module,exports){
'use strict';

function Jvent() {}

/**
 * Adds a listener to the collection for a specified event.
 * @public
 * @function
 * @name Jvent#on
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @example
 * // Will add a event listener to the "ready" event
 * var startDoingStuff = function (event, param1, param2, ...) {
 *   // Some code here!
 * };
 *
 * me.on("ready", startDoingStuff);
 */
Jvent.prototype.on = function(event, listener) {
  this._collection = this._collection || {};
  this._collection[event] = this._collection[event] || [];
  this._collection[event].push(listener);
  return this;
};

/**
 * Adds a one time listener to the collection for a specified event. It will execute only once.
 * @public
 * @function
 * @name Jvent#once
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @returns itself
 * @example
 * // Will add a event handler to the "contentLoad" event once
 * me.once("contentLoad", startDoingStuff);
 */
Jvent.prototype.once = function (event, listener) {
  var that = this;

  function fn() {
    that.off(event, fn);
    listener.apply(this, arguments);
  }

  fn.listener = listener;

  this.on(event, fn);

  return this;
};

/**
 * Removes a listener from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#off
 * @param {string} event Event name.
 * @param {function} listener Listener function.
 * @returns itself
 * @example
 * // Will remove event handler to the "ready" event
 * var startDoingStuff = function () {
 *   // Some code here!
 * };
 *
 * me.off("ready", startDoingStuff);
 */
Jvent.prototype.off = function (event, listener) {

  var listeners = this._collection[event],
      j = 0;

  if (listeners !== undefined) {
    for (j; j < listeners.length; j += 1) {
      if (listeners[j] === listener || listeners[j].listener === listener) {
        listeners.splice(j, 1);
        break;
      }
    }
  }

  if (listeners.length === 0) {
    this.removeAllListeners(event);
  }

  return this;
};

/**
 * Removes all listeners from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#removeAllListeners
 * @param {string} event Event name.
 * @returns itself
 * @example
 * me.removeAllListeners("ready");
 */
Jvent.prototype.removeAllListeners = function (event) {
  this._collection = this._collection || {};
  delete this._collection[event];
  return this;
};

/**
 * Returns all listeners from the collection for a specified event.
 * @public
 * @function
 * @name Jvent#listeners
 * @param {string} event Event name.
 * @returns Array
 * @example
 * me.listeners("ready");
 */
Jvent.prototype.listeners = function (event) {
  this._collection = this._collection || {};
  return this._collection[event];
};

/**
 * Execute each item in the listener collection in order with the specified data.
 * @name Jvent#emit
 * @public
 * @protected
 * @param {string} event The name of the event you want to emit.
 * @param {...object} var_args Data to pass to the listeners.
 * @example
 * // Will emit the "ready" event with "param1" and "param2" as arguments.
 * me.emit("ready", "param1", "param2");
 */
Jvent.prototype.emit = function () {
  if (this._collection === undefined) {
    return this;
  }

  var args = [].slice.call(arguments, 0), // converted to array
      event = args.shift(),
      listeners = this._collection[event],
      i = 0,
      len;

  if (listeners) {
    listeners = listeners.slice(0);
    len = listeners.length;
    for (i; i < len; i += 1) {
      listeners[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Expose
 */
module.exports = Jvent;

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9qdmVudC9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBNb2R1bGUgZGVwZW5kZW5jaWVzLlxuICovXG52YXIgRW1pdHRlciA9IHJlcXVpcmUoJ2p2ZW50Jyk7XG5cbi8qKlxuICogTm9ybWFsaXplIGV2ZW50c1xuICovXG52YXIgb24gPSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciA/ICdhZGRFdmVudExpc3RlbmVyJyA6ICdhdHRhY2hFdmVudCcsXG4gICAgb2ZmID0gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIgPyAncmVtb3ZlRXZlbnRMaXN0ZW5lcicgOiAnZGV0YWNoRXZlbnQnLFxuICAgIHByZWZpeCA9IG9uICE9PSAnYWRkRXZlbnRMaXN0ZW5lcicgPyAnb24nIDogJyc7XG5cbi8qKlxuICogZXh0ZW5kXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChkZXN0aW5hdGlvbiwgZnJvbSkge1xuICBmb3IgKHZhciBwcm9wIGluIGZyb20pIHtcbiAgICBpZiAoZnJvbVtwcm9wXSkge1xuICAgICAgZGVzdGluYXRpb25bcHJvcF0gPSBmcm9tW3Byb3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzdGluYXRpb247XG59XG5cbi8qKlxuICogSW5oZXJpdHNcbiAqL1xuZnVuY3Rpb24gaW5oZXJpdHMoY2hpbGQsIHViZXIpIHsgY2hpbGQucHJvdG90eXBlID0gZXh0ZW5kKGNoaWxkLnByb3RvdHlwZSB8fCB7fSwgdWJlci5wcm90b3R5cGUpOyB9XG5cbi8qKlxuICogRWRpdGFibGVcbiAqL1xuZnVuY3Rpb24gRWRpdGFibGUoZWwsIHRpdGxlKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBFZGl0YWJsZSkpIHsgcmV0dXJuIG5ldyBFZGl0YWJsZShlbCwgdGl0bGUpOyB9XG4gIHRoaXMuaW5pdGlhbGl6ZShlbCwgdGl0bGUpO1xufVxuXG4vKipcbiAqIEluaGVyaXRzIGZyb20gRW1pdHRlclxuICovXG5pbmhlcml0cyhFZGl0YWJsZSwgRW1pdHRlcik7XG5cbi8qKlxuICogSW5pdGlhbGl6ZVxuICovXG5FZGl0YWJsZS5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uKGVsLCB0aXRsZSkge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMudGl0bGUgPSB0aXRsZSB8fCAnQ2xpY2sgdG8gZWRpdC4nO1xuICB0aGlzLmNvbnRlbnQgPSB0aGlzLmVsLmlubmVySFRNTDtcbiAgdGhpcy5pbml0aWFsQ29udGVudCA9IHRoaXMuZWwuaW5uZXJIVE1MO1xuXG4gIHRoaXMuZWwuc2V0QXR0cmlidXRlKCd0aXRsZScsIHRoaXMudGl0bGUpO1xuICB0aGlzLmVsLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAnMCcpO1xuXG4gIHRoaXMuYmluZEV2ZW50cygpO1xufTtcblxuLyoqXG4gKiBCaW5kIGV2ZW50c1xuICovXG5FZGl0YWJsZS5wcm90b3R5cGUuYmluZEV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHRoaXMuZWxbb25dKHByZWZpeCArICdmb2N1cycsIGZ1bmN0aW9uKCkge1xuICAgIHRoYXQuZWwuc2V0QXR0cmlidXRlKCdjb250ZW50RWRpdGFibGUnLCB0cnVlKTtcbiAgfSwgZmFsc2UpO1xuICB0aGlzLmVsW29uXShwcmVmaXggKyAna2V5ZG93bicsIHRoaXMub25LZXlkb3duLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgdGhpcy5lbFtvbl0ocHJlZml4ICsgJ2JsdXInLCB0aGlzLm9uQmx1ci5iaW5kKHRoaXMpLCBmYWxzZSk7XG59O1xuXG4vKipcbiAqIG9uS2V5ZG93blxuICovXG5FZGl0YWJsZS5wcm90b3R5cGUub25LZXlkb3duID0gZnVuY3Rpb24oZXZlKSB7XG4gIHZhciBlc2MgPSBldmUud2hpY2ggPT09IDI3LFxuICAgICAgZW50ZXIgPSBldmUud2hpY2ggPT09IDEzO1xuXG4gIGlmIChlc2MpIHtcbiAgICB0aGlzLmVsLmlubmVySFRNTCA9IHRoaXMuY29udGVudDtcbiAgICB0aGlzLmVsLmJsdXIoKTtcbiAgICB0aGlzLmVtaXQoJ2NhbmNlbCcsIHRoaXMuY29udGVudCk7XG4gIH0gZWxzZSBpZiAoZW50ZXIpIHtcbiAgICB0aGlzLmVsLmJsdXIoKTtcbiAgfVxufTtcblxuLyoqXG4gKiBvbkJsdXJcbiAqL1xuRWRpdGFibGUucHJvdG90eXBlLm9uQmx1ciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSgnY29udGVudEVkaXRhYmxlJyk7XG4gIGlmICh0aGlzLmNvbnRlbnQgIT09IHRoaXMuZWwuaW5uZXJIVE1MKSB7XG4gICAgdGhpcy5jb250ZW50ID0gdGhpcy5lbC5pbm5lckhUTUw7XG4gICAgdGhpcy5lbWl0KCdkb25lJywgdGhpcy5jb250ZW50KTtcbiAgfVxufTtcblxuLyoqXG4gKiBEZXN0cm95XG4gKi9cbkVkaXRhYmxlLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWwuaW5uZXJIVE1MID0gdGhpcy5pbml0aWFsQ29udGVudDtcbiAgdGhpcy5lbC5yZW1vdmVBdHRyaWJ1dGUoJ2NvbnRlbnRFZGl0YWJsZScpO1xuICB0aGlzLmVsLnJlbW92ZUF0dHJpYnV0ZSgndGl0bGUnKTtcbiAgdGhpcy5lbFtvZmZdKHByZWZpeCArICdrZXlkb3duJyk7XG4gIHRoaXMuZWxbb2ZmXShwcmVmaXggKyAnYmx1cicpO1xufTtcblxuLyoqXG4gKiBFeHBvc2UgRWRpdGFibGVcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBFZGl0YWJsZTtcbiIsIid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gSnZlbnQoKSB7fVxuXG4vKipcbiAqIEFkZHMgYSBsaXN0ZW5lciB0byB0aGUgY29sbGVjdGlvbiBmb3IgYSBzcGVjaWZpZWQgZXZlbnQuXG4gKiBAcHVibGljXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEp2ZW50I29uXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgRXZlbnQgbmFtZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpc3RlbmVyIExpc3RlbmVyIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqIC8vIFdpbGwgYWRkIGEgZXZlbnQgbGlzdGVuZXIgdG8gdGhlIFwicmVhZHlcIiBldmVudFxuICogdmFyIHN0YXJ0RG9pbmdTdHVmZiA9IGZ1bmN0aW9uIChldmVudCwgcGFyYW0xLCBwYXJhbTIsIC4uLikge1xuICogICAvLyBTb21lIGNvZGUgaGVyZSFcbiAqIH07XG4gKlxuICogbWUub24oXCJyZWFkeVwiLCBzdGFydERvaW5nU3R1ZmYpO1xuICovXG5KdmVudC5wcm90b3R5cGUub24gPSBmdW5jdGlvbihldmVudCwgbGlzdGVuZXIpIHtcbiAgdGhpcy5fY29sbGVjdGlvbiA9IHRoaXMuX2NvbGxlY3Rpb24gfHwge307XG4gIHRoaXMuX2NvbGxlY3Rpb25bZXZlbnRdID0gdGhpcy5fY29sbGVjdGlvbltldmVudF0gfHwgW107XG4gIHRoaXMuX2NvbGxlY3Rpb25bZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhIG9uZSB0aW1lIGxpc3RlbmVyIHRvIHRoZSBjb2xsZWN0aW9uIGZvciBhIHNwZWNpZmllZCBldmVudC4gSXQgd2lsbCBleGVjdXRlIG9ubHkgb25jZS5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgSnZlbnQjb25jZVxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IEV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIGl0c2VsZlxuICogQGV4YW1wbGVcbiAqIC8vIFdpbGwgYWRkIGEgZXZlbnQgaGFuZGxlciB0byB0aGUgXCJjb250ZW50TG9hZFwiIGV2ZW50IG9uY2VcbiAqIG1lLm9uY2UoXCJjb250ZW50TG9hZFwiLCBzdGFydERvaW5nU3R1ZmYpO1xuICovXG5KdmVudC5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIChldmVudCwgbGlzdGVuZXIpIHtcbiAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIGZuKCkge1xuICAgIHRoYXQub2ZmKGV2ZW50LCBmbik7XG4gICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIGZuLmxpc3RlbmVyID0gbGlzdGVuZXI7XG5cbiAgdGhpcy5vbihldmVudCwgZm4pO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnJvbSB0aGUgY29sbGVjdGlvbiBmb3IgYSBzcGVjaWZpZWQgZXZlbnQuXG4gKiBAcHVibGljXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEp2ZW50I29mZlxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IEV2ZW50IG5hbWUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsaXN0ZW5lciBMaXN0ZW5lciBmdW5jdGlvbi5cbiAqIEByZXR1cm5zIGl0c2VsZlxuICogQGV4YW1wbGVcbiAqIC8vIFdpbGwgcmVtb3ZlIGV2ZW50IGhhbmRsZXIgdG8gdGhlIFwicmVhZHlcIiBldmVudFxuICogdmFyIHN0YXJ0RG9pbmdTdHVmZiA9IGZ1bmN0aW9uICgpIHtcbiAqICAgLy8gU29tZSBjb2RlIGhlcmUhXG4gKiB9O1xuICpcbiAqIG1lLm9mZihcInJlYWR5XCIsIHN0YXJ0RG9pbmdTdHVmZik7XG4gKi9cbkp2ZW50LnByb3RvdHlwZS5vZmYgPSBmdW5jdGlvbiAoZXZlbnQsIGxpc3RlbmVyKSB7XG5cbiAgdmFyIGxpc3RlbmVycyA9IHRoaXMuX2NvbGxlY3Rpb25bZXZlbnRdLFxuICAgICAgaiA9IDA7XG5cbiAgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZm9yIChqOyBqIDwgbGlzdGVuZXJzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICBpZiAobGlzdGVuZXJzW2pdID09PSBsaXN0ZW5lciB8fCBsaXN0ZW5lcnNbal0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaiwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChsaXN0ZW5lcnMubGVuZ3RoID09PSAwKSB7XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoZXZlbnQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIHRoZSBjb2xsZWN0aW9uIGZvciBhIHNwZWNpZmllZCBldmVudC5cbiAqIEBwdWJsaWNcbiAqIEBmdW5jdGlvblxuICogQG5hbWUgSnZlbnQjcmVtb3ZlQWxsTGlzdGVuZXJzXG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnQgRXZlbnQgbmFtZS5cbiAqIEByZXR1cm5zIGl0c2VsZlxuICogQGV4YW1wbGVcbiAqIG1lLnJlbW92ZUFsbExpc3RlbmVycyhcInJlYWR5XCIpO1xuICovXG5KdmVudC5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHRoaXMuX2NvbGxlY3Rpb24gPSB0aGlzLl9jb2xsZWN0aW9uIHx8IHt9O1xuICBkZWxldGUgdGhpcy5fY29sbGVjdGlvbltldmVudF07XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm5zIGFsbCBsaXN0ZW5lcnMgZnJvbSB0aGUgY29sbGVjdGlvbiBmb3IgYSBzcGVjaWZpZWQgZXZlbnQuXG4gKiBAcHVibGljXG4gKiBAZnVuY3Rpb25cbiAqIEBuYW1lIEp2ZW50I2xpc3RlbmVyc1xuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IEV2ZW50IG5hbWUuXG4gKiBAcmV0dXJucyBBcnJheVxuICogQGV4YW1wbGVcbiAqIG1lLmxpc3RlbmVycyhcInJlYWR5XCIpO1xuICovXG5KdmVudC5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHRoaXMuX2NvbGxlY3Rpb24gPSB0aGlzLl9jb2xsZWN0aW9uIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY29sbGVjdGlvbltldmVudF07XG59O1xuXG4vKipcbiAqIEV4ZWN1dGUgZWFjaCBpdGVtIGluIHRoZSBsaXN0ZW5lciBjb2xsZWN0aW9uIGluIG9yZGVyIHdpdGggdGhlIHNwZWNpZmllZCBkYXRhLlxuICogQG5hbWUgSnZlbnQjZW1pdFxuICogQHB1YmxpY1xuICogQHByb3RlY3RlZFxuICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50IFRoZSBuYW1lIG9mIHRoZSBldmVudCB5b3Ugd2FudCB0byBlbWl0LlxuICogQHBhcmFtIHsuLi5vYmplY3R9IHZhcl9hcmdzIERhdGEgdG8gcGFzcyB0byB0aGUgbGlzdGVuZXJzLlxuICogQGV4YW1wbGVcbiAqIC8vIFdpbGwgZW1pdCB0aGUgXCJyZWFkeVwiIGV2ZW50IHdpdGggXCJwYXJhbTFcIiBhbmQgXCJwYXJhbTJcIiBhcyBhcmd1bWVudHMuXG4gKiBtZS5lbWl0KFwicmVhZHlcIiwgXCJwYXJhbTFcIiwgXCJwYXJhbTJcIik7XG4gKi9cbkp2ZW50LnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcy5fY29sbGVjdGlvbiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgYXJncyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKSwgLy8gY29udmVydGVkIHRvIGFycmF5XG4gICAgICBldmVudCA9IGFyZ3Muc2hpZnQoKSxcbiAgICAgIGxpc3RlbmVycyA9IHRoaXMuX2NvbGxlY3Rpb25bZXZlbnRdLFxuICAgICAgaSA9IDAsXG4gICAgICBsZW47XG5cbiAgaWYgKGxpc3RlbmVycykge1xuICAgIGxpc3RlbmVycyA9IGxpc3RlbmVycy5zbGljZSgwKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaTsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEV4cG9zZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IEp2ZW50O1xuIl19
