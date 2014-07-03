var extend = require('node.extend');
var StatefulObject = require('./StatefulObject');

var Element = function(config) {
	extend(this, config);
	this._state.noteBuffer = [];
	this._state.timesRepeated = 0;
};

Element.prototype = new StatefulObject({
	onNote: function(note, timestamp) {
		if (!this.start._state.recognized) {
			this.start.onNote(note, timestamp);
		} else if (!this.end._state.recognized) {
			this.end.onNote(note, timestamp);
		} else if (this.start._state.recognized && this.end._state.recognized && this._state.timesRepeated == this.repeat) {
			this.complete = true;
		} else {
			this.start.resetState();
			this.end.resetState();
			this._state.timesRepeated ++;
		}
	}
});

module.exports = Element;