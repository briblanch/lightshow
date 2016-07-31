var extend 			= require('node.extend');
var StatefulObject 	= require('./StatefulObject');
var log			   	= require('./log');

var Element = function(config) {
	StatefulObject.call(this);
	extend(this, config);
	this.middleIndex = 0;
	this.state.timesRepeated = 0;
};

Element.prototype = extend(new StatefulObject(), {
	onNote: function(note, timestamp) {
		if (!this.start.state.recognized) {
			this.state.currentSequence = this.start;
			this.start.onNote(note, timestamp);
		} else if (this.middle && !this.state.middleRecognized) {
			var middleReached = false;

			if (!this.middle[this.middleIndex].state.recognized) {
				this.middle[this.middleIndex].onNote(note, timestamp);
				this.state.currentSequence = this.middle;
				middleReached = true;
			}

			if (middleReached && this.middle[this.middleIndex].state.recognized) {
				if (this.middleIndex < this.middle.length - 1) {
					this.middleIndex++;
				} else {
					this.state.middleRecognized = true;
				}
			}
		} else if (!this.end.state.recognized) {
			this.end.onNote(note, timestamp);
			this.state.currentSequence = this.end;
		}

		if (this.catchAll && this.start.state.recognized) {
			this.catchAll(this.state.currentSequence);
		}

		if (this.start.state.recognized && this.end.state.recognized) {
			this.start.state.recognized = false;

			if (this.middle) {
				this.middleIndex = 0;
				this.state.middleRecognized = false;

				for(var i = 0; i < this.middle.length; i++) {
					this.middle[i].state.recognized = false;
				}
			}

			this.end.state.recognized = false;
			this.state.timesRepeated++;

			if (this.state.timesRepeated == this.repeats) {
				this.start.resetState();

				if (this.middle) {
					for(var i = 0; i < this.middle.length; i++) {
						this.middle[i].resetState();
					}
				}

				this.end.resetState();
				this.complete = true;

				if (this.onEnd) {
					this.onEnd();
				}

				log.debug("element complete");
				return;
			}

			if (this.start.actionRepeats == this.state.timesRepeated) {
				this.start.state.fireAction = false;
			}

			if (this.start.actionRepeats == this.state.timesRepeated) {
				this.start.state.fireAction = false;
			}
		}
	},
	resetState: function() {
		this.complete = false;
		this.state.timesRepeated = 0;
		this.middleIndex = 0;
		this.state.middleRecognized = false;
		this.start.actionRepeats = 0;
	}
});

module.exports = Element;
