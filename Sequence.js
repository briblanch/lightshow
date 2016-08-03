var StatefulObject 	= require('./StatefulObject');
var extend			= require('node.extend');
var log 			= require('./log');
var _               = require('lodash');

var Sequence = function(config) {
	StatefulObject.call(this);
	extend(this, config);
	this.recognized = false;
	this.state.noteBuffer = [];
	this.state.playCount = 0;
	this.state.recognizedCount = 0;
	this.state.fireAction = true;
};

Sequence.prototype = extend(new StatefulObject(), {
	notes: [],
	action: function() {
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

			if (!this.repeats || this.state.playCount == this.repeats) {
				log.debug("Sequence recognized");
				if (typeof this.action === 'function') {
					console.log("action bitch")
					if (!this.actionRepeats || this.actionRepeats > this.state.recognizedCount) {
						console.log("Firing action");
						this.action(this.state.playCount);
					}
				}

				this.recognized = true;
				this.state.recognizedCount++;
				this.state.playCount = 0;
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
		this.state.noteBuffer = [];
		this.state.playCount = 0;
		this.state.recognizedCount = 0;
		this.state.fireAction = true;
		this.recognized = false;
	}
});

module.exports = Sequence;
