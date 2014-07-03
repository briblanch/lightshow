var Song = require('../Song');
var Element = require('../Element');
var Sequence = require('../Sequence');
var notes = require('../notes');

var Hue = require('../Hue');
var dunio = require('../arduino');

var api = Hue.api;
var lightState = Hue.lightState;
var RC = dunio.RC;

var TheScientist = new Song({
	title: "The Scientist",
	hook: [notes.f4, notes.b4b, notes.c5],
	elements: {
		'intro': new Element({
			repeats: 2,
			start: new Sequence({
				notes: [notes.c4, notes.f4, notes.a4],
				action: function() {
					// api.setGroupLightState(1, this.lights.off)
					// 	.then(api.setLightState(3, this.lights.on));
					// RC.sendOn(dunio.channel);
				},
				lights: {
					off: lightState.create().off(),
					on: lightState.create().hsl(0,100,70).transition(10).on()
				}
			}),
			end: new Sequence({
				notes: [notes.c4, notes.f4, notes.g4],
				action: null
			}),
			nextElement: 'verse',

		}),
		'verse': new Element({
			repeats: 4,
		}),
	}
});

module.exports = TheScientist;