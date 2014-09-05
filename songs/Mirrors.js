var Song 		= require('../Song');
var Element 	= require('../Element');
var Sequence 	= require('../Sequence');
var notes 		= require('../notes');

var Hue 		= require('../Hue');
var duino 		= require('../arduino');

var api 		= Hue.api;
var lightState 	= Hue.lightState;
var RC 			= duino.RC;

var Mirrors = new Song({
	title: "Mirrors",
	hook: [notes.e4b, notes.e5b, notes.b5b],
	elements: {
		'intro': new Element({
			repeats: 1,			
			start: new Sequence({
				notes: [notes.e5b],
				action: function() {
					api.setGroupLightState(1, this.lights.off);
					api.setLightState(3, this.lights.on);
				},
				actionRepeats: 1,
				lights: {
					off: lightState.create().off(),
					on: lightState.create().hsl(250, 100, 90).on()
				}
			}),
			middle: [
				new Sequence({
					notes: [notes.b3b, notes.e4b],
					action: function() {
						api.setGroupLightState(1, this.lights.on);
					},					
					lights: {
						on: lightState.create().hsl(308, 77, 90).transition(0).on()
					}
				})
			],		
			end: new Sequence({
				notes: [notes.a4b],
				action: function(playCount) {
					if (playCount == 2) {
						api.setGroupLightState(1, this.lights.off);	
					}					
				},
				repeats: 2,							
				lights: {
					off: lightState.create().transition(1.5).off(),
				}
			}),
			nextElement: ['verse', null]

		}),
		'verse': new Element({
			repeats: 1,
			start: new Sequence({				
				strict: true,				
				notes: [notes.e4b],
				action: function(playCount) {
					api.setLightState(3, this.lights.off);
					api.setGroupLightState(1, this.lights.on);											
				},				
				lights: {
					on: lightState.create().hsl(0, 100, 70).on(),
					off: lightState.create().off()
				}
			}),
			middle: [
				new Sequence({	
					strict: true,				
					notes: [notes.d4],
					action: function(playCount) {						
						api.setGroupLightState(1, this.lights.on);						
					},
					lights: {
						on: lightState.create().hsl(233, 100, 70).on()
					}
				}),
				new Sequence({	
					strict: true,				
					notes: [notes.c4],
					action: function(playCount) {						
						api.setGroupLightState(1, this.lights.on);						
					},
					lights: {
						on: lightState.create().hsl(35, 100, 70).on()
					}
				})
			],
			end: new Sequence({				
				strict: true,
				notes: [notes.e4b],				
				action: function(playCount) {			
					api.setGroupLightState(1, this.lights.on);					
				},
				lights: {
					on: lightState.create().hsl(300, 100, 70).on()
				}
			}),
			nextElement: ['chorus', 'clapchorus']
		}),
		'chorus': new Element({
			repeats: 1,
			start: new Sequence({
				notes: [notes.b3b, notes.e4b, notes.g4],
				action: function() {
					api.setGroupLightState(0, this.lights.on);
				},
				lights: {
					on: lightState.create().hsl(250,100,70).on()
				},				
			}),
			middle: [
				new Sequence({
					notes:[notes.b3b, notes.d4, notes.f4],
					action: function() {
						api.setGroupLightState(0, this.lights.on);
					},						
					lights: {
						on: lightState.create().hsl(300, 100, 70).on()
					}
				})
			],
			end: new Sequence({
				notes:[notes.a3b],
					action: function() {
						api.setGroupLightState(0, this.lights.on);
					},	
					actionRepeats: 1,
					lights: {
						on: lightState.create().hsl(233, 100, 70).on()
					}
			}),
			nextElement: 'verse'
		}),
		'clapchorus': new Element({
			repeats: 1,
			start: new Sequence({				
				notes: [notes.e4b],
				action: function() {
					api.setGroupLightState(0, this.lights.on);
				},
				lights: {
					on: lightState.create().hsl(300, 0, 90).on()
				},				
			}),
			end: new Sequence({
				notes:[notes.e4b],
				action: null				
			}),
			nextElement: 'chorus'
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

module.exports = Mirrors;