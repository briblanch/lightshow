var extend 			= require('node.extend');
var StatefulObject 	= require('./StatefulObject');
var log			   	= require('./log');

var Element = function(config) {
	StatefulObject.call(this);
	extend(this, config);
	this.state.timesRepeated = 0;
	this.state.sequenceIndex = 0;
	this.timesPlayed = 0;
};

Element.prototype = extend(new StatefulObject(), {
	onNote: function(note, timestamp) {
		var self = this;
		var elementState = self.state;
		var currentSequence = self.sequences[elementState.sequenceIndex];

		currentSequence.onNote(note, timestamp);

		if (currentSequence.recognized) {
			currentSequence.recognized = false;

			if (elementState.sequenceIndex < self.sequences.length - 1) {
				elementState.sequenceIndex++;
			} else {
				console.log("Repeating element");
				elementState.sequenceIndex = 0;
				elementState.timesRepeated++;
			}

			if (elementState.timesRepeated == self.repeats) {
				self.complete = true;

				if (self.onEnd) {
					self.onEnd();
				}

				self.resetSequences();

				log.debug("Element complete");
				return;
			}

			currentSequence = self.sequences[elementState.sequenceIndex];
		}

		if (self.catchAll && elementState.sequenceIndex > 0) {
			self.catchAll(currentSequence);
		}
	},
	resetSequences: function() {
		for (var i = 0; i < self.sequences.length; i++) {
			self.sequences[i].resetState();
		}
	},
	resetState: function() {
		console.log("resetting element state");
		this.state = {};
		this.state.timesRepeated = 0;
		this.state.sequenceIndex = 0;
		this.resetSequences();
	}
});

module.exports = Element;
