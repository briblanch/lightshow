var Song 		= require('../Song');
var Element 	= require('../Element');
var Sequence 	= require('../Sequence');
var notes 		= require('../notes');

var Hue 		= require('../Hue');
var duino 		= require('../arduino');

var api 		= Hue.api;
var lightState 	= Hue.lightState;
var Rf 			= duino.Rf;

// Light helpers
var previousLight;
var flickerTimeStamp;

var randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var flicker = function(lights) {
	if (Date.now() - flickerTimeStamp < 150) {
		return;
	}

	if (previousLight) {
		api.setLightState(previousLight, lights.off);
	}

	flickerTimeStamp = Date.now();
	var numLights = randomInt(1, 5);

	var light = randomInt(1, 5);
	api.setLightState(light, lights.on);
	previousLight = light;
};

var Clocks = new Song({
	title: "Clocks",
	hook: [notes.e1b, notes.e2b, notes.e3b],
	startingElement: 'preintro',
	elements: {
		'preintro': new Element({
			repeats: 1,
			sequences: [new Sequence({
				notes: [notes.e4b],
				action: function() {
					Rf.off('1');
					Rf.off('2');
					api.setGroupLightState(0, this.lights.off);
				},
				actionRepeats: 1,
				lights: {
					off: lightState.create().off()
				}
			}),
			new Sequence({
				notes: [notes.e5b],
				action: null
			})],
			catchAll: function(notes) {
				var now = Date.now();
				if (!this.state.timestamp) {
					this.state.timestamp = now;
					return;
				}

				if ((now - this.state.timestamp) < 200) {
					return;
				}

				this.state.timestamp = Date.now();

				var high = this.lights.high;
				var	low = this.lights.low;

				if (this.state.lightToggle) {
					api.setLightState(1, high);
					api.setLightState(2, high);
					api.setLightState(4, high);
					api.setLightState(3, high);
					api.setLightState(5, high);
					this.state.lightToggle = false;
				} else {
					api.setLightState(1, low);
					api.setLightState(2, low);
					api.setLightState(4, low);
					api.setLightState(3, low);
					api.setLightState(5, low);
					this.state.lightToggle = true;
				}
			},
			lights: {
				high: lightState.create().hsb(0, 100, 70).on(),
				low: lightState.create().hsb(0, 100, 30).on()
			},
			nextElement: 'preriff',
		}),
		'preriff': new Element({
			repeats: 2,
			sequences: [new Sequence({
				notes: [notes.e5b],
				action: function() {
					api.setGroupLightState(0, this.lights.off);
					Rf.on('1');
					Rf.on('2');
				},
				actionRepeats: 1,
				lights: {
					off: lightState.create().transition(0).off(),
				}
			}),
			new Sequence({
				notes: [notes.a4b],
				action: null
			})],
			nextElement: 'riff'
		}),
		'riff': new Element({
			repeats: 2,
			sequences: [new Sequence({
				notes: [notes.e5b],
				action: function() {
					Rf.off('1');
					Rf.off('2');
				},
				actionRepeats: 1,
				lights: {
					on: lightState.create().hsl(0,100,70).on(),
					off: lightState.create().off()
				}
			}),
			new Sequence({
				notes: [notes.b4b],
				action: null,
			}),
			new Sequence({
				notes: [notes.a4b],
				action: null,
				repeats: 3
			})],
			catchAll: function(currentSequence) {
				flicker(this.lights(currentSequence));
			},
			lights: function (currentSequence) {
				var lights = {};
				var randomHue = randomInt(214, 359);

				lights.on = lightState.create().transition(0).hsb(randomHue, 100, 100).on();
				lights.off = lightState.create().transition(0).off();

				return lights;
			},
			nextElement: ['verse', 'riff']
		}),
		'verse': new Element({
			sequences: [new Sequence({
				notes: [notes.e4b],
				action: function() {
					api.setGroupLightState(1, this.lights.off);
					api.setLightState(3, this.lights.on);
				},
				lights: {
					on: lightState.create().hsb(250,100,70).on(),
					off: lightState.create().off()
				},
				actionRepeats: 1
			}),
			new Sequence({
				notes: [notes.a3b],
				action: null,
			})],
			repeats: 4,
			nextElement: 'chorus'
		}),
		'chorus' : new Element({
			sequences: [new Sequence({
				notes: [notes.e4b],
				action: function() {
					api.setGroupLightState(1, this.lights.on);
					Rf.on('1');
					Rf.on('2');
				},
				lights: {
					on: lightState.create().hsb(0, 100, 70).on(),
					off: lightState.create().off()
				},
				actionRepeats: 1
			}),
			new Sequence({
				notes: [notes.a3b],
				action: function() {
				},
			})],
			repeats: 2,
			nextElement: 'riff'
		})
	}
});

module.exports = Clocks;
