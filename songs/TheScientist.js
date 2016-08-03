var Song        = require('../Song');
var Element    	= require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var Rf          = duino.Rf;

var TheScientist = new Song({
    title: "The Scientist",
    hook: [notes.f4, notes.b4b, notes.c5],
    startingElement: 'intro',
    elements: {
        'intro': new Element({
            repeats: 2,
            sequences: [new Sequence({
                notes: [notes.c4, notes.f4, notes.a4],
                action: function() {
                    api.setGroupLightState(0, this.lights.off)
                    .then(function() {
                        Rf.on('1');
                        Rf.on('2');
                    });
                },
                actionRepeats: 1,
                lights: {
                    off: lightState.create().off()
                }
            }),
            new Sequence({
                notes: [notes.c4, notes.f4, notes.g4],
                action: null
            })],
            nextElement: 'verse',
        }),
        'verse': new Element({
            repeats: 4,
            sequences: [new Sequence({
                notes: [notes.c4, notes.f4, notes.a4],
                action: function() {
                    api.setLightState(3, this.lights.on)
                },
                actionRepeats: 1,
                lights: {
                    on: lightState.create().rgb(255, 0, 0).brightness(70).on(),
                }
            }),
            new Sequence({
                notes: [notes.c3, notes.f3, notes.g3],
                action: null
            })],
            nextElement: 'chorus'
        }),
        'chorus': new Element({
            repeats: 2,
            sequences: [new Sequence({
                notes: [notes.d4, notes.f4, notes.b4b],
                action: function() {
                    api.setLightState(3, this.lights.on);
                    api.setLightState(5, this.lights.on);
                },
                lights: {
                    on: lightState.create().rgb(0, 21, 225).brightness(80).transition(10000).on()
                }
            }),
            new Sequence({
                notes: [notes.c4, notes.f4, notes.g4],
                action: null
            })],
            nextElement: ['verse2', 'bridge'],
        }),
        'verse2': new Element({
            repeats: 6,
            sequences: [new Sequence({
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
                    on: lightState.create().hsb(0,100, 0).transition(0).on(),
                    fade: lightState.create().hsb(0,100,70).transition(10000).on()
                }
            }),
            new Sequence({
                notes: [notes.c4, notes.f4, notes.g4],
                action: null
            })],
            nextElement: 'chorus'
        }),
        'bridge': new Element({
            repeats: 1,
            sequences: [new Sequence({
                notes: [notes.f2, notes.f3],
                action: null
            }),
            new Sequence({
                notes: [notes.f4, notes.c5],
                action: null
            })],
            nextElement: 'outro'
        }),
        'outro': new Element({
            repeats: 1,
            sequences: [new Sequence({
                notes: [notes.d4, notes.f4, notes.b4b],
                action: function() {
                    Rf.off('1');
                    Rf.off('2');
                    api.setLightState(5, this.lights.off);
                    api.setGroupLightState(1, this.lights.off);
                },
                lights: {
                    off: lightState.create().transition(0).off()
                }
            }),
            new Sequence({
                notes: [notes.f2],
                action: function () {
                    api.setLightState(3, this.lights.off);
                },
                lights: {
                    off: lightState.create().transition(3000).off()
                }
            })]
        })
    }
});

module.exports = TheScientist;
