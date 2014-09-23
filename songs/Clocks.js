var Song = require('../Song');
var Element = require('../Element');
var Sequence = require('../Sequence');
var notes = require('../notes');

var Hue = require('../Hue');
var duino = require('../arduino');

var api = Hue.api;
var lightState = Hue.lightState;
var RC = duino.RC;

// Light helpers
var previousLight;
var flickerTimeStamp;

var flicker = function(lights) {
	if (Date.now() - flickerTimeStamp < 150) {
		return;
	}

	if (previousLight) {
		api.setLightState(previousLight, lights.off);
	}

	flickerTimeStamp = Date.now();

	var light = Math.floor((Math.random() * 4) + 1);
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
			start: new Sequence({
				notes: [notes.e4b],
				action: function() {
					RC.sendOff(duino.channel);
					api.setGroupLightState(0, this.lights.off);
				},
				actionRepeats: 1,
				lights: {
					off: lightState.create().off()
				}
			}),
			end: new Sequence({
				notes: [notes.e5b],
				action: null
			}),
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
					this.state.lightToggle = false;
				} else {
					api.setLightState(1, low);
					api.setLightState(2, low);
					api.setLightState(4, low);
					this.state.lightToggle = true;
				}
			},
			lights: {
				high: lightState.create().hsl(0, 100, 70).on(),
				low: lightState.create().hsl(0, 100, 30).on()
			},
			nextElement: 'preriff',
		}),
		'preriff': new Element({
			repeats: 2,
			start: new Sequence({
				notes: [notes.e5b],
				action: function() {
					api.setGroupLightState(1, this.lights.off);
					RC.sendOn(duino.channel);
				},
				actionRepeats: 1,
				lights: {
					off: lightState.create().transition(0).off(),
				}
			}),
			end: new Sequence({
				repeats: 3,
				notes: [notes.a4b],
				action: null
			}),
			nextElement: 'riff'
		}),
		'riff': new Element({
			repeats: 2,
			start: new Sequence({
				notes: [notes.b4b],
				action: function() {
					RC.sendOff(duino.channel);
				},
				actionRepeats: 1,
				lights: {
					on: lightState.create().hsl(0,100,70).on(),
					off: lightState.create().off()
				},
				repeats: 3
			}),
			middle: [
				new Sequence({
					notes: [notes.b4b],
					action: null,
					repeats: 6
				})
			],
			end: new Sequence({
				notes: [notes.a4b],
				action: null,
				repeats: 3
			}),
			catchAll: function(currentSequence) {
				flicker(this.lights(currentSequence));
			},
			lights: function (currentSequence) {
				var lights = {};
				if (currentSequence == this.start) {
					lights.on = lightState.create().hsl(0, 100, 70).transition(0).on();
				} else if (currentSequence == this.end) {
					lights.on = lightState.create().hsl(250,100,70).transition(0).on();
				} else {
					lights.on = lightState.create().hsl(311, 95, 70).transition(0).on();
				}

				lights.off = lightState.create().transition(0).off();

				return lights;
			},
			nextElement: ['verse', 'riff']
		}),
		'verse': new Element({
			start: new Sequence({
				notes: [notes.e4b],
				action: function() {
					api.setGroupLightState(1, this.lights.off);
					api.setLightState(3, this.lights.on);
				},
				lights: {
					on: lightState.create().hsl(250,100,70).on(),
					off: lightState.create().off()
				},
				actionRepeats: 1
			}),
			end: new Sequence({
				notes: [notes.a3b],
				action: null,
				repeats: 3
			}),
			repeats: 4,
			nextElement: 'chorus'
		}),
		'chorus' : new Element({
			start: new Sequence({
				notes: [notes.e4b],
				action: function() {
					api.setGroupLightState(1, this.lights.on);
					RC.sendOn(duino.channel);
				},
				lights: {
					on: lightState.create().hsl(0, 100, 70).on(),
					off: lightState.create().off()
				},
				actionRepeats: 1
			}),
			end: new Sequence({
				notes: [notes.a3b],
				action: function() {
				},
				repeats: 3
			}),
			repeats: 2,
			nextElement: 'riff'
		})
	}
});

module.exports = Clocks;