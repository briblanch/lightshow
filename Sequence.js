var StatefulObject 	= require('./StatefulObject');
var extend			= require('node.extend');
var log 			= require('./log');
var _               = require('lodash');

var Sequence = function(config) {
	StatefulObject.call(this);
	extend(this, config);
	this.state.noteBuffer = [];
	this.state.playCount = 0;
	this.state.fireAction = true;
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

		var notesFound = false;

		if (this.strict) {
			notesFound = justNotes.equals(this.notes);
		} else {
			notesFound = justNotes.contains(this.notes);
		}

		if (notesFound) {
			this.state.playCount++;

			if (this.repeats == undefined || this.state.playCount == this.repeats) {
				this.state.recognized = true;
				log.debug("sequence recognized");
			}

			if (typeof this.action === 'function' && this.state.fireAction) {
				this.action(this.state.playCount);
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
	noteThreshold: 150,
	resetState: function() {
		this.state = {};
		this.state.playCount = 0;
		this.state.fireAction = true;
	}
});

module.exports = Sequence;