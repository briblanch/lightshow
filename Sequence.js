var StatefulObject 	= require('./StatefulObject');
var extend			= require('node.extend');
var log 			= require('./log');

var Sequence = function(config) {
	StatefulObject.call(this);
	extend(this, config);
	this.state.noteBuffer = [];

};

Sequence.prototype = extend(new StatefulObject(), {
	notes: [],
	action: function() {
		throw "need to overrite action function for Sequence"
	},
	onNote: function(note, timestamp) {
		var deleteIndex = 0;
		if (!this.state.noteBuffer) {
			this.state.noteBuffer = [];
		}
		var noteBuffer = this.state.noteBuffer;
		var now = timestamp;

		noteBuffer.push({
			note: note,
			timestamp: now
		});

		for (var i = 0; i < noteBuffer.length; i++) {
			if ((now - noteBuffer[i].timestamp) > this.noteThreshold) {
				deleteIndex ++;
			}
		}

		noteBuffer.splice(0, deleteIndex);

		var justNotes = this.justNotes(noteBuffer);

		log.debug("recieved", JSON.stringify(justNotes));

		if (justNotes.contains(this.notes)) {
			this.state.recognized = true;
			log.debug("sequence recognized")
			if (typeof this.action === 'function') {
				this.action();
			}
		}
	},
	justNotes: function(array) {
		var justNotes = [];
		for (var i = 0; i < array.length; i++) {
			justNotes.push(array[i].note);
		}

		return justNotes.sort();
	},
	noteThreshold: 150
});

module.exports = Sequence;