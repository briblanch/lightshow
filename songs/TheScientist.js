var Song 		= require('../Song');
var Element 	= require('../Element');
var Sequence 	= require('../Sequence');
var notes 		= require('../notes');

var Hue 		= require('../Hue');
var duino 		= require('../arduino');

var api 		= Hue.api;
var lightState 	= Hue.lightState;
var RC 			= duino.RC;

var TheScientist = new Song({
	title: "The Scientist",
	hook: [notes.f4, notes.b4b, notes.c5],
	elements: {
		'intro': new Element({
			repeats: 2,
			start: new Sequence({
				notes: [notes.c4, notes.f4, notes.a4],
				action: function() {
					api.setGroupLightState(0, this.lights.off)
					.then(RC.sendOn(duino.channel));
				},
				actionRepeats: 1,
				lights: {
					off: lightState.create().off()
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
			start: new Sequence({
				notes: [notes.c4, notes.f4, notes.a4],
				action: function() {
					api.setLightState(3, this.lights.on)
				},
				actionRepeats: 1,
				lights: {
					on: lightState.create().hsl(0, 100, 70).on(),
				}
			}),
			end: new Sequence({
				notes: [notes.c4, notes.f4, notes.g4],
				action: null
			}),
			nextElement: 'chorus'
		}),
		'chorus': new Element({
			repeats: 2,
			start: new Sequence({
				notes: [notes.d4, notes.f4, notes.b4b],
				action: function() {
					api.setLightState(3, this.lights.on);
				},
				lights: {
					on: lightState.create().hsl(250,100,70).transition(10).on()
				}
			}),
			end: new Sequence({
				notes: [notes.c4, notes.f4, notes.g4],
				action: null
			}),
			nextElement: ['verse2', 'bridge'],
		}),
		'verse2': new Element({
			repeats: 6,
			start: new Sequence({
				notes: [notes.c4, notes.f4, notes.a4],
				action: function() {
					var fade = this.lights.fade;
					api.setGroupLightState(1, this.lights.on);
					setTimeout(function() {
						api.setGroupLightState(1, fade);
					}, 1000);
				},
				actionRepeats: 1,
				lights: {
					on: lightState.create().hsl(0,100, 0).transition(0).on(),
					fade: lightState.create().hsl(0,100,70).transition(10).on()
				}
			}),
			end: new Sequence({
				notes: [notes.c4, notes.f4, notes.g4],
				action: null
			}),
			nextElement: 'chorus'
		}),
		'bridge': new Element({
			repeats: 1,
			start: new Sequence({
				notes: [notes.f2, notes.f3],
				action: null
			}),
			end: new Sequence({
				notes: [notes.f4, notes.c5],
				action: null
			}),
			nextElement: 'outro'
		}),
		'outro': new Element({
			repeats: 1,
			start: new Sequence({
				notes: [notes.d4, notes.f4, notes.b4b],
				action: function() {
					api.setGroupLightState(1, this.lights.off);
				},
				lights: {
					off: lightState.create().transition(4).off()
				}
			}),
			end: new Sequence({
				notes: [notes.f2],
				action: function () {
					api.setLightState(3, this.lights.off);
					setTimeout(function() {
						RC.sendOff(duino.channel);
					},3000);
				},
				lights: {
					off: lightState.create().transition(3).off()
				}
			})
		})
	}
});

module.exports = TheScientist;