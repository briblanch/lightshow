var StatefulObject 	= require('./StatefulObject');
var extend			= require('node.extend');

var Sequence = function(config) {
	this._state.noteBuffer = [];
	extend(this, config);
};

Sequence.prototype = new StatefulObject({
	notes: [],
	action: function() {
		throw "need to overrite action function for Sequence"
	},
	onNote: function(note, timestamp) {
		var deleteIndex = 0;
		if (!this._state.noteBuffer) {
			this._state.noteBuffer = [];
		}
		var noteBuffer = this._state.noteBuffer;
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

		console.log("Recieved", JSON.stringify(justNotes));

		if (justNotes.contains(this.notes)) {
			this._state.recognized = true;
			console.log("Sequence recognized")
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