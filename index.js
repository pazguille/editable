/**
 * Module dependencies.
 */
var Emitter = require('emitter'),
	$ = require('jquery');

/**
 * Expose Editable
 */
exports = module.exports = Editable;

/**
 * Editable
 */
function Editable($el, options) {
	options = options || {};

	this.init($el, options);
}

Emitter(Editable.prototype);

Editable.prototype.init = function ($el, options) {
	var that = this;

	that.$el = $el;
	that.el = $el[0];
	that.title = options.title || 'Click to edit';
	that.content = that.el.innerHTML;

	that.el.setAttribute('contentEditable', true);
	that.el.setAttribute('title', that.title);

	that.$el.on('keydown.editable', function (event) {

		var esc = (event.which === 27),
			enter = (event.which === 13);

		if (esc) {
			that.el.innerHTML = that.content;
			that.el.blur();
			that.emit('cancel', that.content);

		} else if (enter) {
			that.el.blur();
		}

	});

	that.$el.on('blur.editable', function () {
		if (that.content !== that.el.innerHTML) {
			that.content = that.el.innerHTML;
			that.emit('done', that.content);
		}
	});
}