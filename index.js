/**
 * Module dependencies.
 */
var Emitter = require('emitter');

/**
 * Expose Editable
 */
exports = module.exports = Editable;

/**
 * Editable
 */
function Editable(el, title) {
    if (!(this instanceof Editable)) return new Editable(el, title);
    this.init(el, title);
}

Emitter(Editable.prototype);

Editable.prototype.init = function (el, title) {
    var that = this;

    that.el = el;
    that.title = title || 'Click to edit.';
    that.content = that.el.innerHTML;

    that.el.setAttribute('contentEditable', true);
    that.el.setAttribute('title', that.title);

    // W3C
    if (that.el.addEventListener) {
        that.el.addEventListener('keydown', function () {
            that.onKeydown(event);
        }, false);
        that.el.addEventListener('blur', function () {
            that.onBlur();
        }, false);

    // IE
    } else if (that.el.attachEvent)  {
        that.el.attachEvent('onkeydown', function (event) {
            that.onKeydown(event)
        });
        that.el.attachEvent('onblur', function () {
            that.onBlur();
        });
    }
}

Editable.prototype.onKeydown = function (event) {
    var esc = (event.which === 27),
        enter = (event.which === 13);

    if (esc) {
        this.el.innerHTML = this.content;
        this.el.blur();
        this.emit('cancel', this.content);

    } else if (enter) {
        this.el.blur();
    }
}

Editable.prototype.onBlur = function () {
    if (this.content !== this.el.innerHTML) {
        this.content = this.el.innerHTML;
        this.emit('done', this.content);
    }
}


Editable.prototype.destroy = function () {}
