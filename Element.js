var extend = require('node.extend');
var StatefulObject = require('./StatefulObject');

var Element = function(config) {
	StatefulObject.call(this);
	extend(this, config);
	this.state.timesRepeated = 0;
};

Element.prototype = extend(new StatefulObject(), {
	onNote: function(note, timestamp) {
		if (!this.start.state.recognized) {
			this.start.onNote(note, timestamp);
		} else if (!this.end.state.recognized) {
			this.end.onNote(note, timestamp);
		}

		if (this.start.state.recognized && this.end.state.recognized) {
			this.start.resetState();
			this.end.resetState();
			this.state.timesRepeated ++;
			if (this.state.timesRepeated == this.repeats) {
				this.complete = true;
				this.resetState();
				console.log("Element complete");
				return;
			}

			if (this.start.actionRepeats == this.state.timesRepeated) {
				this.start.action = null;
			}

			if (this.start.actionRepeats == this.state.timesRepeated) {
				this.end.action = null;
			}
		}
	},
	resetState: function() {
		this.state.timesRepeated = 0;
	}
});

module.exports = Element;