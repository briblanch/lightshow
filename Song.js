var extend 			= require('node.extend');
var StatefulObject 	= require('./StatefulObject');

var Song = function(config) {
	extend(this, config);
};

Song.prototype = new StatefulObject({
	Title: "No Title",
	elements: null,
	startingElement: 'intro',
	onNote: function(note, timestamp) {
		if (!this._state.currentElement) {
			this._state.currentElementTitle = this.startingElement;
			this._state.currentElement = this.elements[this._state.currentElementTitle];
		} else {
			if (this._state.currentElement.complete) {
				this._state.currentElementTitle = this._state.currentElement.nextElement;
				this._state.currentElement = this.elements[this._state.currentElementTitle];
			}
		}

		this.elements[this._state.currentElementTitle].onNote(note, timestamp);
	}
});

module.exports = Song;