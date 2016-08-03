var extend 			= require('node.extend');
var StatefulObject 	= require('./StatefulObject');

var Song = function(config) {
	StatefulObject.call(this);
	extend(this, config);
};

Song.prototype = extend(new StatefulObject(), {
	title: "No Title",
	elements: null,
	startingElement: 'intro',
	onNote: function(note, timestamp) {
		var self = this;
		var songState = self.state;

		if (!songState.currentElement) {
			songState.currentElement = self.elements[self.startingElement];
		}

		if (songState.currentElement) {
			songState.currentElement.onNote(note, timestamp);
		}

		if (songState.currentElement.complete) {
			songState.currentElement.complete = false;
			songState.currentElement.resetState();

			var nextElementTitle;

			if (songState.currentElement.nextElement instanceof Array) {
				nextElementTitle = songState.currentElement.nextElement[songState.currentElement.timesPlayed];
				songState.currentElement.timesPlayed++;
			} else {
				nextElementTitle = songState.currentElement.nextElement;
			}

			songState.currentElement = self.elements[nextElementTitle];
		}

		// if (!this.state.currentElement) {
		// 	this.state.currentElementTitle = this.startingElement;
		// 	this.state.currentElement = this.elements[this.state.currentElementTitle];
		// } else {
		// 	if (this.state.currentElement.complete) {
		// 		// this.state.currentElement.resetState();
		// 		this.state.currentElement.complete = false;
		// 		this.state.currentElement.timesRepeated = 0;
		// 		this.state.currentElement.middleIndex = 0;
		//
		// 		if(this.state.currentElement.nextElement instanceof Array) {
		// 			if (!this.state.currentElement.timesPlayed) {
		// 				this.state.currentElement.timesPlayed = 0
		// 			} else {
		// 				this.state.currentElement.timesPlayed ++;
		// 			}
		// 			//This element will be played again, so reset the complete property
		// 			this.state.currentElement.complete = false;
		// 			this.state.currentElement.timesRepeated = 0;
		// 			this.state.currentEle
		// 			this.state.currentElementTitle = this.state.currentElement.nextElement[this.state.currentElement.timesPlayed];
		// 		} else if (this.state.currentElement.nextElement){
		// 			this.state.currentElementTitle = this.state.currentElement.nextElement;
		// 		} else {
		// 			this.resetState();
		// 			return;
		// 		}
		//
		// 		this.state.currentElement = this.elements[this.state.currentElementTitle];
		// 	}
		// }
		//
		// this.elements[this.state.currentElementTitle].onNote(note, timestamp);
	},
	resetState: function() {
		this.state = {};
		for (var element in this.elements) {
			var currentElement = this.elements[element];
			currentElement.timesPlayed = 0;
			currentElement.complete = false;
			currentElement.resetState();
		}

		this.currentElement = null;
	}
});

module.exports = Song;
