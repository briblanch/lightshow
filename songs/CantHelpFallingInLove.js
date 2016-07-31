var Song        = require('../Song');
var Element    	= require('../Element');
var Sequence    = require('../Sequence');
var notes       = require('../notes');

var Hue         = require('../Hue');
var duino       = require('../arduino');

var api         = Hue.api;
var lightState  = Hue.lightState;
var Rf          = duino.Rf;

var lights = require('../hue.json').lights;

var lightColors = {
    purple: lightState.create().transition(2000).rgb(170, 0, 255).on(),
    red: lightState.create().transition(6000).rgb(255, 0, 0).brightness(80).on(),
    blue: lightState.create().rgb(0, 0, 255).transition(2000).on(),
    yellow: lightState.create().rgb(255, 255, 0).brightness(80).transition(2000).on(),
    fastBlue: lightState.create().transition(300).hsb(250,100,90).on(),
    fastRed: lightState.create().transition(300).rgb(255, 0 ,0).on(),
    fastPink: lightState.create().transition(1000).rgb(255, 0, 238).brightness(100).on(),
    fastYellow: lightState.create().rgb(255, 255, 0).brightness(100).transition(1000).on(),
    fastGreen: lightState.create().rgb(0, 255, 17).brightness(100).transition(1000).on(),
    fastYellowLow: lightState.create().rgb(255, 255, 0).brightness(1).transition(1000).on(),
    longRed: lightState.create().transition(5000).hsb(359, 100, 80).on(),
    pink: lightState.create().transition(2000).hsb(300, 100, 50).on(),
    off: lightState.create().transition(2000).off(),
}

var CantHelpFallingInLove = new Song({
    title: "Can't help falling in love",
    hook: [notes.e3, notes.g3, notes.c4],
    elements: {
        'intro': new Element({
            repeats: 2,
            start: new Sequence({
                notes: [notes.e3],
                action: function() {
                    Rf.off('1');
                    Rf.off('2');
                    api.setGroupLightState(0, lightColors.off);
                    api.setLightState(lights.piano, lightColors.longRed);
                },
                actionRepeats: 1,
            }),
            end: new Sequence({
                notes: [notes.d4],
                action: function() {

                }
            }),
            nextElement: ['verse', null]
        }),
        'bridge': new Element({
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
            repeats: 8,
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
        })
    }
});

module.exports = CantHelpFallingInLove;
